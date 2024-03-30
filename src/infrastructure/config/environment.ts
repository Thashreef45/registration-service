import dotenv from 'dotenv';
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
        // JWT_SECRET: process.env.JWT_SECRET as string,
        /** Brokers defined for Kafka */
        // KAFKA_BROKERS: (process.env.KAFKA_BROKERS as string).split(','),
        /** The URL of the frontend. */
        // FRONTEND_URL: process.env.FRONTEND_URL
    };

    return env;
})();