import * as actionTypes from '../actions/types';

const initialState = {
    msg: [],
    loading: true
};

let alert = (state = initialState, action) => {

    const { type, payload } = action;

    switch (type) {

        case actionTypes.SHOW_ALERT_MSG:
            return ({
                ...state,
                msg: [...state.msg, payload],
                loading: false
            });
        case actionTypes.HIDE_ALERT_MSG:
            return ({
                ...state,
                msg: [],
                loading: false
            });


        default:
            return state;
    }

}

export default alert;