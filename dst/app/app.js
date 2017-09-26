"use strict";
/**
 * expressアプリケーション
 *
 * @module
 */
const sskts = require("@motionpicture/sskts-domain");
const bodyParser = require("body-parser");
const express = require("express");
const basicAuth_1 = require("./middlewares/basicAuth");
const errorHandler_1 = require("./middlewares/errorHandler");
const notFoundHandler_1 = require("./middlewares/notFoundHandler");
const app = express();
app.use(basicAuth_1.default); // ベーシック認証
// view engine setup
// app.set('views', `${__dirname}/views`);
// app.set('view engine', 'ejs');
app.use(bodyParser.json());
// The extended option allows to choose between parsing the URL-encoded data
// with the querystring library (when false) or the qs library (when true).
app.use(bodyParser.urlencoded({ extended: true }));
// 静的ファイル
// app.use(express.static(__dirname + '/../public'));
// mongoose
sskts.mongoose.connect(process.env.MONGOLAB_URI);
// routers
const gmo_1 = require("./routers/gmo");
const router_1 = require("./routers/router");
const sendgrid_1 = require("./routers/sendgrid");
app.use('/', router_1.default);
app.use('/gmo', gmo_1.default);
app.use('/sendgrid', sendgrid_1.default);
// 404
app.use(notFoundHandler_1.default);
// error handlers
app.use(errorHandler_1.default);
module.exports = app;
