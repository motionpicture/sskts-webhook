"use strict";
/**
 * SendGridルーター
 * @namespace routers.sendgrid
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sskts = require("@motionpicture/sskts-domain");
const createDebug = require("debug");
const express = require("express");
const http_status_1 = require("http-status");
const sendgridRouter = express.Router();
const debug = createDebug('sskts-webhook:router:sendgrid');
sendgridRouter.post('/event/notify', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const events = req.body;
    debug('sendgrid events:', req.body);
    if (!Array.isArray(events)) {
        res.status(http_status_1.BAD_REQUEST).end();
        return;
    }
    // リクエストボディをDBに保管
    try {
        const sendGridEventRepo = new sskts.repository.SendGridEvent(sskts.mongoose.connection);
        yield Promise.all(events.map((event) => __awaiter(this, void 0, void 0, function* () {
            if (event.sg_event_id === undefined) {
                throw new Error('sg_event_id undefined');
            }
            yield sendGridEventRepo.sendGridEventModel.findOneAndUpdate({
                sg_event_id: event.sg_event_id
            }, event, {
                upsert: true
            }).exec();
            debug('event updated.', event);
        })));
        res.status(http_status_1.OK).end();
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).end();
    }
}));
exports.default = sendgridRouter;
