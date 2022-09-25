# Databases used by WASM Actions

## Initial requirements

- NoSQL - the project contains little to no relational information
- Document store - database models may be arbitrarily complex
- Simple setup - needs to be launchable with a single Podman command
- Needs to have decent NodeJS client bindings

## Evaluation

Initially the plan was to use [SurrealDB](https://surrealdb.com/) as the main database for
WASM Actions, but the NodeJS bindings and/or documentation was found to be too immature for
it to be used in this project.

Therefore it was decided to simply use MongoDB document database. It has been used during
Full Stack courses and it's programming model is simple, and the Docker image is suitable
for quick deployments without need for extensive configuration.

## Data model

### Users

```json
{
  "username": "string",
  "password": "string"
}
```
