interface Message {
    role: string;
    message: string;
}

interface ChatParams {
    description: string;
    messages: Message[];
    initiated: boolean;
    closed: boolean;
}

/** Definition for a chat entity within the platform. */
export class Chat {
    /** A brief description of the chat. This can also be an LLM initial prompt. */
    description: string;
    /** An array of messages exchanged within the chat. */
    messages: Message[];
    /** Indicates whether the chat has been initiated. */
    initiated: boolean;
    /** Indicates whether the chat has been closed. */
    closed: boolean;

    constructor({ description, messages, initiated, closed }: ChatParams) {
        this.description = description;
        this.messages = messages;
        this.initiated = initiated;
        this.closed = closed;
    }
}
