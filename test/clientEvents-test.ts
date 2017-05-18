/**
 * クライアントルーターテスト
 *
 * @ignore
 */
import * as sskts from '@motionpicture/sskts-domain';
import * as assert from 'assert';
import * as httpStatus from 'http-status';
import * as mongoose from 'mongoose';
import * as supertest from 'supertest';

import * as app from '../app/app';

describe('クライアントイベント通知', () => {
    let connection: mongoose.Connection;
    const testClient: any = {
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

    before(async () => {
        connection = mongoose.createConnection(process.env.MONGOLAB_URI);
        const clientAdapter = sskts.adapter.client(connection);

        // テストクライアント作成
        await sskts.service.client.create(testClient)(clientAdapter);

        // 全て削除してからテスト開始
        await clientAdapter.clientEventModel.remove({}).exec();
    });

    after(async () => {
        // テストクライアント削除
        const clientAdapter = sskts.adapter.client(connection);
        await clientAdapter.clientModel.findByIdAndRemove(testClient.id).exec();
    });

    it('不正なリクエスト', async () => {
        await supertest(app)
            .post('/clientEvents')
            .send({
                test: 'test'
            })
            .expect('Content-Type', /json/)
            .expect(httpStatus.BAD_REQUEST)
            .then((response) => {
                assert(Array.isArray(response.body.errors));
            });
    });

    it('有効なリクエスト', async () => {
        const occurredAt = new Date();
        const event = {
            client: testClient.id,
            occurred_at: occurredAt,
            label: `test-label${occurredAt.valueOf().toString()}`
        };

        await supertest(app)
            .post('/clientEvents')
            .send(event)
            .expect('Content-Type', /json/)
            .expect(httpStatus.CREATED)
            .then(async (response) => {
                assert.equal(typeof response.body.data.id, 'string');

                // 保管されていることを確認
                const clientAdapter = sskts.adapter.client(connection);
                const eventDoc = await clientAdapter.clientEventModel.findOne(
                    { label: event.label }
                ).exec();
                assert.notEqual(eventDoc, null);
                assert.equal(eventDoc.get('label'), event.label);

                // await clientAdapter.clientEventModel.findByIdAndRemove(eventDoc.get('id'));
            });
    });
});
