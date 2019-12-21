import * as actionTypes from '../actions/types';

const initialState = {
    msg: [],
    loading: true,
    token: null,
    isAuth: false
};

let register = (state = initialState, action) => {

    const { type, payload } = action;

    switch (type) {

        case actionTypes.IS_LOGGED_IN:
            return ({
                ...state,
                msg: [],
                loading: false,
                token: localStorage.token,
                isAuth: localStorage.token ? true : false
            });

        case actionTypes.REGISTER_SUCCESS:
            localStorage.setItem('token', payload);
            return ({
                ...state,
                msg: [],
                loading: false,
                token: payload
            });
        case actionTypes.LOGIN_SUCCESS:
            localStorage.setItem('token', payload);
            return ({
                ...state,
                msg: [],
                loading: false,
                token: payload,
                isAuth: true
            });
        case actionTypes.REGISTER_FAIL:
        case actionTypes.LOGIN_FAIL:
            console.log("payload", payload);
            localStorage.removeItem('token');

            return ({
                ...state,
                msg: [...payload],
                token: null,
                loading: false,
                isAuth: false
            });


        default:
            return state;
    }

}

export default register;