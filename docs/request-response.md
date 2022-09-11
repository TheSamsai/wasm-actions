# What requests and responses look like in WASM Actions

This document aims to detail and plan how data is passed into a WASM module and how responses
are returned to the host Express.js backend in order to receive and process HTTP requests
correctly.

This document assumes the use of WASI (WebAssembly System Interface), which provides WASM
modules access to environment variables, standard I/O and restricted file I/O.

## Request

- Request type (GET, POST, etc) - passed in as `REQUEST_METHOD` environment variable
- Request path - passed in as `PATH_INFO` environment variable
- URL parameters - passed in as `QUERY_STRING` environment variable
- Request body - passed in via standard input

## Response

- Response protocol - 
- Response header - returned via standard output
- Response body - returned via standard output 
