import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import Alert from '../UI/Alert';
// import { alert } from '../../redux/actions/alert';
import { login } from '../../redux/actions/login';
import { Redirect, Link } from 'react-router-dom';
import * as actionTypes from '../../redux/actions/types';


const Login = (props) => {

    const { checkLogin } = props;
    useEffect(() => {
        checkLogin();
    }, [checkLogin]);

    let [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const onChangeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const { email, password } = formData;
    const onSubmitHandler = (e) => {
        e.preventDefault();

        console.log("props");
        props.onLogin(formData);

    }

    if (!props.auth.loading && props.auth.isAuth) {
        return (<Redirect to="/dashboard" />);
    }

    if (props.auth.loading) {
        return (<div className="mt-5">Loading </div>);
    }

    return (
        <section className="container">
            <div className="row">
                <div className="col-md-3 col-sm-3" />
                <div className="col-md-6 col-sm-8">
                    {!props.auth.loading && props.auth.msg.map((elem, index) =>
                        <Alert key={index} alertType="alert alert-danger" msg={elem.msg} />)}
                    <div className="card">
                        <h1 className="large text-primary card-header">Sign In</h1>
                        <div className="card-body">
                            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
                            <form className="form" onSubmit={(e) => onSubmitHandler(e)}>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        name="email"
                                        required
                                        onChange={(e) => onChangeHandler(e)} value={email}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        onChange={(e) => onChangeHandler(e)} value={password}
                                    />
                                </div>
                                <input type="submit" className="btn btn-primary btn-block" value="Login" />
                            </form>
                            <p className="my-1 text-center">
                                Don't have an account? <Link to="/register">Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const mapStateToProps = (state) => ({
    error: state.alert,
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({

    onLogin: (formData) => dispatch(login(formData)),
    checkLogin: (formData) => dispatch({ type: actionTypes.IS_LOGGED_IN })
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
