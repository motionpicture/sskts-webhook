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

    const notification = req.body;

    if (notification.OrderID === undefined) {
        res.send(RECV_RES_OK);

        return;
    }

    // リクエストボディをDBに保管
    try {
        const gmoNotificationRepo = new sskts.repository.GMONotification(sskts.mongoose.connection);
        await gmoNotificationRepo.gmoNotificationModel.create(
            {
                shopId: notification.ShopID,
                accessId: notification.AccessID,
                orderId: notification.OrderID,
                status: notification.Status,
                jobCd: notification.JobCd,
                // tslint:disable-next-line:no-magic-numbers
                amount: parseInt(notification.Amount, 10),
                // tslint:disable-next-line:no-magic-numbers
                tax: parseInt(notification.Tax, 10),
                currency: notification.Currency,
                forward: notification.Forward,
                method: notification.Method,
                payTimes: notification.PayTimes,
                tranId: notification.TranID,
                approve: notification.Approve,
                tranDate: notification.TranDate,
                errCode: notification.ErrCode,
                errInfo: notification.ErrInfo,
                payType: notification.PayType
            }
        );

        debug('notification created.', notification);
        res.send(RECV_RES_OK);
    } catch (error) {
        res.send(RECV_RES_NG);
    }
});

export default gmoRouter;
