import { takeLatest, all, fork } from 'redux-saga/effects';

import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_LOGIN_SUCCESS, AUTH_GET_PROFILE, loginFailed, loginSuccess, logout, getProfile } from './auth-actions';

import { processLogic, registerAction } from '../../helpers/saga-helper';
import * as api from './auth-api';
import getAuth from './auth-selectors';

const login = processLogic({
    execFn: ( state, { username, password }) => {
        return api.login(username, password);
    },
    errorAction: ( err => loginFailed( err ) ),
    nextAction: (({ token }) => loginSuccess(token)),
});

const loadProfile = processLogic({
    execFn: ( state ) => {
        return api.getProfile( getAuth( state ).token );
    },
    nextAction: ((profile ) => getProfile( profile )),
});

function* authSagas() {
    yield all ([
        fork( takeLatest, AUTH_LOGIN, login ),
        fork( takeLatest, AUTH_LOGOUT, logout ),
        fork( registerAction, AUTH_LOGIN_SUCCESS, loadProfile ),
    ]);
}

export default authSagas;
