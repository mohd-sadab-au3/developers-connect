import * as actionTypes from './types';
import axios from 'axios';

export const profile = () => {
    console.log("profile action");
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.token
            }
        };
        let res;
        try {
            res = await axios.get("http://localhost:5001/api/profile/me", config);
            console.log("response", res.data);
            dispatch({
                type: actionTypes.GET_PROFILE,
                payload: res.data
            })
        } catch (error) {
            console.log("error", error.response);
            dispatch({
                type: actionTypes.SHOW_ALERT_MSG,
                payload: error.response ? error.response.data.error : null
            })
        }
    }
}
