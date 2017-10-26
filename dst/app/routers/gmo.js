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
    const notification = req.body;
    if (notification.OrderID === undefined) {
        res.send(RECV_RES_OK);
        return;
    }
    // リクエストボディをDBに保管
    try {
        const gmoNotificationRepo = new sskts.repository.GMONotification(sskts.mongoose.connection);
        yield gmoNotificationRepo.gmoNotificationModel.create({
            shopId: notification.ShopID,
            accessId: notification.AccessID,
            orderId: notification.OrderID,
            status: notification.Status,
            jobCd: notification.JobCd,
            // tslint:disable-next-line:no-magic-numbers
            amount: parseInt(notification.Amount, 10),
            // tslint:disable-next-line:no-magic-numbers
            tax: parseInt(notification.Tax, 10),
            currency: notification.Currency,
            forward: notification.Forward,
            method: notification.Method,
            payTimes: notification.PayTimes,
            tranId: notification.TranID,
            approve: notification.Approve,
            tranDate: notification.TranDate,
            errCode: notification.ErrCode,
            errInfo: notification.ErrInfo,
            payType: notification.PayType
        });
        debug('notification created.', notification);
        res.send(RECV_RES_OK);
    }
    catch (error) {
        res.send(RECV_RES_NG);
    }
}));
exports.default = gmoRouter;
