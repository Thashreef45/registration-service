import dotenv from "dotenv";
dotenv.config();

export default (() => {
  console.log("[env] Environment variables have been injected from `.env`");

  const env = {
    /** The current environment of the Node.js application. (development / production) */
    NODE_ENV: process.env.NODE_ENV as string,
    /** The port number which the Express.js server listens on. */
    PORT: Number(process.env.PORT as string),
    /** The connection URL of MongoDB database. */
    DATABASE_URL: process.env.DATABASE_URL as string,
    /** OpenAI API Key used for GPT */
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    /** Secret to sign the access token with. */
    JWT_SECRET: process.env.JWT_SECRET as string,
    /** Brokers defined for Kafka */
    // KAFKA_BROKERS: (process.env.KAFKA_BROKERS as string).split(','),
    /** The URL of the frontend. */
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    /** The connection URL of MongoDB database. */
    TWILIO_SID: process.env.TWILIO_SID as string,
    TWILIO_TOKEN: process.env.TWILIO_TOKEN as string,
    TWILIO_VERIFY_SERVICE_ID: process.env.TWILIO_VERIFY_SERVICE_ID as string,

    //email for verification
    MAIL_USERNAME: process.env.MAIL_USERNAME as string,
    MAIL_PASS: process.env.MAIL_PASS as string,

    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env
      .GOOGLE_OAUTH_CLIENT_SECRET as string,

    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID as string,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET as string,

    //Neo4j
    NEO_USER: process.env.NEO_USER as string,
    NEO_URI: process.env.NEO_URI as string,
    NEO_PASSWORD: process.env.NEO_PASSWORD as string,
  };

  return env;
})();
