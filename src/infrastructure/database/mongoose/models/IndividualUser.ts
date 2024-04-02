import mongoose, { Document, InferSchemaType } from "mongoose";
import { boolean } from "zod";

const IndividualAccuntSchema = new mongoose.Schema({
  UUID: {
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

const accountModel = mongoose.model("account", IndividualAccuntSchema);
export default accountModel;

/** Types */
type IndividualAccountType = InferSchemaType<typeof IndividualAccuntSchema>;
interface IndividualAccountDocument extends Document, IndividualAccountType {}
export { IndividualAccountType, IndividualAccountDocument };
