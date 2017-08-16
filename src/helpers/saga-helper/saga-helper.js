
import { call, put, take, race, fork, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

const TIMEOUT_DEF = 3000;
const ERR_CANCELLED = 'Task Cancelled';
const ERR_TIMEOUT = 'Task Timeout';

var globalActionMap = {};

function* execute(action, { execFn, nextAction, errorAction, timeout, timeoutAction, cancelSignal, cancelAction }) {

    if (!timeout) timeout = TIMEOUT_DEF;

    if (!execFn || typeof execFn !== 'function') {
        throw new Error('\'execFn\' is required');
    }

    try {

        let state = yield select();
        
        let raceOptions = {
            data: call( execFn, state, action.payload),
            isTimeout: call(delay, timeout)
        };

        if (cancelSignal) {
            raceOptions.isCancelled = take(cancelSignal);
        }

        const { data, isTimeout, isCancelled } = yield race(raceOptions);

        if (isCancelled) {
            throw new Error({
                code: ERR_CANCELLED, message: ERR_CANCELLED
            });
        } else if (isTimeout) {
            throw new Error({
                code: ERR_TIMEOUT, message: ERR_TIMEOUT
            });
        }

        if (!nextAction && typeof nextAction === 'function') return;

        let nextAct = nextAction( data );

        if ( !nextAct || !nextAct.type ) return;

        yield put.resolve( nextAct );

        if ( globalActionMap.hasOwnProperty( nextAct.type ) && typeof globalActionMap[ nextAct.type ] === 'function' ) {
            yield fork( globalActionMap[ nextAct.type ], nextAct );
        }

    } catch (err) {
        if (err.code === ERR_CANCELLED && cancelAction) yield put(cancelAction());
        else if (err.code === ERR_TIMEOUT && timeoutAction) yield put(timeoutAction());
        else if (errorAction) {
            yield put(errorAction(err));
        }
    }

}

export function registerAction( actionSignal, fn ) {
    console.log('registerAction globalActionMap ', actionSignal );
    globalActionMap[ actionSignal] = fn;
}

export function processLogic({ execFn, nextAction, errorAction, timeout, timeoutAction, cancelSignal, cancelAction }) {
    return function* (action) {
        yield* execute(action, { execFn, nextAction, errorAction, timeout, timeoutAction, cancelSignal, cancelAction });
    };
};
