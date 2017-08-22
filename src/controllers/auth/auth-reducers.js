import authStates from './auth-states'
import * as authActions from './auth-actions'

const initialState = {
    state: authStates.AUTH_NONE
}

export default function (state = initialState, action) {
    switch ( action.type) {
        case authActions.AUTH_LOGIN:
            return {
                state: authStates.AUTH_PENDING
            };
        case authActions.AUTH_LOGIN_SUCCESS:
            return {
                state: authStates.AUTH_LOGGED_IN,
                token: action.payload.token
            };
        case authActions.AUTH_GET_PROFILE:
            return { ...state, state: authStates.AUTH_READY, currentUser: action.payload.profile };
        case authActions.AUTH_LOGIN_FAILED:
            return { ...initialState, error : action.payload.error }        
        case authActions.AUTH_LOGOUT:
        default:
            return initialState;
    };
}
