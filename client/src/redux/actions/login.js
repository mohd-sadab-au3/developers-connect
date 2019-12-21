import * as actionTypes from './types';
import axios from 'axios';

export const login = (formData) => {
    console.log("alert", formData);
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let res;
        try {
            res = await axios.post("http://localhost:5001/api/auth", formData, config);
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: res.data.token
            })
        } catch (error) {
            console.log("error", error.response);
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                payload: error.response.data.error
            })
        }
    }
}
