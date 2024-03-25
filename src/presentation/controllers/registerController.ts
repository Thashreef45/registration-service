import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

//* Interactors
import CreateAccount from "../../use-cases/interactors/createAccount.js";

//* Dependencies
import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";

const userRepository = new UserRepositoryMongoDB();

export const RegisterController = asyncHandler(_RegisterUser);

//Creating a new account
async function _RegisterUser(req: Request, res: Response): Promise<void> {
  const interactor = new CreateAccount({ userRepository });

  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    dob: req.body.dateOfBirth,
  };

  const output = await interactor.execute(data);
  res.json(output);
}

// export default Register

// export default RegisterController
