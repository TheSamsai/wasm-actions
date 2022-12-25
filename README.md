# WASM Actions - platform for deploying WASM web workloads

WASM Actions is a pseudo-serverless platform intended to allow
developers to develop HTTP endpoint handlers in WebAssembly. WASM
Actions is being developed as part of a University of Helsinki Full
Stack Project course.

## How this project is structured

This project consists of two main pieces: the `backend` and the `frontend`.
Both are located in this repository under their respective directories.

The backend is a basic Express.js backend that implements the APIs required
to perform user authentication, WASM workload management and execution of
those workloads.

The frontend is a React application which provides an SPA (single-page-application)
dashboard for managing WASM Actions in the browser.

## Documentation

[User Guide](https://github.com/TheSamsai/wasm-actions/blob/main/docs/user-guide.md)

[Setup and developer guide](https://github.com/TheSamsai/wasm-actions/blob/main/docs/setup-guide.md)

[Time keeping](https://github.com/TheSamsai/wasm-actions/blob/main/docs/time-keeping.md)

## License

![AGPLv3 Logo](https://www.gnu.org/graphics/agplv3-with-text-162x68.png)

This project is licensed under the GNU Affero General Public License
version 3.0.  You can find the license terms under the LICENSE
file. But, in a nutshell, you can freely use the software for any
purpose, study and modify it and share with others. However,
modified versions must be accompanied with the source code and
be provided under the same or compatible license.

You must also provide the source code under the same or compatible
license for users if you deploy modified versions of the software for
them.

Note that these license terms do not affect any HTTP endpoint handlers
deployed onto a running instance of the platform. Deployments of WASM
endpoints are considered separate to the WASM Actions software itself.

## Try it out

A test instance is available at http://65.109.12.223:3000/

Note that data stored on the test instance is deleted daily, do not expect your files
to be there when you return.
