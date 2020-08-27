const {createFilePath} = require(`gatsby-source-filesystem`)
const _ = require('lodash')
const fs = require('fs')
const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development'

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

exports.onCreateWebpackConfig = ({stage, loaders, actions}) => {
  const isSSR = stage.includes(`html`)

  let config = {
    module: {
      rules: isSSR ? [
        {
          test: /brace/,
          use: loaders.null(),
        }
      ] : [],
    }
  }
  if (activeEnv === 'production') {
    config.devtool = false
  }

  actions.setWebpackConfig(config)
}

exports.onCreateNode = ({node, getNode, actions}) => {
  const {createNodeField} = actions;

  if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent);

    if (parent.internal.type === "File") {
      const slug = createFilePath({node, getNode, trailingSlash: false}).substr(1)
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })

      createNodeField({
        name: `sourceName`,
        node,
        value: parent.sourceInstanceName
      });
    }
  } else if (node.internal.type === `ContributorsYaml`) {
    const slug = _.kebabCase(node.name)
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({graphql, actions, reporter}) => {
  const {createPage} = actions

  const result = await graphql(`
    {
      articles: allMdx(
        filter: {fields: {sourceName: {eq: "blog"}}},
        sort: {fields: frontmatter___date, order: DESC}
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
            tags
            author {
              fields {
                slug
              }
            }
          }
        }
      }
      docs: allMdx(
        filter: {fields: {sourceName: {eq: "doc"}}}
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
      docNav: allDocsYaml
      {
        nodes {
          title
          items {
            link
            title
          }
        }
      }
    }
    `)

  if (result.errors) {
    reporter.panic(result.errors)
  }

  const {
    articles,
    docNav,
    docs,
  } = result.data
  const docsBySlug = docs.nodes.reduce((value, doc) => {
    value[`/docs${doc.fields.slug ? '/' + doc.fields.slug : ''}`] = doc
    return value
  }, {})

  const docItems = docNav.nodes.reduce((value, docSection) => {
    docSection.items.forEach((docItem) => {
      const slug = docItem.link
      const doc = docsBySlug[slug]
      if (doc !== undefined) {
        value.push(doc)
      }
    })
    return value
  }, [])
  docItems.forEach((doc, index) => {
    const previous = index === 0 ? null : docItems[index - 1]
    const next = index === docItems.length - 1 ? null : docItems[index + 1]
    createPage({
      path: `/docs${doc.fields.slug ? '/' + doc.fields.slug : ''}`,
      component: require.resolve("./src/templates/doc.js"),
      context: {
        ...doc,
        previous,
        next,
      },
    })
  })

  const tags = {}
  const contributorSet = new Set()
  articles.nodes.forEach((article, index) => {
    article.frontmatter.tags.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    })
    contributorSet.add(article.frontmatter.author.fields.slug)

    const previous = index === articles.nodes.length - 1 ? null : articles.nodes[index + 1]
    const next = index === 0 ? null : articles.nodes[index - 1]
    createPage({
      path: `/blog/${article.fields.slug}`,
      component: require.resolve("./src/templates/article.js"),
      context: {
        ...article,
        previous,
        next,
      },
    })
  })

  createPage({
    path: `/blog/tags`,
    component: require.resolve("./src/templates/tags.js"),
    context: {
      tags
    }
  });

  const tagList = Object.keys(tags);
  tagList.forEach(tag => {
    createPage({
      path: `/blog/tags/${tag}`,
      component: require.resolve("./src/templates/tag.js"),
      context: {
        tag
      }
    });
  });

  const contributorList = Array.from(contributorSet);
  contributorList.forEach(contributor => {
    createPage({
      path: `/blog/contributors/${contributor}`,
      component: require.resolve("./src/templates/contributor.js"),
      context: {
        slug: contributor
      }
    });
  });
}

const replacePath = _path => (_path === `/` ? _path : _path.replace(/\/$/, ``))

exports.onCreatePage = ({page, actions}) => {
  const {createPage, deletePage} = actions

  return new Promise(resolve => {
    const oldPage = Object.assign({}, page)
    page.path = replacePath(page.path)
    if (page.path !== oldPage.path) {
      deletePage(oldPage)
      createPage(page)
    }
    resolve()
  })
}
