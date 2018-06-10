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

describe('GMO結果通知', () => {
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
        const data = fs.readFileSync(`${__dirname}/gmoNotification-test.json`, 'utf8');
        const notification = <any>JSON.parse(data);

        await supertest(app)
            .post('/gmo/notify')
            .send(notification)
            .expect(HTTPStatus.OK)
            .then(async (response) => {
                assert.equal(response.text, '0');
            });
    });
});
