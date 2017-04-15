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
const HTTPStatus = require("http-status");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app/app");
let connection;
before(() => __awaiter(this, void 0, void 0, function* () {
    // 全て削除してからテスト開始
    connection = mongoose.createConnection(process.env.MONGOLAB_URI);
    const gmoNotificationAdapter = sskts.adapter.gmoNotification(connection);
    yield gmoNotificationAdapter.gmoNotificationModel.remove({}).exec();
}));
describe('GMO結果通知', () => {
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
        const orderId = '1234567890';
        yield supertest(app)
            .post('/gmo/notify')
            .send({
            OrderID: orderId,
            AccessID: 'xxx',
            Status: 'xxx',
            JobCd: 'xxx',
            Amount: 'xxx'
        })
            .expect(HTTPStatus.OK)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            assert.equal(response.text, '0');
            const gmoNotificationAdapter = sskts.adapter.gmoNotification(connection);
            const notificationDoc = yield gmoNotificationAdapter.gmoNotificationModel.findOne({ order_id: orderId }).exec();
            assert.notEqual(notificationDoc, null);
        }));
    }));
});
