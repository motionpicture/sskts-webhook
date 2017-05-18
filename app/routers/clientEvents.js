"use strict";
/**
 * クライアントルーター
 *
 * @ignore
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
const mongoose = require("mongoose");
const clientEventsRouter = express.Router();
const debug = createDebug('sskts-webhook:router:client');
clientEventsRouter.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    debug('pushing clientEvent...', req.body);
    // リクエストボディをDBに保管
    try {
        const clientAdapter = sskts.adapter.client(mongoose.connection);
        const clientEvent = yield sskts.service.client.pushEvent(req.body)(clientAdapter);
        res.status(http_status_1.CREATED).json({
            data: {
                type: 'client_events',
                id: clientEvent.id
            }
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = clientEventsRouter;
