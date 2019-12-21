import * as actionTypes from './types';
import axios from 'axios';

export const register = (formData) => {
    console.log("alert", formData);
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let res;
        try {
            res = await axios.post("http://localhost:5001/api/user", formData, config);
            dispatch({
                type: actionTypes.REGISTER_SUCCESS,
                payload: res.data.token
            })
        } catch (error) {
            console.log("error", error.response);
            dispatch({
                type: actionTypes.REGISTER_FAIL,
                payload: error.response.data.error
            })
        }
    }
}
