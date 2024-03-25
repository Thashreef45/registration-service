interface createNewUserInput {
  name: string;
  email: string;
  phone: string;
  dob: string;
  lifeId: string;
}

interface createNewUserOutput {
  success: boolean;
}

export { createNewUserInput, createNewUserOutput };
