import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import { persistStore, autoRehydrate, createTransform } from 'redux-persist';
import 'babel-polyfill';

import localForage from 'localforage';
import createSagaMiddleware from 'redux-saga';
import { authSagas, authReducer, authStates } from './controllers/auth';
import { Provider } from 'react-redux';

const rootReducer = combineReducers({
    auth: authReducer
});

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer,
    undefined,
    compose(
        applyMiddleware(sagaMiddleware),
        autoRehydrate()
    )
)

const pendingTransform = createTransform(
    (state) => {
        if (!state.state) return { state: authStates.AUTH_NONE };
        else if (state.state && state.state === authStates.AUTH_PENDING) return { state: authStates.AUTH_NONE };
        else return state;
    },
    (state) => {
        if (!state.state) return { state: authStates.AUTH_NONE };
        else if (state.state && state.state === authStates.AUTH_PENDING) return { state: authStates.AUTH_NONE };
        else return state;
    },
    { whitelist: 'auth' }
)

// begin periodically persisting the store

persistStore(store, { storage: localForage, keyPrefix: 'demoAuth', transforms: [pendingTransform] });

sagaMiddleware.run(authSagas, store.getState);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
