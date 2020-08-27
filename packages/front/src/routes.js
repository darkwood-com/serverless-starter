import {
  Admin,
  Article,
  Blog,
  Contact,
  Contributor,
  Doc,
  Home,
  Login,
  FacebookLogin,
  GithubLogin,
  Register,
  Settings,
  Tag,
  Tags,
  Changelog,
} from './views'

import {compile} from 'path-to-regexp'
import {requireAuthentication} from './helpers'
import {matchPath} from './utils'

const routes = {
  home: {
    path: '/',
    exact: true,
    component: Home,
  },
  login: {
    path: '/login',
    exact: true,
    component: Login,
  },
  facebookLogin: {
    path: '/login/facebook',
    exact: true,
    component: FacebookLogin,
  },
  githubLogin: {
    path: '/login/github',
    exact: true,
    component: GithubLogin,
  },
  register: {
    path: '/register',
    exact: true,
    component: Register,
  },
  contact: {
    path: '/contact',
    component: Contact,
  },
  doc: {
    path: '/docs/:slug?',
    component: Doc,
  },
  changelog: {
    path: '/changelog',
    component: Changelog,
  },
  contributor: {
    path: '/blog/contributors/:slug',
    component: Contributor,
  },
  tag: {
    path: '/blog/tags/:tag',
    component: Tag,
  },
  tags: {
    path: '/blog/tags',
    component: Tags,
  },
  article: {
    path: '/blog/:slug',
    component: Article,
  },
  blog: {
    path: '/blog',
    component: Blog,
  },
  settings: {
    path: '/settings',
    component: requireAuthentication(Settings),
  },
  admin: {
    path: '/admin',
    component: requireAuthentication(Admin, 'ROLE_SUPER_ADMIN'),
  },
}

export const pathTo = (route, params = {}) => {
  if (!(route in routes)) {
    throw new Error(`There is no such view as ${route}`)
  }

  return compile(routes[route].path)(params)
}

export const matchRoute = pathname => {
  let keys = Object.keys(routes)

  let match = null

  let route = null

  for (let i = 0; i < keys.length; i++) {
    route = keys[i]
    match = matchPath(pathname, {
      path: routes[route].path,
      exact: routes[route].exact,
    })

    if (match) {
      return {
        route: route,
        match: match,
      }
    }
  }

  return null
}

export default routes
