/**
 * GMOルーターテスト
 *
 * @ignore
 */
import * as sskts from '@motionpicture/sskts-domain';
import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as HTTPStatus from 'http-status';
import * as mongoose from 'mongoose';
import * as supertest from 'supertest';

import * as app from '../app/app';

describe('SendGridイベント通知', () => {
    let connection: mongoose.Connection;
    before(async () => {
        // 全て削除してからテスト開始
        connection = mongoose.createConnection(process.env.MONGOLAB_URI);
        const sendGridEventAdapter = sskts.adapter.sendGridEvent(connection);
        await sendGridEventAdapter.sendGridEventModel.remove({}).exec();
    });

    it('不正なリクエスト', async () => {
        await supertest(app)
            .post('/sendgrid/event/notify')
            .send({
                test: 'test'
            })
            .expect(HTTPStatus.BAD_REQUEST)
            .then((response) => {
                assert.equal(response.text, '');
            });
    });

    it('有効なリクエスト', async () => {
        const data = fs.readFileSync(`${__dirname}/sendGridEvents-test.json`, 'utf8');
        const events = <any[]>JSON.parse(data);

        await supertest(app)
            .post('/sendgrid/event/notify')
            .send(events)
            .expect(HTTPStatus.OK)
            .then(async (response) => {
                assert.equal(response.text, '');

                // 全て保管されていることを確認
                const sendGridEventAdapter = sskts.adapter.sendGridEvent(connection);
                await Promise.all(events.map(async (event) => {
                    const eventDoc = await sendGridEventAdapter.sendGridEventModel.findOne(
                        { sg_event_id: event.sg_event_id }
                    ).exec();
                    assert.notEqual(eventDoc, null);
                }));
            });
    });
});
