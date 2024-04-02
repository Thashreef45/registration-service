import { AppError } from "../../use-cases/shared/AppError.js";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.error("===APP ERROR===");
    console.error(err);
    console.log("\n\n");

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.isCatastrophic) {
        res.status(500).json({ error: "Internal Server Error"});
        console.log("╔═╗╦  ╔═╗╦═╗╔╦╗");
        console.log("╠═╣║  ║╣ ╠╦╝ ║ ");
        console.log("╩ ╩╩═╝╚═╝╩╚═ ╩ ");
        console.error(err.name);
        console.error(`\t -${err.message}`);
        console.log("Error is of catastrophic nature. Server is shut down to prevent snowballing.");
        process.exit(1);
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}