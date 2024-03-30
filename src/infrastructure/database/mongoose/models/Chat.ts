import mongoose, { Document, InferSchemaType, ObtainDocumentType } from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    }
})

const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    messages: {
        type: [messageSchema],
        required: true,
        default: []
    },
    initiated: {
        type: Boolean,
        required: true,
        default: false
    },
    closed: {
        type: Boolean,
        required: true,
        default: false
    }
});

const chatModel = mongoose.model('Chat', chatSchema);
export default chatModel;

/** Types */
// type ChatType = InferSchemaType<typeof chatSchema>;
type ChatType = {
    id: string;
    description: string;
    messages: [{
        role: string;
        content: string;
    }];
    initiated: boolean;
    closed: boolean;
}
// interface ChatDocument extends Document, ChatType { };
// Cannot export { ChatDocument }
//! https://github.com/Automattic/mongoose/issues/13772
export { ChatType };