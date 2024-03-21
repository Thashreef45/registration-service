# Interfaces

Interface definitions for the abstraction layers defined using TypeScript, which enterprise logic depends on.

## `repositories`

The interfaces which define the blueprint for all persistence and database related operations. Business logic directly depends on implementations of these interfaces which will be injected at runtime.

## `services`

Similar to repositories, services are an abstraction layer for all dependencies that do not have persistence. For instance, OAuth managers, JWT, password management, and so forth.

## `webserver`

Any interfaces that defines abstraction layers for the Node.js server, which are implemented by infrastructure for example as Express.js or Fastify.