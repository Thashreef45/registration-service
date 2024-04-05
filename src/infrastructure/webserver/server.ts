import express, { Express } from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import ratelimit from 'express-rate-limit';
import { Server } from '../../interfaces/webserver/IServer.js';
import env from '../config/environment.js';

import registrationRouter from '../../presentation/routers/RegistrationRouter.js';
import loginRouter from '../../presentation/routers/LoginRouter.js';

import { errorMiddleware } from './error.js';

import nocache from 'nocache';

/**
 * Create an Express.js based server instance.
 */
export class ExpressServer implements Server<Express> {
    private app: Express;
    private port: number;

    constructor(port: number) {
        console.log("The environment port is: ", port);
        this.port = port;
        this.app = express();

        this.initializeCORS();
        this.initializeRatelimits();
        this.initializeMiddlewares();
        this.app.use(nocache());
        this.initializeRoutes();
        this.initializeErrorHandler();
    }

    /** Setup express.js specific configurations and middlewares. */
    private initializeMiddlewares() {
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        if (env.NODE_ENV === 'development') {
            this.app.use(logger("dev"));
        }
    }

    /** Setup the touch points where data flows to. */
    private initializeRoutes() {
        this.app.use('/signup', registrationRouter);
        this.app.use('/signin', loginRouter);
        this.app.use("/health", (req, res) => res.json("All works!"));
    }

    /** Setup handlers to deal with errors. */
    private initializeErrorHandler() {
        // todo: apply error handler.
        this.app.use(errorMiddleware);
    }

    /** Setup CORS based configurations using the middleware. */
    private initializeCORS() {
        // todo: Add additional configurations.
        this.app.use(cors());
    }

    /** Setup API ratelimiting. */
    private initializeRatelimits() {
        // todo: Change it to 5 minutes at a later date.
        const limiter = ratelimit({
            windowMs: 2 * 60 * 1000,
            max: 100,
          });
          
          this.app.use(limiter);
    }

    /**
     * Start the server on the predefined port.
     * @param callback A callback function on success.
     */
    public async run(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}