import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

//* Interactors
import HelloWorldInteractor from "../../use-cases/interactors/HelloWorld.js";

//* Dependencies
import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";

const userRepository = new UserRepositoryMongoDB();

export const HelloWorld = asyncHandler(_HelloWorld);
async function _HelloWorld(req: Request, res: Response) {
  const interactor = new HelloWorldInteractor({ userRepository });
  const output = await interactor.execute({
    message: "Hello World",
  });

  res.json(output);
}
