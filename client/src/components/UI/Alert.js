import React from 'react';

let Alert = (props) => {
    return (
        <div className={props.alertType}>
            {props.msg}
        </div>
    )
}

export default Alert;
