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
 * クライアントルーターテスト
 *
 * @ignore
 */
const sskts = require("@motionpicture/sskts-domain");
const assert = require("assert");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app/app");
describe('クライアントイベント通知', () => {
    let connection;
    const testClient = {
        id: 'sskts-webhook-test-client',
        secret: 'motionpicture',
        name: {
            en: 'motionpicture',
            ja: 'モーションピクチャー'
        },
        description: {
            en: 'motionpicture',
            ja: 'モーションピクチャー'
        },
        notes: {
            en: 'motionpicture',
            ja: 'モーションピクチャー'
        },
        email: 'hello@motionpicture,jp'
    };
    before(() => __awaiter(this, void 0, void 0, function* () {
        connection = mongoose.createConnection(process.env.MONGOLAB_URI);
        const clientAdapter = sskts.adapter.client(connection);
        // テストクライアント作成
        yield sskts.service.client.create(testClient)(clientAdapter);
        // 全て削除してからテスト開始
        yield clientAdapter.clientEventModel.remove({}).exec();
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        // テストクライアント削除
        const clientAdapter = sskts.adapter.client(connection);
        yield clientAdapter.clientModel.findByIdAndRemove(testClient.id).exec();
    }));
    it('不正なリクエスト', () => __awaiter(this, void 0, void 0, function* () {
        yield supertest(app)
            .post('/clientEvents')
            .send({
            test: 'test'
        })
            .expect('Content-Type', /json/)
            .expect(httpStatus.BAD_REQUEST)
            .then((response) => {
            assert(Array.isArray(response.body.errors));
        });
    }));
    it('有効なリクエスト', () => __awaiter(this, void 0, void 0, function* () {
        const occurredAt = new Date();
        const event = {
            client: testClient.id,
            occurred_at: occurredAt,
            label: `test-label${occurredAt.valueOf().toString()}`
        };
        yield supertest(app)
            .post('/clientEvents')
            .send(event)
            .expect('Content-Type', /json/)
            .expect(httpStatus.CREATED)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            assert.equal(typeof response.body.data.id, 'string');
            // 保管されていることを確認
            const clientAdapter = sskts.adapter.client(connection);
            const eventDoc = yield clientAdapter.clientEventModel.findOne({ label: event.label }).exec();
            assert.notEqual(eventDoc, null);
            assert.equal(eventDoc.get('label'), event.label);
            // await clientAdapter.clientEventModel.findByIdAndRemove(eventDoc.get('id'));
        }));
    }));
});
