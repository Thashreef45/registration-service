import mongoose, { Document, InferSchemaType } from 'mongoose';

const registrationSchema = new mongoose.Schema({
    uuid: {
      type: String,
      required: false,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      id: { type: String, required: false, unique: false },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    phone: {
      no: { type: String, required: false, unique: false },
      isVerified: {
        type: Boolean,
        default: false,
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
    },
    mailOTP: String,
    isRegistered: {
      type: Boolean,
      default: false,
    },
  });

const registrationModel = mongoose.model('Registration', registrationSchema);
export default registrationModel;

/** Types */
type RegistrationType = InferSchemaType<typeof registrationSchema>;
interface RegistrationDocument extends Document, RegistrationType { };
export { RegistrationType, RegistrationDocument };
