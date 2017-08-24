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

const APP_STORE = 'demoAuth';

class RootReducer {

    constructor() {
        this._rootReducerObj = {};
        this._rootReducer = null;
    }

    addReducer(key, reducer) {
        this._rootReducerObj[key] = reducer;
    }

    combine() {
        this._rootReducer = combineReducers(this._rootReducerObj);
    }

    get rootReducer() {
        return this._rootReducer;
    }

};

class AppMain {

    constructor({ appStoreName, reducers, storage, transforms }) {
        this._rootReducer = new RootReducer();
        this._store = null;
        this._sagaMiddleware = null;

        this.storage = storage;
        this.appStoreName = appStoreName;

        if (Array.isArray(transforms)) {
            this.transforms = transforms;
        } else {
            this.transforms = [transforms];
        }

        this.reducers = reducers;
    }

    buildRootReducer() {

        for (let key in this.reducers) {
            console.log('buildRootReducer key ', key );
            this._rootReducer.addReducer(key, this.reducers[key]);
        }

        this._rootReducer.combine();

        console.log('STARTING...'); 
        return this;
    }

    buildSagaMiddleware() {
        console.log('buildSagaMiddleware' );
        this._sagaMiddleware = createSagaMiddleware();
        return this;
    }

    buildStore() {
        if (!this._rootReducer) throw new Error('Build Root Reducer First');
        if (!this._sagaMiddleware) throw new Error('Build Saga Middleware First');

        console.log('buildStore' );

        this._store = createStore(
            this._rootReducer.rootReducer,
            undefined,
            compose(
                applyMiddleware(this._sagaMiddleware),
                autoRehydrate()
            )
        );

        persistStore( this._store, { storage: this.storage, keyPrefix: this.appStoreName, transforms: this.transforms });

        return this;
    }

    get store() {
        return this._store;
    }

    get sagaMiddleware() {
        return this._sagaMiddleware;
    }

    static execute(appStoreName, reducers, storage, transforms) {

        try {

            if (AppMain.app) throw new Error('Application is running already.');

            console.log('STARTING...');

            AppMain.app = (new AppMain( { appStoreName, reducers, storage, transforms })).buildRootReducer().buildSagaMiddleware().buildStore();

            console.log('buildStore sagaMiddleware.run' );

            AppMain.app.sagaMiddleware.run(authSagas, AppMain.app.store.getState);

            ReactDOM.render(<Provider store={AppMain.app.store}><App /></Provider>, document.getElementById('root'));

            registerServiceWorker();

        } catch (err) {
            console.error('ERROR ', err);
            AppMain.app = null;
        }

    }
}

let reducers = {};
reducers[AUTH_MOD_NAME] = authReducer;

AppMain.execute(APP_STORE, reducers, localForage, [authTransform]);
