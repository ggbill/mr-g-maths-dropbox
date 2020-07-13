import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import requestLoggerMiddleware from './request.logger.middleware';
import ftpRouter from './routes/ftp';

const path = require('path');
const shrinkRay = require('shrink-ray-current');
require('dotenv').config();
const app = express();

// compress responses
app.use(shrinkRay());

app.use(cors());
app.use(bodyparser.json());
app.use(requestLoggerMiddleware);

app.use('/ftp', ftpRouter);


if (process.env.NODE_ENV === 'production') {

    // Declare the path to frontend's static assets
    app.use(express.static(path.resolve("..", "frontend", "build")));

    // Intercept requests to return the frontend's static entry point
    app.get("*", (_, response) => {
        response.sendFile(path.resolve("..", "frontend", "build", "index.html"));
    });

    // http -> https redirect
    app.use((req, res, next) => {
        if (process.env.NODE_ENV === 'production') {
            if (req.headers['x-forwarded-proto'] !== 'https'){
                console.log(`redirecting http to https://${req.headers.host}${req.url}`)
                return res.redirect('https://' + req.headers.host + req.url);
            }else{
                return next();
            }
        } else {
            return next();
        }
    });

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", '*');
        res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
        next();
    });
}

export default app; 