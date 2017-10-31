/**
 * GMOルーター
 * @namespace routers.gmo
 */

import * as sskts from '@motionpicture/sskts-domain';
import * as createDebug from 'debug';
import * as express from 'express';

const gmoRouter = express.Router();
const debug = createDebug('sskts-webhook:router:gmo');

/**
 * 受信OK
 */
const RECV_RES_OK = '0';
/**
 * 受信失敗
 */
const RECV_RES_NG = '1';

gmoRouter.post('/notify', async (req, res) => {
    debug('body:', JSON.stringify(req.body));

    if (req.body.OrderID === undefined) {
        res.send(RECV_RES_OK);

        return;
    }

    // リクエストボディをDBに保管
    try {
        const notification = sskts.GMO.factory.resultNotification.creditCard.createFromRequestBody(req.body);
        const gmoNotificationRepo = new sskts.repository.GMONotification(sskts.mongoose.connection);
        await gmoNotificationRepo.save(notification);
        debug('notification created.', notification);
        res.send(RECV_RES_OK);
    } catch (error) {
        res.send(RECV_RES_NG);
    }
});

export default gmoRouter;
