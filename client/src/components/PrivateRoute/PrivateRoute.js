import React from 'react'
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
const PrivateRoute = (props) => {
    const { Component, ...res } = props;

    if (props.isAuth) {
        return <Route {...res} render={() => <Component />} />
    }

    return <Redirect to="/login" />

}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})
export default connect(mapStateToProps)(PrivateRoute);
