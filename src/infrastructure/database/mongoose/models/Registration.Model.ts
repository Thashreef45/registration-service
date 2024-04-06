import mongoose, { Document, Schema } from 'mongoose';

interface Metadata {
    deviceId: string;
    networkId: string;
    locationId: string;
    platformId?: string;
    metaChecksum?: string;
}

interface Email {
    id?: string;
    otp?: string;
    isVerified: boolean;
}

interface Phone {
    number?: string;
    otp?: string;
    isVerified: boolean;
}

interface Approval {
    isRequired: boolean;
    isRequested?: boolean;
    isFrom?: "guardian"  | "administrator";
    isApproved: boolean;
}

interface RegistrationAttributes {
    uuid: string;
    entity: "individual" | "industry" | "institute";
    role: "administrator" | "user";
    metadata: Metadata;
    name?: string;
    email: Email;
    phone: Phone;
    approval: Approval;
    dateOfBirth?: Date;
    giggrId?: string;
}

interface RegistrationDocument extends Document, RegistrationAttributes { }

const registrationSchema = new Schema<RegistrationDocument>({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    entity: {
        type: String,
        enum: ["individual", "industry", "institute"],
        required: true
    },
    role: {
        type: String,
        enum: ["administrator", "user"],
        required: true
    },
    metadata: {
        deviceId: {
            type: String,
            required: true
        },
        networkId: {
            type: String,
            required: true
        },
        locationId: {
            type: String,
            required: true
        },
        platformId: String,
        metaChecksum: String
    },
    name: String,
    email: {
        id: String,
        otp: String,
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    phone: {
        number: String,
        otp: String,
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    approval: {
        isApproved: {
            type: Boolean,
            required: true,
            default: false
        },
        isRequested: Boolean,
        isFrom: {
            type: String,
            enum: ["administrator", "guardian"],
        },
        isRequired: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    dateOfBirth: Date,

    giggrId: String
});

const RegistrationModel = mongoose.model<RegistrationDocument>('Registration', registrationSchema);
export default RegistrationModel;

export { RegistrationDocument, RegistrationAttributes };