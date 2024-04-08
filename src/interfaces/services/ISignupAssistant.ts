import { Chat } from "../../domain/entities/Chat.js";

export type ResponseType = {
    message: string;
    field: string | null;
    fields: {
        name: string | null;
        email: string | null;
        phone: string | null;
    };
}

export type Fields = {
    name: string | null;
    email: string | null;
    phone: string | null;
}

export type Message = {
    role: "assistant" | "system" | "user";
    content: string;
    field: string | null;
}

export interface ISignupAssistant {
    fields: Fields;
    /** Set a Chat entity as context. */
    recall(context: Chat): boolean;
    /** Retrieve the current context as a Chat entity. */
    getContext(): Chat;
    /** Compose a new message, but not send it. */
    compose(message: string): boolean;
    /** Send the composed message and get a response. */
    getResponse(): Promise<ResponseType>;
    /** Undo last two messages from context. */
    rollback(): boolean;
    /** Retrieves the full message history. */
    getHistory(): Message[];
}
