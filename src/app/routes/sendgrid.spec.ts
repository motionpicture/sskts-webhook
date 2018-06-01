// tslint:disable:no-implicit-dependencies
/**
 * GMOルーターテスト
 * @ignore
 */
import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as HTTPStatus from 'http-status';
import * as supertest from 'supertest';

import * as app from '../../app/app';

describe('SendGridイベント通知', () => {
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
            });
    });
});
