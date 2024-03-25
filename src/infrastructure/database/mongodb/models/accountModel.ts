import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    lifeId: {
        type: String,
        required: true,
        unique : true,
        length : 16,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique : true,
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },

});

const accountModel = mongoose.model('account', accountSchema);
export default accountModel;