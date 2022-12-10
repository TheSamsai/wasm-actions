
# User guide

## Creating an account

When opening the application, you will be prompted to login. You can find both the account registration
and login under the Login button on the top right of the page. When the system has reported that an
account has been successfully registered, you may log into the account with the same credentials.

## Resources

### Virtual filesystems

WASM Actions provides a security feature that will restrict different WASM endpoints to specific
subfolders. If two actions need access to the same files, you can grant them access to a shared
virtual filesystem. This way you can, for instance, implement a protected admin endpoint that
can grant you access to things like logs alongside another endpoint meant for basic consumption.

Virtual filesystems can be created and destroyed freely. However, deletion of a virtual filesystem
will destroy all contents and they cannot be recovered. Endpoints which have been configured to
use this filesystem may also stop functioning correctly.

Virtual filesystems are created by filling the name in the text field and pressing "Create". The list
of virtual filesystems will be populated and alongside each you can find the "Delete" button, which
allows the virtual filesystem to be destroyed.

### WASM Endpoints

WASM Endpoints represent handlers or Actions which have been deployed onto the service. They provide
a way to process HTTP requests in a "serverless" fashion.

The "Create a new endpoint" button will take you to a form that allows you to fill in the endpoint details:

- WASM File - a binary WebAssembly module built against the WASM32-WASI target

- Endpoint security
  - Token protection - whether to use a protection token
  - Token - the token used to password-protect this endpoint

- Capabilities
  - Filesystem access - whether this endpoint should be able to use a virtual filesystem
  - Virtual filesystem - which virtual filesystem the system may use
  
You can alter these details after the endpoint has been created on the home page. The home view will
also show error logs for each endpoint and allow the endpoint to be deleted.

## How to create WASM Endpoints

Each WASM Endpoint is simply a WebAssembly program built using WASI (the WebAssembly System Interface).
WASI is used to provide input and output functions for receiving data from the HTTP request and to
output the response and possibly read and write to files.

The WASM Endpoint should adhere to the Common Gateway Protocol, which means that environment variables
and standard input/output are used to communicate between the client and the server.

The Endpoint is provided the following information as environment variables:

- HTTP_content-length - the length of the request body
- METHOD - whether this request is a "GET", "POST", "DELETE" etc. HTTP request
- PATH_INFO - the path of this request
- QUERY_STRING - all of the query parameters in a single string

At the time of writing, it is assumed that request coming into a WASM Endpoint have the "application/json"
content type. Therefore the main purpose for WASM Endpoints is to receive and send data as JSON.

The request body is supplied to the program via standard input (stdin). The Endpoint should produce a response
by outputting to standard output (stdout).

WASM Endpoints also have a limited execution time of 5000 milliseconds. If an endpoint executes longer than that,
it will be halted, which may result in partial or no response.

You can check out [Sample Endpoints](https://github.com/TheSamsai/wasm-actions/tree/main/wasm-workloads) which
implement different types of endpoints written in the Rust programming language. You will also find precompiled
WASM binaries for them, so you can try uploading them onto the WASM Actions portal as-is.

WASM Endpoints can be implemented in any language that can be successfully compiled into a WASM32 WASI binary.
