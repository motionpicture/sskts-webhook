/**
 * GMOルーター
 *
 * @ignore
 */
import * as sskts from '@motionpicture/sskts-domain';
import * as createDebug from 'debug';
import * as express from 'express';
import * as mongoose from 'mongoose';

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
        const gmoNotificationAdapter = sskts.adapter.gmoNotification(mongoose.connection);
        await gmoNotificationAdapter.gmoNotificationModel.create(
            {
                shop_id: notification.ShopID,
                access_id: notification.AccessID,
                order_id: notification.OrderID,
                status: notification.Status,
                job_cd: notification.JobCd,
                amount: notification.Amount,
                tax: notification.Tax,
                currency: notification.Currency,
                forward: notification.Forward,
                method: notification.Method,
                pay_times: notification.PayTimes,
                tran_id: notification.TranID,
                approve: notification.Approve,
                tran_date: notification.TranDate,
                err_code: notification.ErrCode,
                err_info: notification.ErrInfo,
                pay_type: notification.PayType
            }
        );

        debug('notification created.', notification);
        res.send(RECV_RES_OK);
    } catch (error) {
        res.send(RECV_RES_NG);
    }
});

export default gmoRouter;
