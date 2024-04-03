import { Registration } from "../../domain/entities/Registration.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import RegistrationModel, { RegistrationDocument } from "../database/mongoose/models/Registration.Model.js";

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
            const registrationDocument = await RegistrationModel.findOneAndDelete({ uuid });
            return RegistrationRepositoryMongoDB.mapRegistrationToEntity(registrationDocument);
        } catch (error) {
            console.error("Error removing registration by UUID:", error);
            return null;
        }
    }

    async findByUUID(uuid: string): Promise<Registration | null> {
        try {
            const registrationDocument = await RegistrationModel.findOne({ uuid });
            return RegistrationRepositoryMongoDB.mapRegistrationToEntity(registrationDocument);
        } catch (error) {
            console.error("Error finding registration by UUID:", error);
            return null;
        }
    }

    async findByEmail(email: string): Promise<Registration | null> {
        try {
            const registrationDocument = await RegistrationModel.findOne({ email });
            return RegistrationRepositoryMongoDB.mapRegistrationToEntity(registrationDocument);
        } catch (error) {
            console.error("Error finding registration by email:", error);
            return null;
        }
    }

    async findByPhone(phone: string): Promise<Registration | null> {
        try {
            const registrationDocument = await RegistrationModel.findOne({ phone });
            return RegistrationRepositoryMongoDB.mapRegistrationToEntity(registrationDocument);
        } catch (error) {
            console.error("Error finding registration by phone:", error);
            return null;
        }
    }

    async findRegistration(registration: Partial<Registration>): Promise<Registration | null> {
        try {
            const registrationDocument = await RegistrationModel.findOne(registration);
            return RegistrationRepositoryMongoDB.mapRegistrationToEntity(registrationDocument);
        } catch (error) {
            console.error("Error finding registration:", error);
            return null;
        }
    }

    private static mapRegistrationToEntity(mongooseRegistration: RegistrationDocument | null): Registration | null {
        if (!mongooseRegistration) return null;

        const registration = new Registration({
            uuid: mongooseRegistration.uuid,
            entity: mongooseRegistration.entity,
            deviceId: mongooseRegistration.metadata.deviceId,
            locationId: mongooseRegistration.metadata.locationId,
            networkId: mongooseRegistration.metadata.networkId,
            giggrId: mongooseRegistration.giggrId
        });

        registration.name = mongooseRegistration.name;
        registration.email = mongooseRegistration.email;
        registration.phone = mongooseRegistration.phone;
        registration.dateOfBirth = mongooseRegistration.dateOfBirth;

        return registration;
    }
}