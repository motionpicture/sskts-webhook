/**
 * SendGridルーター
 * @namespace routers.sendgrid
 */

import * as sskts from '@motionpicture/sskts-domain';
import * as createDebug from 'debug';
import * as express from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as mongoose from 'mongoose';

const sendgridRouter = express.Router();
const debug = createDebug('sskts-webhook:router:sendgrid');

sendgridRouter.post('/event/notify', async (req, res) => {
    const events = req.body;
    debug('sendgrid events:', req.body);

    if (!Array.isArray(events)) {
        res.status(BAD_REQUEST).end();

        return;
    }

    // リクエストボディをDBに保管
    try {
        const sendGridEventRepo = new sskts.repository.SendGridEvent(mongoose.connection);

        await Promise.all(events.map(async (event) => {
            if (event.sg_event_id === undefined) {
                throw new Error('sg_event_id undefined');
            }

            await sendGridEventRepo.sendGridEventModel.findOneAndUpdate(
                {
                    sg_event_id: event.sg_event_id
                },
                event,
                {
                    upsert: true
                }
            ).exec();
            debug('event updated.', event);
        }));

        res.status(OK).end();
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).end();
    }
});

export default sendgridRouter;
