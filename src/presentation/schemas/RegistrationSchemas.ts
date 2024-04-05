import { Request } from "express";
import { z } from "zod";

const InitiateRegistrationSchema = {
    bodySchema: z.object({
        entity: z.enum(["industry", "institute", "individual"]),
        deviceId: z.string().min(3),
        locationId: z.string().min(3),
        networkId: z.string().min(3),
        autofillToken: z.string().optional()
    })
}

type InitiateRegistrationBody = z.infer<typeof InitiateRegistrationSchema.bodySchema>;
type InitiateRegistrationRequest = Request<any, any, InitiateRegistrationBody, any>;
export { InitiateRegistrationSchema, InitiateRegistrationRequest };

const UpdateRegistrationSchema = {
    bodySchema: z.object({
        name: z.string()
            .min(3).optional(),

        email: z.string()
            .email().refine(async (e) => {
                // return await checkIfEmailIsValid(e);
                return true
            }, "This is not a valid email.").optional(),

        phone: z.string()
            .min(10).optional(),

        dateOfBirth: z.coerce.date().optional() //.coerce.date().optional()
    }).strict()
}

type UpdateRegistrationBody = z.infer<typeof UpdateRegistrationSchema.bodySchema>;
type UpdateRegistrationRequest = Request<any, any, UpdateRegistrationBody, any>;
export { UpdateRegistrationSchema, UpdateRegistrationRequest };

const RequestOTPSchema = {
    paramsSchema: z.object({
        field: z.enum(["phone", "email"])
    }),
    querySchema: z.object({
        email: z.string()
            .email().optional(),

        phone: z.string()
            .min(10).optional(),
    })
}

type RequestOTPParams = z.infer<typeof RequestOTPSchema.paramsSchema>;
type RequestOTPQuery = z.infer<typeof RequestOTPSchema.querySchema>;
type RequestOTPRequest = Request<RequestOTPParams, any, any, RequestOTPQuery>;
export { RequestOTPSchema, RequestOTPRequest };

const VerifyOTPSchema = {
    paramsSchema: z.object({
        field: z.enum(["phone", "email"])
    }),
    bodySchema: z.object({
        otp: z.string().length(6)
    })
}

type VerifyOTPParams = z.infer<typeof VerifyOTPSchema.paramsSchema>;
type VerifyOTPBody = z.infer<typeof VerifyOTPSchema.bodySchema>;
type VerifyOTPRequest = Request<VerifyOTPParams, any, VerifyOTPBody, any>;
export { VerifyOTPSchema, VerifyOTPRequest };