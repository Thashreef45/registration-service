import mongoose, { Document, InferSchemaType } from "mongoose";

const accountSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true,
    length: 16,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  phone: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  OTP: String,
});

const accountModel = mongoose.model("account", accountSchema);
export default accountModel;

/** Types */
type AccountType = InferSchemaType<typeof accountSchema>;
interface AccountDocument extends Document, AccountType {}
export { AccountType, AccountDocument };
