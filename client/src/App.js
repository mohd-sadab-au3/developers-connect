import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Landing from './components/Landing/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Provider } from 'react-redux';
import store from './redux/store';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Dashboard from './components/Profile/Dashboard';



function App() {
  return (
    <Provider store={store}>
      <Router>
        <React.Fragment>
          <Layout />
          <Route exact path="/" component={Landing} />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/dashboard" Component={Dashboard} />

          </Switch>
        </React.Fragment>
      </Router>
    </Provider>
  );
}

export default App;
