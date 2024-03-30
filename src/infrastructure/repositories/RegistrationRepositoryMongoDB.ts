import { Registration } from "../../domain/entities/Registration.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import RegistrationModel from "../database/mongoose/models/Registration.js";

export default class RegistrationRepositoryMongoDB implements IRegistrationRepository {

    async persist(registration: Registration): Promise<StatusCode> {
        try {
            await RegistrationModel.create(registration);
            return StatusCode.CREATED;
        } catch (error) {
            console.error("Error persisting registration:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async merge(registration: Registration): Promise<StatusCode> {
        try {
            await RegistrationModel.findOneAndUpdate({ uuid: registration.uuid }, registration);
            return StatusCode.OK;
        } catch (error) {
            console.error("Error merging registration:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async remove(registration: Registration): Promise<StatusCode> {
        try {
            await RegistrationModel.findOneAndDelete({ uuid: registration.uuid });
            return StatusCode.OK;
        } catch (error) {
            console.error("Error removing registration:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async removeByUUID(uuid: string): Promise<Registration | null> {
        try {
            return await RegistrationModel.findOneAndDelete({ uuid });
        } catch (error) {
            console.error("Error removing registration by UUID:", error);
            return null;
        }
    }

    async findByUUID(uuid: string): Promise<Registration | null> {
        try {
            return await RegistrationModel.findOne({ uuid });
        } catch (error) {
            console.error("Error finding registration by UUID:", error);
            return null;
        }
    }

    async findByEmail(email: string): Promise<Registration | null> {
        try {
            return await RegistrationModel.findOne({ email });
        } catch (error) {
            console.error("Error finding registration by email:", error);
            return null;
        }
    }

    async findByPhone(phone: string): Promise<Registration | null> {
        try {
            return await RegistrationModel.findOne({ phone });
        } catch (error) {
            console.error("Error finding registration by phone:", error);
            return null;
        }
    }

    async findRegistration(registration: Partial<Registration>): Promise<Registration | null> {
        try {
            return await RegistrationModel.findOne(registration);
        } catch (error) {
            console.error("Error finding registration:", error);
            return null;
        }
    }
}