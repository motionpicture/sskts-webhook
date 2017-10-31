"use strict";
/**
 * ベーシック認証ミドルウェア
 * @module middlewares.basicAuth
 */
Object.defineProperty(exports, "__esModule", { value: true });
const basicAuth = require("basic-auth");
const createDebug = require("debug");
const http_status_1 = require("http-status");
const debug = createDebug('sskts-webhook:middleware:basicAuth');
exports.default = (req, res, next) => {
    // ベーシック認証のための環境変数設定なければスルー
    if (process.env.SSKTS_BASIC_AUTH_NAME === undefined || process.env.SSKTS_BASIC_AUTH_PASS === undefined) {
        next();
        return;
    }
    const user = basicAuth(req);
    debug('basic auth user:', user);
    if (user !== undefined
        && user.name === process.env.SSKTS_BASIC_AUTH_NAME
        && user.pass === process.env.SSKTS_BASIC_AUTH_PASS) {
        // 認証情報が正しければOK
        next();
        return;
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="SSKTS Authentication"');
    res.status(http_status_1.UNAUTHORIZED).end('Unauthorized');
};
