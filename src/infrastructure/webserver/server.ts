import express, {Express} from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { Server } from '../../interfaces/webserver/IServer.js';
import env from '../config/environment.js';

import HelloWorldRouter from "../../presentation/routers/HelloRouter.js";

/**
 * Create an Express.js based server instance.
 */
export class ExpressServer implements Server<Express> {
    public app: Express;
    public port: number;

    constructor(port: number) {
        console.log("The environment port is: ", port);
        this.port = port;
        this.app = express();

        // this.initializeCORS();
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
        this.app.use("/ok", (req, res) => {
            res.send("All works!");
        });

        this.app.use("/", HelloWorldRouter);
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
    async run(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}