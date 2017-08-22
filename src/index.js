import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import 'babel-polyfill';

import localForage from 'localforage';
import createSagaMiddleware from 'redux-saga';
import { authSagas, authReducer, authTransform, AUTH_MOD_NAME } from './controllers/auth';
import { Provider } from 'react-redux';

const rootReducerObj = {};

rootReducerObj[ AUTH_MOD_NAME ] = authReducer;

const rootReducer = combineReducers( rootReducerObj );

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer,
    undefined,
    compose(
        applyMiddleware(sagaMiddleware),
        autoRehydrate()
    )
);

persistStore(store, { storage: localForage, keyPrefix: 'demoAuth', transforms: [authTransform] });

sagaMiddleware.run(authSagas, store.getState);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
