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
describe('SendGridイベント通知', () => {
    let connection;
    before(() => __awaiter(this, void 0, void 0, function* () {
        // 全て削除してからテスト開始
        connection = mongoose.createConnection(process.env.MONGOLAB_URI);
        const sendGridEventAdapter = sskts.adapter.sendGridEvent(connection);
        yield sendGridEventAdapter.sendGridEventModel.remove({}).exec();
    }));
    it('不正なリクエスト', () => __awaiter(this, void 0, void 0, function* () {
        yield supertest(app)
            .post('/sendgrid/event/notify')
            .send({
            test: 'test'
        })
            .expect(HTTPStatus.BAD_REQUEST)
            .then((response) => {
            assert.equal(response.text, '');
        });
    }));
    it('有効なリクエスト', () => __awaiter(this, void 0, void 0, function* () {
        const data = fs.readFileSync(`${__dirname}/sendGridEvents-test.json`, 'utf8');
        const events = JSON.parse(data);
        yield supertest(app)
            .post('/sendgrid/event/notify')
            .send(events)
            .expect(HTTPStatus.OK)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            assert.equal(response.text, '');
            // 全て保管されていることを確認
            const sendGridEventAdapter = sskts.adapter.sendGridEvent(connection);
            yield Promise.all(events.map((event) => __awaiter(this, void 0, void 0, function* () {
                const eventDoc = yield sendGridEventAdapter.sendGridEventModel.findOne({ sg_event_id: event.sg_event_id }).exec();
                assert.notEqual(eventDoc, null);
            })));
        }));
    }));
});
