import React, { Component } from 'react';
import { Link } from 'react-router';
import { Router, Route, Redirect, IndexRoute } from 'react-router';
import history from './history'
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import App from 'ui/App';
import MyComponent from 'ui/Component';
import PrivatePage from 'ui/PrivatePage';
import LoginPage from 'ui/LoginPage';
import logout from 'actions/logout';

export default class RouterComponent extends Component {

  render() {
    return (
      <Provider store={this.props.store}>
        {() =>
          <Router history={history}>
            <Route name="app" component={App} path="/">
              <IndexRoute component={MyComponent}/>
              <Route component={PrivatePage} path="private" onEnter={this.requireAuth.bind(this)}/>
              <Route path="login" component={LoginPage}/>
              <Route path="logout" onEnter={this.onLogout.bind(this)}/>
            </Route>
          </Router>
        }
      </Provider>
    );
  }

  requireAuth(nextState, redirectTo) {
    const isAuthenticated = this.props.isAuthenticated;
    if (!isAuthenticated) {
      redirectTo({nextPathname: nextState.location.pathname}, '/login')
    }
  }

  onLogout() {
    this.props.logout().then(() => {
      history.replaceState(null, '/login');
    })
  }
}

export default connect(
    state => ({isAuthenticated: state.authentication.isAuthenticated}),
    dispatch => (bindActionCreators({logout}, dispatch))
)(RouterComponent);
