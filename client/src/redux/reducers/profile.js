import * as acttionTypes from '../actions/types';


const initialState = {

    profile: null,
    profiles: [],
    loading: true,
    userDetails: null
}


const profile = (state = initialState, action) => {

    const { type, payload } = action;
    switch (type) {
        case acttionTypes.GET_PROFILE:
            return {
                ...state,
                profile: payload.profile,
                userDetails: payload.userDetails,
                loading: false
            }
        case acttionTypes.GET_PROFILES:
            return {
                ...state,
                profiles: [...state.profiles, payload],
                loading: false
            }


        default:
            return state;
    }



}

export default profile;