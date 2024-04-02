import { NextFunction, Request, Response } from "express";

/**
 * Validate the Signup Authorization header.
 * @param req 
 * @param res 
 * @param next 
 */
export function requireSignupId(req: Request, res: Response, next: NextFunction) {
    const signupId = req.headers["authorization"]?.slice(7).trim();
    if (!signupId) {
        res.status(401).send({ message: "A valid signupId wasn't found in the headers." });
        return;
    }
    
    req.signupId = signupId;

    next();
}