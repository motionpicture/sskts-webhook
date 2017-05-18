/**
 * クライアントルーター
 *
 * @ignore
 */

import * as sskts from '@motionpicture/sskts-domain';
import * as createDebug from 'debug';
import * as express from 'express';
import { CREATED } from 'http-status';
import * as mongoose from 'mongoose';

const clientEventsRouter = express.Router();
const debug = createDebug('sskts-webhook:router:client');

clientEventsRouter.post('/', async (req, res, next) => {
    debug('pushing clientEvent...', req.body);

    // リクエストボディをDBに保管
    try {
        const clientAdapter = sskts.adapter.client(mongoose.connection);
        const clientEvent = await sskts.service.client.pushEvent(req.body)(clientAdapter);

        res.status(CREATED).json({
            data: {
                type: 'client_events',
                id: clientEvent.id
            }
        });
    } catch (error) {
        next(error);
    }
});

export default clientEventsRouter;
