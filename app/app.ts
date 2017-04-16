/**
 * expressアプリケーション
 *
 * @module
 */
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import basicAuth from './middlewares/basicAuth';
import errorHandler from './middlewares/errorHandler';
import notFoundHandler from './middlewares/notFoundHandler';

const app = express();

app.use(basicAuth); // ベーシック認証

// view engine setup
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
// The extended option allows to choose between parsing the URL-encoded data
// with the querystring library (when false) or the qs library (when true).
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイル
// app.use(express.static(__dirname + '/../public'));

// mongoose
(<any>mongoose).Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI);

// routers
import gmoRouter from './routers/gmo';
import router from './routers/router';
import sendgridRouter from './routers/sendgrid';
app.use('/', router);
app.use('/gmo', gmoRouter);
app.use('/sendgrid', sendgridRouter);

// 404
app.use(notFoundHandler);

// error handlers
app.use(errorHandler);

export = app;
