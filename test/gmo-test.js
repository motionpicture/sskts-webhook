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
 * GMOルーターテスト
 *
 * @ignore
 */
const sskts = require("@motionpicture/sskts-domain");
const assert = require("assert");
const fs = require("fs-extra");
const HTTPStatus = require("http-status");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app/app");
describe('GMO結果通知', () => {
    let connection;
    before(() => __awaiter(this, void 0, void 0, function* () {
        // 全て削除してからテスト開始
        connection = mongoose.createConnection(process.env.MONGOLAB_URI);
        const gmoNotificationAdapter = sskts.adapter.gmoNotification(connection);
        yield gmoNotificationAdapter.gmoNotificationModel.remove({}).exec();
    }));
    it('不正なリクエスト', () => __awaiter(this, void 0, void 0, function* () {
        yield supertest(app)
            .post('/gmo/notify')
            .send({
            test: 'test'
        })
            .expect(HTTPStatus.OK)
            .then((response) => {
            assert.equal(response.text, '0');
        });
    }));
    it('有効なリクエスト', () => __awaiter(this, void 0, void 0, function* () {
        const data = fs.readFileSync(`${__dirname}/gmoNotification-test.json`, 'utf8');
        const notification = JSON.parse(data);
        yield supertest(app)
            .post('/gmo/notify')
            .send(notification)
            .expect(HTTPStatus.OK)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            assert.equal(response.text, '0');
            const gmoNotificationAdapter = sskts.adapter.gmoNotification(connection);
            const notificationDoc = yield gmoNotificationAdapter.gmoNotificationModel.findOne({ order_id: notification.OrderID }).exec();
            assert.notEqual(notificationDoc, null);
        }));
    }));
});
