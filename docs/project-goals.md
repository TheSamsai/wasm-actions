# WASM Actions - Project goals

WASM Actions is designed as a pseudo-serverless platform for developers to deploy WebAssembly (WASM)
workloads as HTTP handlers. These workloads can be managed via a developer dashboard, which allows 
deployment of new WASM modules, deletion of existing WASM modules and possibly capabilities management
features to control features available to a WASM module.

## Basic principles of "serverless" operation

Each WASM module will be written to execute on a trigger, which is an HTTP request sent to a specifically named
HTTP endpoint. This endpoint will first locate the associated WASM module, load it and execute it. The contents of
the HTTP request are passed to the WASM module via appropriate communication channels, most likely following
the [CGI](https://en.wikipedia.org/wiki/Common_Gateway_Interface) model of passing data via environment variables
and STDIN. WASM module will produce a response via STDOUT.

Because WASM modules are not kept constantly running, the platform performs rudimentary "down-scaling" by
discarding modules that are not currently required. In practice this does not significantly differ from basic CGI
scripts executed by a web server except in terms of WASM security features. WASM workloads are, by default,
completely isolated from each other and their interaction towards the runtime environment is limited by
a strict system of opt-in capabilities.

Because of this request-response principle, WASM workloads should also have a defined maximum execution time,
such as 5 seconds. If a workload exceeds its runtime allotment, it should be halted and an error returned as
an HTTP response.

## Workload capabilities

In the minimum viable product, developers should be able to deploy "toy-like" WebAssembly workloads on the
platform. These kinds of workloads are entirely stateless and pure in that they have only access to the data
sent in the HTTP request and are only able to produce an HTTP response. Workloads have no access to persistent
storage and cannot trigger any side-effects, such as make HTTP requests of their own. The workloads are able
to do basic computation, such as produce lists of prime numbers or operate on values sent in the request
body. The practical usefulness of these kinds of workloads is limited, but it is enough to showcase the basic
functionality of the platform.

An improved version of the system provides some additional capabilities that developers may opt into. Most
likely the most important capability is controlled access to persistent storage of some kind. For this purpose
a developer-specific key-value storage system may be a good option. Different workloads may have access to
the same key-value storage with read/write permissions. With this capability, already quite complex systems
could be developed, such as forums or basic micro-blogging services.

**Note**: For Wasm Actions, persistance is handled via WASI and the concept of virtual filesystems that allow
directories to be mapped into the running WASM program. To save time, it was decided that providing this would
allow enough persistence for Actions without needing a specific KV-store capability.

Advanced capabilities may include the ability to access the file system in a controlled manner and execute
HTTP requests or chain calls through multiple WASM modules. With these features the platform would be able to
match the basic feature set of serverless platforms.

**Note**: Due to time constraints the networking/HTTP capability was left out due to WASM runtimes generally not
splitting it off into a separate module/capability. The underlying runtime (WasmEdge) supports TCP sockets,
but since this is included in WASI, it cannot be controllably enabled or disabled. 

## Developer dashboard

The developer dashboard is the central location from which developers will deploy and manage their workloads.
It needs to be protected by user authentication and authorization (password login, JWT sessions).

The dashboard should present a login/register page (TODO: Decide if registrations need to be controlled somehow
in example deployment). The main dashboard view should list currently deployed workloads and provide ability
to delete them, view their properties and alter those properties. There should be a way for the developer to
deploy a new workload as a WASM module (.wasm binary format) and pick a URL associated with the WASM module.

If/when capabilities are introduced, it should be possible to add or remove capabilities from specific WASM
workloads at will.

It would also be nice for the dashboard to provide access to logs and analytics, such as amount of requests
sent to a specific endpoint or average execution times.

If reasonable, it would also be nice to integrate some kind of a request testing system to the dashboard, so
that the user may send test sending different types of requests to a specific endpoint.
