"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD;

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    mode: 'single',
    autoRefresh: true
});

let login = (callback) => {
    return new Promise((resolve, reject) => {
        org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err =>  {
            if (err) {
                console.log("Authentication error");
                console.log(err);
                reject(err);
            } else {
                console.log("Authentication successful");
                resolve();
            }
        });
    });

};

let findProperties = () => {
    return new Promise((resolve, reject) => {
        let q = `SELECT id FROM property__c`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findUsers = () => {
    return new Promise((resolve, reject) => {
        let q = `SELECT id FROM user`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

exports.login = login;
exports.findUsers = findUsers;
exports.findProperties = findProperties;
