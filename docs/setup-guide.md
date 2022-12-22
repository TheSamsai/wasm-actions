
# Setup and developer guide

## Architecture

WASM Actions is built using the MERN stack (MongoDB, Express, React, Node) and consists of three
components that must be connected to each other for the system to function. These components are:

- the WASM Actions frontend
- the WASM Actions backend
- MongoDB

Of these components, the first two are specifically built for the system, whereas MongoDB is a
third-party database software that provides the persistence layer for the software. The frontend
needs to talk to the backend in order for user actions to be performed and the backend needs
to talk to the database in order to store and retrieve information.

```
                        Server FW
                            |
                            |
    +--------------+        |                                             +------------+
    |              |        |         +-------------------+               |            |
    |              |        |         |                   |               |            |
    |              |        |       \ |     Backend       |             \ |  MongoDB   |
    |   Frontend   |--------+--------X|                   |--------------X|            |
    |              |        |       / |                   |             / |            |
    |              |        |         +-------------------+               |            |
    |              |        |                                             +------------+
    +--------------+        |
                            |
```

The key thing is that the Backend must be accessible from the frontend (which is in practice
running on a user's web browser). However, the database should not be exposed to the outside
due to security reasons and should be configured to be only accessible internally.

## Environment configuration

Important information is passed into the software components via environment variables.
These allow the user to define certain configuration options. The MongoDB instance requires
little configuration by default, but both the Frontend and the Backend must be configured
correctly with a few variables.

### Frontend configuration

The URL to the running backend instance must be configured in the frontend via the
`REACT_APP_BACKEND_URL` environment variable. 

For example:
```
REACT_APP_BACKEND_URL="http://localhost:3001"
```

Note that because the frontend component consists of statically built web assets, the
environment variable must be passed at **build time**. You can do so by modifying the
`.env.production` file in the `frontend` directory or by creating a local override
in a `.env.production.local` file and then running `yarn build`.

### Backend configuration

The backend requires two configuration options:
- the URL of the MongoDB instance, passed in via the `MONGODB` environment variable
- a secret key used for signing JWTs for user sessions passed in via the `SECRET_KEY`variable

## Deployment

For deployment purposes, a `compose.yml` file is provided that can be used with Docker Compose
or Podman Compose. Prebuilt Docker images exist, but because environment information is
baked into the frontend image, it cannot be used for making separate deployments. Therefore
the best course of action is to build the images yourself and deploy them.

Using Podman Compose, you can get a working deployment as follows:

`podman-compose build && podman-compose up`

Alternatively uncontainerized deployments are possible by simply running the backend in
production mode:

`cd backend && yarn && yarn start-prod` 

and then building the frontend files and serving them with your web server of choice:

`cd frontend && yarn && yarn build && cp -r build/* /var/www/html/`

However, the specific details of these kinds of deployments are left out here for
brevity.
