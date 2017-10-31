"use strict";
/**
 * GMOルーター
 * @namespace routers.gmo
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sskts = require("@motionpicture/sskts-domain");
const createDebug = require("debug");
const express = require("express");
const gmoRouter = express.Router();
const debug = createDebug('sskts-webhook:router:gmo');
/**
 * 受信OK
 */
const RECV_RES_OK = '0';
/**
 * 受信失敗
 */
const RECV_RES_NG = '1';
gmoRouter.post('/notify', (req, res) => __awaiter(this, void 0, void 0, function* () {
    debug('body:', JSON.stringify(req.body));
    if (req.body.OrderID === undefined) {
        res.send(RECV_RES_OK);
        return;
    }
    // リクエストボディをDBに保管
    try {
        const notification = sskts.GMO.factory.resultNotification.creditCard.createFromRequestBody(req.body);
        const gmoNotificationRepo = new sskts.repository.GMONotification(sskts.mongoose.connection);
        yield gmoNotificationRepo.save(notification);
        debug('notification created.', notification);
        res.send(RECV_RES_OK);
    }
    catch (error) {
        res.send(RECV_RES_NG);
    }
}));
exports.default = gmoRouter;
