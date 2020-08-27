import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  login,
  facebookLoginUrl,
  githubLoginUrl,
} from '../../reducers/auth/actions'
import {pathTo} from '../../routes'
import {commitAddLog} from '../../reducers/logs/actions'
import {Link, navigate} from 'gatsby'
import {faSignInAlt, faUser, faKey} from '@fortawesome/free-solid-svg-icons'
import {faFacebookF, faGithub} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class Login extends Component {
  state = {
    username: null,
    password: null,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmit = e => {
    e.preventDefault()

    this.props
      .dispatch(login(this.state.username, this.state.password))
      .then(() => {
        if (this.props.auth.isAuthenticated) {
          return navigate(pathTo('settings'))
        } else {
          return this.props.dispatch(commitAddLog(this.props.auth.statusText))
        }
      })
  }

  render() {
    const {auth, env} = this.props
    const {username, password} = this.state

    return (
      <section className="section container-fluid">
        <h3>Login</h3>
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <div className="card mb-3">
              <article className="card-body">
                <form>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><FontAwesomeIcon icon={faUser}/></div>
                      </div>
                      <input
                        className="form-control"
                        id="username{{ _uid }}"
                        type="text"
                        value={username || ''}
                        onChange={this.onChangeUsername}
                        placeholder="Email or Username"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><FontAwesomeIcon icon={faKey}/></div>
                      </div>
                      <input
                        className="form-control"
                        id="password{{ _uid }}"
                        type="password"
                        value={password || ''}
                        onChange={this.onChangePassword}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={auth.isAuthenticating}
                          onClick={this.onSubmit}
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                {env.facebookAppId && (
                  <p>
                    <a
                      href={facebookLoginUrl(env.facebookAppId)}
                      className="btn btn-block btn-social btn-facebook"
                    >
                      <FontAwesomeIcon icon={faFacebookF}/> Login with Facebook
                    </a>
                  </p>
                )}
                {env.githubAppId && (
                  <p>
                    <a
                      href={githubLoginUrl(env.githubAppId)}
                      className="btn btn-block btn-social btn-github"
                    >
                      <FontAwesomeIcon icon={faGithub}/> Login with Github
                    </a>
                  </p>
                )}
              </article>
            </div>
            <p>
              <Link to={pathTo('register')}>
                <span
                  className="glyphicon glyphicon-log-in register"
                  aria-hidden="true"
                />{' '}
                <FontAwesomeIcon icon={faSignInAlt}/> Register
              </Link>
            </p>
          </div>
        </div>
      </section>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    env: state.env,
  }
})(Login)
