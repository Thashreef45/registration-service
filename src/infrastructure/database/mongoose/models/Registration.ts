import mongoose, { Document, InferSchemaType } from 'mongoose';

const registrationSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    otpRequested: {
        type: Boolean,
        required: true,
        default: false
    },
    otpVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    }
});

const registrationModel = mongoose.model('Registration', registrationSchema);
export default registrationModel;

/** Types */
type RegistrationType = InferSchemaType<typeof registrationSchema>;
interface RegistrationDocument extends Document, RegistrationType { };
export { RegistrationType, RegistrationDocument };