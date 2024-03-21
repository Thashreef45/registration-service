# Use Cases

This directory holds the core business logic of the project, including events (triggered by message brokers) and interactions by the user. The business logic must be framework, library, and database independent. It should only depend on interfaces defined as entities, repositories, and services, instances of which will be injected as dependencies during runtime.

## `interactors`

When a request comes in to a route defined by Express.js, the request object passes some validations, after which it goes through a serializer which maps it to business entities, and then said entities are passed onto interactors. 

## `events`

An event triggered by any other service or part of the platform will go through a serializer and be passed onto interactors defined in the events subfolder. This separation is mostly, merely for sake of organization.

## `shared`

Contains interfaces and types (such as errors) required by business logic.