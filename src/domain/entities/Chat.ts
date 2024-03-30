interface Message {
    role: string;
    message: string;
}

interface ChatParams {
    id: string;
    description: string;
    messages: Message[];
    initiated: boolean;
    closed: boolean;
}

/** Definition for a chat entity within the platform. */
export class Chat {
    /** A unique identifier for the chat to associate with a registration. */
    id: string;
    /** An array of messages exchanged within the chat. */
    description: string;
    /** An array of messages exchanged within the chat. */
    messages: Message[];
    /** Indicates whether the chat has been initiated. */
    initiated: boolean;
    /** Indicates whether the chat has been closed. */
    closed: boolean;

    constructor({ id, description, messages, initiated, closed }: ChatParams) {
        this.id = id;
        this.description = description;
        this.messages = messages;
        this.initiated = initiated;
        this.closed = closed;
    }
}
