
export const AUTH_LOGIN = 'LOGIN';
export const AUTH_LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILED = 'LOGIN_FAILED';
export const AUTH_LOGOUT = 'LOGOUT';
export const AUTH_GET_PROFILE = 'PROFILE';

export function login(username, password) {

    return {
        type: AUTH_LOGIN,
        payload: {
            username,
            password
        }
    };
}

export function loginSuccess(token) {
    console.log('AUTH_LOGIN_SUCCESS');
    return {
        type: AUTH_LOGIN_SUCCESS,
        payload: {
            token
        }
    }
}

export function loginFailed( error ) {

    return {
        type: AUTH_LOGIN_FAILED,
        payload: {
            error
        }
    }
}

export function logout() {
    return {
        type: AUTH_LOGOUT
    }
}

export function getProfile() {
    return {
        type: AUTH_GET_PROFILE
    }
}
