import { Request } from "express";
import { z } from "zod";

const RegisterUserSchema = {
    bodySchema: z.object({
        name: z.string()
            .min(3),
    
        email: z.string()
            .email(),
    
        phone: z.string()
            .min(10),

        dateOfBirth: z.coerce.date()
    })
}

type RegisterUserBody = z.infer<typeof RegisterUserSchema.bodySchema>;
type RegisterUserRequest = Request<any, any, RegisterUserBody, any>;
export { RegisterUserSchema, RegisterUserRequest };