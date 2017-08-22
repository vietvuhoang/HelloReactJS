import Request from 'request-promise';
import base64 from 'base-64';

const SEPARATOR = ':';
const BASIC = 'Basic ';
const BEARER = 'Bearer ';

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}

function login(username, password) {

    let options = {
        method: 'POST',
        uri: 'http://34.211.18.196/api/authenticate',
        headers: {
            Authorization: `${BASIC}` + base64.encode(`${username}${SEPARATOR}${password}`)
        }
    };

    return wait( 1000 )
            .then(() => Request(options))
            .then(res => Promise.resolve(JSON.parse(res)))
            .catch(err => Promise.reject(err));;
}

function getProfile(token) {

    let options = {
        method: 'GET',
        uri: 'http://34.211.18.196/api/profile',
        headers: {
            Authorization: `${BEARER}${token}`
        }
    };

    return Request(options).then(res => Promise.resolve(JSON.parse(res))).catch(err => Promise.reject(err));
}

export { login, getProfile }
