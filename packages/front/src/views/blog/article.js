import React, {Component} from 'react'
import {Link} from 'gatsby'
import {MDXRenderer} from 'gatsby-plugin-mdx'
import Img from 'gatsby-image'
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {pathTo} from '../../routes'
import {MDXProvider} from '../../components'

class Article extends Component {
  render() {
    const {article, previous, next} = this.props

    return (
      <section className="section container-fluid">
        <figure className="figure-fluid">
          {article.frontmatter.cover.childImageSharp && (
            <Img
              className="figure-img img-fluid"
              fluid={article.frontmatter.cover.childImageSharp.fluid}
              alt="Cover"
            />
          )}
          {article.frontmatter.cover.extension === 'svg' && (
            <img
              className="figure-img img-fluid"
              src={article.frontmatter.cover.publicURL}
              alt="Cover"
            />
          )}
          <figcaption className="figure-caption text-center">
            credit <a href={article.frontmatter.coverOriginalUrl}
                      target="_blank"
                      rel="noopener noreferrer">{article.frontmatter.coverAuthor}</a>
          </figcaption>
        </figure>

        <h3 className="my-4">{article.frontmatter.title}</h3>

        <div className="row pt-4 mb-3">
          <div className="col-sm-12 text-center">
            <small>
              Posted {article.frontmatter.date} by
              <Img
                fixed={article.frontmatter.author.image.childImageSharp.fixed}
                width="36"
                height="36"
                alt={article.frontmatter.author.name}
                className="rounded-circle mx-2"
                style={{verticalAlign: 'middle'}}
              />
              <Link
                to={pathTo('contributor', {
                  slug: article.frontmatter.author.fields.slug,
                })}
              >
                {article.frontmatter.author.name}
              </Link>
              <span> - </span>
              <i>{article.timeToRead} min read</i>
            </small>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-12">
            <MDXProvider>
              <MDXRenderer>{article.body}</MDXRenderer>
            </MDXProvider>
          </div>
        </div>

        <div className="row">
          <div className="col-auto mr-auto">
            {previous && (
              <Link
                to={pathTo('article', {slug: previous.fields.slug})}
                className="pull-left"
              >
                <FontAwesomeIcon icon={faArrowLeft}/>{' '}
                {previous.frontmatter.title}
              </Link>
            )}
          </div>
          <div className="col-auto">
            {next && (
              <Link
                to={pathTo('article', {slug: next.fields.slug})}
                className="pull-right"
              >
                {next.frontmatter.title} <FontAwesomeIcon icon={faArrowRight}/>
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }
}

export default Article
