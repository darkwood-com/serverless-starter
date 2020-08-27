import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSettings} from '../reducers/user/actions'

class UserManager extends Component {
  state = {
    fetching: false,
  }

  componentDidMount() {
    const {auth} = this.props

    if (auth.isAuthenticated) {
      this.onFetchUser(auth.token)
    }
  }

  componentDidUpdate(prevProps) {
    const {auth} = this.props

    if (auth.token !== prevProps.auth.token && auth.isAuthenticated) {
      this.onFetchUser(auth.token)
    }
  }

  onFetchUser = token => {
    Promise.all([
      this.props.dispatch(fetchSettings(token)),
    ])
  }

  render() {
    return <></>
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
  }
})(UserManager)
