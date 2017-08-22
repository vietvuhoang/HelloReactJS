import {createTransform } from 'redux-persist';
import AUTH_MOD_NAME from './auth-module-name';
import authStates from './auth-states';

const ignorePendingState = (state) => {
    if (!state.state) return { state: authStates.AUTH_NONE };
    else if (state.state && state.state === authStates.AUTH_PENDING) return { state: authStates.AUTH_NONE };
    else return state;
};

const authTransform = createTransform( ignorePendingState, ignorePendingState,  { whitelist: AUTH_MOD_NAME } );

export default authTransform;
