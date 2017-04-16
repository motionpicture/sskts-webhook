/**
 * GMOルーターテスト
 *
 * @ignore
 */
import * as sskts from '@motionpicture/sskts-domain';
import * as assert from 'assert';
import * as HTTPStatus from 'http-status';
import * as mongoose from 'mongoose';
import * as supertest from 'supertest';

import * as app from '../app/app';

describe('GMO結果通知', () => {
    let connection: mongoose.Connection;
    before(async () => {
        // 全て削除してからテスト開始
        connection = mongoose.createConnection(process.env.MONGOLAB_URI);
        const gmoNotificationAdapter = sskts.adapter.gmoNotification(connection);
        await gmoNotificationAdapter.gmoNotificationModel.remove({}).exec();
    });

    it('不正なリクエスト', async () => {
        await supertest(app)
            .post('/gmo/notify')
            .send({
                test: 'test'
            })
            .expect(HTTPStatus.OK)
            .then((response) => {
                assert.equal(response.text, '0');
            });
    });

    it('有効なリクエスト', async () => {
        const orderId = '1234567890';
        await supertest(app)
            .post('/gmo/notify')
            .send({
                OrderID: orderId,
                AccessID: 'xxx',
                Status: 'xxx',
                JobCd: 'xxx',
                Amount: 'xxx'
            })
            .expect(HTTPStatus.OK)
            .then(async (response) => {
                assert.equal(response.text, '0');
                const gmoNotificationAdapter = sskts.adapter.gmoNotification(connection);
                const notificationDoc = await gmoNotificationAdapter.gmoNotificationModel.findOne({ order_id: orderId }).exec();
                assert.notEqual(notificationDoc, null);
            });
    });
});
