import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";

const userRepository = new UserRepositoryMongoDB();
