import { Registration } from "../../domain/entities/Registration.js";

export default interface IOAuthManager {
    getUser(code: string): Promise<Registration | null>;
}