import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import IChatRepository from "../../interfaces/repositories/IChatRepository.js";
import { ISignupAssistant } from "../../interfaces/services/ISignupAssistant.js";

export default class Converse implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly chatRepository: IChatRepository;
  private signupAssistant: ISignupAssistant;

  constructor({ chatRepository, registrationRepository, signupAssistant }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.chatRepository = chatRepository;
    this.signupAssistant = signupAssistant;
  }

  async execute({ signupId, message }: Input): Promise<Output> {

    // verify signup id to be proper.
    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration || registration.giggrId) {
      throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    // retrieve chat or create
    let chat = await this.chatRepository.findById(signupId);
    if (!chat) {
      chat = this.signupAssistant.getContext();
      chat.id = signupId;
      const didPersist = await this.chatRepository.persist(chat);
      if (didPersist != StatusCode.CREATED) {
        throw new AppError("Could not persist chat.", StatusCode.INTERNAL_ERROR);
      }
    }

    this.signupAssistant.recall(chat);

    this.signupAssistant.compose(message);
    const response = await this.signupAssistant.getResponse();

    // persist
    chat = this.signupAssistant.getContext();
    chat.id = signupId;

    const mergedStatus = await this.chatRepository.update(chat);
    if (mergedStatus !== StatusCode.ACCEPTED) {
      throw new AppError("Could not update chat.", mergedStatus);
    }

    return {
      reply: response.message,
      field: response.field,
      fields: response.fields
    }
  }
}

interface Dependencies {
  chatRepository: IChatRepository;
  registrationRepository: IRegistrationRepository;
  signupAssistant: ISignupAssistant;
}

interface Input {
  /** Transient user entity identifier. */
  signupId: string;
  /** Message to be sent to the conversational assistant. */
  message: string;
}

interface Output {
  /** A message back from the assistant. */
  reply: string;
  /** The field the assistant is asking for. */
  field: string | null;
  /** The fields which have been filled. */
  fields: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}