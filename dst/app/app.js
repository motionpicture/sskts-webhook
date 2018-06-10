"use strict";
/**
 * expressアプリケーション
 */
const middlewares = require("@motionpicture/express-middleware");
const sskts = require("@motionpicture/sskts-domain");
const bodyParser = require("body-parser");
const cors = require("cors");
const createDebug = require("debug");
const express = require("express");
const helmet = require("helmet");
const errorHandler_1 = require("./middlewares/errorHandler");
const notFoundHandler_1 = require("./middlewares/notFoundHandler");
const mongooseConnectionOptions_1 = require("../mongooseConnectionOptions");
const debug = createDebug('sskts-webhook:app');
const app = express();
app.use(middlewares.basicAuth({
    name: process.env.BASIC_AUTH_NAME,
    pass: process.env.BASIC_AUTH_PASS
}));
app.use(cors()); // enable All CORS Requests
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ['\'self\'']
        // styleSrc: ['\'unsafe-inline\'']
    }
}));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
const SIXTY_DAYS_IN_SECONDS = 5184000;
app.use(helmet.hsts({
    maxAge: SIXTY_DAYS_IN_SECONDS,
    includeSubdomains: false
}));
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
sskts.mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions_1.default)
    .then(() => { debug('MongoDB connected!'); })
    .catch(console.error);
// routers
const gmo_1 = require("./routes/gmo");
const sendgrid_1 = require("./routes/sendgrid");
app.use('/gmo', gmo_1.default);
app.use('/sendgrid', sendgrid_1.default);
// 404
app.use(notFoundHandler_1.default);
// error handlers
app.use(errorHandler_1.default);
module.exports = app;
