# Infrastructure

This layer holds all the frameworks, drivers and tools such as Database, the Web Framework, mailing/logging/glue code etc.

## `webserver`

Contains the `server.ts` which contains Express.js configuration where the routers and middlewares are injected.

## `database`

The database dependent code, such as connection with MongoDB as well as models defined via Mongoose ODM.

## `config`

- `bootstrap.ts` is the initialization script ran by the main script. It glues the webserver logic and connections and makes sure configurations are applied sequentially.
- `environment.ts` is the single source of truth for all globally available environment variables. This prevents dependence on `process.env` and opens room for moving onto managed secrets/variables providers like Infisical in the future.