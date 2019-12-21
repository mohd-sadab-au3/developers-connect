import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import Alert from '../UI/Alert';
// import { alert } from '../../redux/actions/alert';
import * as actionTypes from '../../redux/actions/types';
import uuid from 'uuid';
import { register } from '../../redux/actions/register';
import { Redirect, Link } from 'react-router-dom';

const Register = (props) => {

    useEffect(() => {
        console.log("UseEffect get called");
    }, [])
    //console.log(props);
    let [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    })

    const onChangeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const { name, email, password, password2 } = formData;
    const onSubmitHandler = (e) => {
        e.preventDefault();
        props.onAlertHide();
        if (password !== password2) {
            props.onAlert({
                msg: "Password is not matched",
                alertType: "danger",
                id: uuid.v4()
            });
        }
        else {

            console.log("props");
            props.onRegister(formData);
        }

    }

    if (!props.auth.loading && !props.auth.error) {
        return (<Redirect to="/login" />);
    }


    return (
        <section className="container">

            <div className="row">
                <div className="col-sm-3" />
                <div className="col-sm-8 col-md-6">
                    {!props.error.loading && props.error.msg.map(elem => (<Alert key={elem.id} alertType={`alert alert-${elem.alertType}`} msg={elem.msg} />))}

                    {!props.auth.loading && props.auth.msg.map((elem, index) => (<Alert key={index} alertType={`alert alert-danger`} msg={elem.msg} />))}

                    <h1 className="large text-primary">Sign Up</h1>
                    <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                    <form className="form" onSubmit={(e) => onSubmitHandler(e)}>
                        <div className="form-group">
                            <input type="text" placeholder="Name" name="name" required
                                onChange={(e) => onChangeHandler(e)} value={name} />
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="Email Address" name="email"
                                onChange={(e) => onChangeHandler(e)} value={email} />
                            <small className="form-text"
                            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                minLength="6"
                                onChange={(e) => onChangeHandler(e)} value={password} />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="password2"
                                minLength="6"
                                onChange={(e) => onChangeHandler(e)} value={password2} />
                        </div>
                        <input type="submit" className="btn btn-primary" value="Register" />
                    </form>
                    <p className="my-1">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
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

    onAlert: (payload) => dispatch({
        type: actionTypes.SHOW_ALERT_MSG,
        payload
    }),
    onAlertHide: () => dispatch({
        type: actionTypes.HIDE_ALERT_MSG
    }),
    onRegister: (formData) => dispatch(register(formData))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);
