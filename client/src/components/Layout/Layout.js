import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const Layout = (props) => {

    let UI = null;
    if (props.isAuth) {
        UI = (<ul className="ml-auto my-1 navbar-nav">
            <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/profile">Profile</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/logout">Logout</NavLink>
            </li>
        </ul>
        )
    }
    else {
        UI = (<ul className="ml-auto my-1 navbar-nav">
            <li className="nav-item">
                <NavLink className="nav-link" to="!#">Developers</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/register">Register</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
        </ul>
        )
    }
    return (
        <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
            <NavLink className="navbar-brand " to="/">Dev-Connector</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon "></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {UI}
            </div>

        </nav>
    )
}
const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})
export default connect(mapStateToProps)(Layout);
