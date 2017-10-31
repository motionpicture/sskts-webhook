/**
 * expressアプリケーション
 * @module
 */

import * as sskts from '@motionpicture/sskts-domain';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';

import basicAuth from './middlewares/basicAuth';
import errorHandler from './middlewares/errorHandler';
import notFoundHandler from './middlewares/notFoundHandler';

import mongooseConnectionOptions from '../mongooseConnectionOptions';

const app = express();

app.use(basicAuth); // ベーシック認証
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
sskts.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions);

// routers
import gmoRouter from './routers/gmo';
import sendgridRouter from './routers/sendgrid';
app.use('/gmo', gmoRouter);
app.use('/sendgrid', sendgridRouter);

// 404
app.use(notFoundHandler);

// error handlers
app.use(errorHandler);

export = app;
