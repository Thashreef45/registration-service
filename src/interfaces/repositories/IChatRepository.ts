import { Chat } from "../../domain/entities/Chat.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";

export default interface IChatRepository {
    /**
     * Persists a new chat entity to the database.
     * @param chat The chat entity to persist.
     * @returns A promise that resolves to a status code indicating the result of the operation.
     */
    persist(chat: Chat): Promise<StatusCode>;

    /**
     * Updates an existing chat entity in the database.
     * @param chat The chat entity to update.
     * @returns A promise that resolves to a status code indicating the result of the operation.
     */
    update(chat: Chat): Promise<StatusCode>;
    
    /**
     * Removes a chat entity from the database.
     * @param chat The chat entity to remove.
     * @returns A promise that resolves to a status code indicating the result of the operation.
     */
    remove(chat: Chat): Promise<StatusCode>;

    /**
     * Removes a chat from the database by its unique identifier.
     * @param chatId The unique identifier of the chat to remove.
     * @returns A promise that resolves to the removed chat entity or null if not found.
     */
    removeById(chatId: string): Promise<Chat | null>;

    /**
     * Retrieves a chat entity from the database by its unique identifier.
     * @param chatId The unique identifier of the chat to retrieve.
     * @returns A promise that resolves to the retrieved chat entity or null if not found.
     */
    findById(chatId: string): Promise<Chat | null>;

}
