import { takeLatest, all, fork } from 'redux-saga/effects';

import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_LOGIN_SUCCESS, AUTH_GET_PROFILE, loginFailed, loginSuccess, logout } from './auth-actions';

import { processLogic, registerAction } from '../../helpers/saga-helper';
import * as api from './auth-api';
import getAuth from './auth-selectors';

const login = processLogic({
    execFn: ( state, { username, password }) => {
        return api.login(username, password);
    },
    errorAction: ( err => loginFailed( err ) ),
    nextAction: (({ token }) => loginSuccess(token))
});

const loadProfile = processLogic({
    execFn: ( state ) => {

        let authState = getAuth( state );

        console.log('authState.token ', authState.token );
        
        return api.getProfile( authState.token );
    }
});

function* authSagas() {
    yield all ([
        fork( takeLatest, AUTH_LOGIN, login ),
        fork( takeLatest, AUTH_LOGOUT, logout ),
        fork( registerAction, AUTH_LOGIN_SUCCESS, loadProfile ),
    ]);
}

export default authSagas;
