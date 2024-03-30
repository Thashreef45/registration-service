import { Chat } from "../../domain/entities/Chat.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import IChatRepository from "../../interfaces/repositories/IChatRepository.js";
import ChatModel from "../database/mongoose/models/Chat.js";

export default class ChatRepositoryMongoDB implements IChatRepository {
    async persist(chat: Chat): Promise<StatusCode> {
        try {
            await ChatModel.create(chat); // Create a new document in the 'chats' collection
            return StatusCode.CREATED;
        } catch (error) {
            console.error("Error persisting chat:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async update(chat: Chat): Promise<StatusCode> {
        try {
            await ChatModel.findOneAndUpdate({ id: chat.id }, chat); // Update the chat document
            return StatusCode.ACCEPTED;
        } catch (error) {
            console.error("Error updating chat:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async remove(chat: Chat): Promise<StatusCode> {
        try {
            await ChatModel.deleteOne({ id: chat.id }); // Remove the chat document
            return StatusCode.ACCEPTED;
        } catch (error) {
            console.error("Error removing chat:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async removeById(chatId: string): Promise<Chat | null> {
        try {
            const removedChat = await ChatModel.findOneAndDelete({ id: chatId }).lean();
            return removedChat;
        } catch (error) {
            console.error("Error removing chat by ID:", error);
            return null;
        }
    }

    async findById(chatId: string): Promise<Chat | null> {
        try {
            const chat = await ChatModel.findOne({ id: chatId }).lean();
            return chat;
        } catch (error) {
            console.error("Error finding chat by ID:", error);
            return null;
        }
    }
}
