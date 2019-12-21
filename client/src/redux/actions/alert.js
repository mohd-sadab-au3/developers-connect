import * as actionTypes from '../../redux/actions/types';

export const alert = (payload, actionType) => dispatch => ({
    alertMsgShow: () => dispatch({
        type: actionTypes.SHOW_ALERT_MSG,
        payload,
        actionType
    })
})