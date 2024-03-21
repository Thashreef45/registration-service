# Presentation

The user directly interacts with the presentation layer, which through the infrastructure layer talks to the application/domain layer (use cases and entities).

## `routers`

Contains all the express.js router objects which defines routes for a particular group.

## `middlewares`

Contains middlewares including schema validators and authentication checkers (which subsequently depends on the application/domain layer).

## `schemas`

Every request that comes in needs to go through a schema-validation defined by Zod. We can also infer TypeScript types from the validators defined for the requests.

## `controllers`

The Express.js defined controllers which handle requests, passes it to the interactors and responds to the user with a result or a status code.