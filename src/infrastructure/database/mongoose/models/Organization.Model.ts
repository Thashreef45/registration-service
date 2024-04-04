import mongoose, { Document, Schema } from 'mongoose';

interface OrganizationAttributes {
    uuid: string;
    adminUUID: string;
    name?: string;
    entity: "industry" | "institute";
    extension?: string;
    // members: [{ uuid: string; role: "administrator" }]
    documents: "awaiting" | "pending" | "approved";
    giggrId?: string;
}

interface OrganizationDocument extends Document, OrganizationAttributes {}

const registrationSchema = new Schema<OrganizationDocument>({
    uuid: { type: String, required: true },
    adminUUID: { type: String, required: true },
    name: { type: String },
    entity: { type: String, enum: ["industry", "institute"], required: true },
    extension: { type: String },
    documents: { type: String, enum: ["awaiting", "pending", "approved"], required: true, default: "awaiting" },
    giggrId: { type: String }
});

const RegistrationModel = mongoose.model<OrganizationDocument>('Registration', registrationSchema);
export default RegistrationModel;

export { OrganizationDocument, OrganizationAttributes };