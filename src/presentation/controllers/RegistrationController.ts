import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

//* Interactors
import CreateAccount from "../../use-cases/interactors/CreateAccount.js";

//* Dependencies
import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";
import { GiggrSnowflake } from "../../infrastructure/services/GiggrSnowflakeAccountIdGenerator.js";

const userRepository = new UserRepositoryMongoDB();
const accountIdGenerator = new GiggrSnowflake();

export const RegisterUser = asyncHandler(_RegisterUser);
async function _RegisterUser(req: Request, res: Response): Promise<void> {
  const interactor = new CreateAccount({ userRepository, accountIdGenerator });

  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
  };

  const output = await interactor.execute(data);
  res.json(output);
}