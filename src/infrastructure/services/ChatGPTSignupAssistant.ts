import { Chat } from "../../domain/entities/Chat.js";
import { ISignupAssistant, ResponseType } from "../../interfaces/services/ISIgnupAssistant.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import environment from "../config/environment.js";
import OpenAI from "openai";

export class ChatGPTSignupAssistant implements ISignupAssistant {
    // todo: dynamic prompts "A user from X", "today is Y"
    private context: Chat = new Chat({
        id: "NA",
        description: "Signup Assistant",
        messages: [
            {
                "role": "system",
                "content": "You are the conversational sign up assistant for a digital platform called \"Giggr\". Your role is to ask users questions to gather information about them in order to register them an account.\n\nThe required fields are:\n- name: The full name (preferably) or first name of the person signing up.\n- phone: The mobile number of the person.\n- email: The email address of the person.\n\nYou must make them fill out all the necessary fields. They may be filled in any order. You may ask clarifying questions if a field has only been filled partially. \n\nYou have a friendly personality and is excited to guide the user through the signup process by asking simple questions. You will not allow the user to divert the conversational flow away from sign up. If a user responds out of line, reply \"I could not understand\" and then prompt for the rest of the missing fields again.\n\nYou understand that the user may input information that could contain noise, incorrect spellings, or formats. You should try your best to understand and parse the information intelligently. For instance, an email inputted as \"hello at example dot com\" should be interpreted as \"hello@example.com\", similarly john with an underscore doe at outlook com\" is \"john_doe@outlook.com\" and so on for all of the fields.\n\nYou may let the user change fields that have already been filled if they made a mistake. If a field has already been filled, no need to ask again.\n\nFor sake of parsing, you must only respond in JSON with the fields \"message\" with your message and \"field\" with the field being asked for, \"fields\" with values of fields that have been filled and null if not filled.\nEg:\n```json\n{\n  \"message\": \"What is your name?\",\n  \"field\": \"name\",\n  \"fields\": { \"name\": null, \"phone\": null, \"email\": null }\n}\n```\n\nAn example flow:\nSystem: A user from India has initiated the signup process. Today is 27-03-2024\nAgent: ```{\"message\": \"Greetings! What is your name?\", \"field\": \"name\", \"fields\": { \"name\": null, \"phone\": null, \"email\": null }}```\nUser: \"My name is John Doe\"\nAgent: ```{\"message\": \"Pleased to meet you John! What is your mobile number?\", \"field\": \"phone\", \"fields\": { \"name\": null, \"phone\": null, \"email\": null }}```\nUser: \"It is 91234567889\nAgent: ```{\"message\": \"Great! One last thing, what is your email address?\", \"field\": \"email\", \"fields\": { \"name\": \"John Doe\", \"phone\": null, \"email\": null }}```\nUser: \"It is hello at example dot com\"\nAgent: ```{\"message\": \"Just to confirm, it is hello@example.com, correct?\", \"field\": \"email\", \"fields\": { \"name\": \"John Doe\", \"phone\": \"91234567889, \"email\": null }}```\nUser: \"Yes.\"\nAgent: ```{\"message\": \"Thank you! Welcome to a digital you.\", \"field\": \"\", \"fields\": { \"name\": \"John Doe\", \"phone\": \"91234567889, \"email\": \"hello@example.com\" }}```\n\n\n---\nContinue the following, no prose.\n\nSystem: A user from India has initiated the signup process. Today is 31-03-2024"
            },
            {
                "role": "assistant",
                "content": "```{\"message\": \"Greetings! What is your name?\", \"field\": \"name\", \"fields\": { \"name\": null, \"phone\": null, \"email\": null }}```"
            }
        ],
        initiated: false,
        closed: false
    });

    private readonly openai: OpenAI;

    constructor(signupToken: string) {
        this.openai = new OpenAI({
            apiKey: environment.OPENAI_API_KEY,
        });

        this.context.id = signupToken;
    }

    recall(context: Chat): boolean {
        this.context = context;
        return true;
    };

    getContext(): Chat {
        return this.context;
    }

    compose(message: string): boolean {
        this.context.messages.push({
            role: "user",
            content: message
        });

        return true;
    }

    async getResponse(): Promise<ResponseType> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: this.context.messages as any,
            temperature: 0.5,
            max_tokens: 128,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const responseRaw = response.choices[0].message.content as string;

        this.context.messages.push({
            role: "assistant",
            content: responseRaw
        })

        const processed = responseRaw.replaceAll("```json", "").replaceAll("```", "").trim();
        // todo: if parsing fails, we can rollback that user input with this.context.messages.pop().
        const responseJSON = JSON.parse(processed) as ResponseType;

        return responseJSON;
    }

    rollback(): boolean {
        for (let i = 0; i < 2; i++) {
            this.context.messages.pop();
        }
        return true;
    }
}
