"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GMOルーター
 *
 * @ignore
 */
const sskts = require("@motionpicture/sskts-domain");
const createDebug = require("debug");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const debug = createDebug('sskts-webhook:router:gmo');
/**
 * 受信OK
 */
const RECV_RES_OK = '0';
/**
 * 受信失敗
 */
const RECV_RES_NG = '1';
router.post('/notify', (req, res) => __awaiter(this, void 0, void 0, function* () {
    debug('body:', JSON.stringify(req.body));
    const notification = req.body;
    if (notification.OrderID === undefined) {
        res.send(RECV_RES_OK);
        return;
    }
    // リクエストボディをDBに保管
    try {
        const gmoNotificationAdapter = sskts.adapter.gmoNotification(mongoose.connection);
        yield gmoNotificationAdapter.gmoNotificationModel.create({
            shop_id: notification.ShopID,
            access_id: notification.AccessID,
            order_id: notification.OrderID,
            status: notification.Status,
            job_cd: notification.JobCd,
            amount: notification.Amount,
            tax: notification.Tax,
            currency: notification.Currency,
            forward: notification.Forward,
            method: notification.Method,
            pay_times: notification.PayTimes,
            tran_id: notification.TranID,
            approve: notification.Approve,
            tran_date: notification.TranDate,
            err_code: notification.ErrCode,
            err_info: notification.ErrInfo,
            pay_type: notification.PayType
        });
        debug('notification created.', notification);
        res.send(RECV_RES_OK);
    }
    catch (error) {
        res.send(RECV_RES_NG);
    }
}));
exports.default = router;
