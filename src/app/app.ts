/**
 * expressアプリケーション
 */
import * as middlewares from '@motionpicture/express-middleware';
import * as sskts from '@motionpicture/sskts-domain';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as createDebug from 'debug';
import * as express from 'express';
import * as helmet from 'helmet';

import errorHandler from './middlewares/errorHandler';
import notFoundHandler from './middlewares/notFoundHandler';

import mongooseConnectionOptions from '../mongooseConnectionOptions';

const debug = createDebug('sskts-webhook:app');

const app = express();

app.use(middlewares.basicAuth({ // ベーシック認証
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
sskts.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions)
    .then(() => { debug('MongoDB connected!'); })
    // tslint:disable-next-line:no-console
    .catch(console.error);

// routers
import gmoRouter from './routes/gmo';
import sendgridRouter from './routes/sendgrid';
app.use('/gmo', gmoRouter);
app.use('/sendgrid', sendgridRouter);

// 404
app.use(notFoundHandler);

// error handlers
app.use(errorHandler);

export = app;
