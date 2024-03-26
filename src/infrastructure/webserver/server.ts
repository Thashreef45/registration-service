import express, { Express } from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { Server } from '../../interfaces/webserver/IServer.js';
import env from '../config/environment.js';

import registrationRouter from '../../presentation/routers/RegistrationRouter.js';

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
        this.initializeMiddlewares();
        this.initializeRoutes();
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

    private initializeRoutes() {
        this.app.use('/', registrationRouter)
        this.app.use("/health", (req, res) => res.send("All works!"));
    }

    private initializeErrorHandler() {
        // todo: apply error handler.
    }

    /** Setup CORS based configurations using the middleware. */
    private initializeCORS() {
        // todo: Add additional configurations.
        this.app.use(cors());
    }

    /**
     * Start the server on the predefined port.
     * @param callback A callback function on success.
     */

    public async run(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}