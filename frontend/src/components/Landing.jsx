
const Landing = () => {
  return <div style={{ display: "flex", marginLeft: "100px", marginRight: "100px", flexDirection: "column"}}>
           <div style={{ display: "flex", flexDirection: "row", gap: "50px"}}>
             <h1>WASM Actions</h1>

             <img src="logo.png" width="200"></img>
           </div>

           <h2>What is it?</h2>
           <p>
             WASM Actions is a platform for creating custom HTTP
             request handlers using a combination of new and old
             technology. Request endpoints are powered by WebAssembly
             technology to provide safe and sandboxed execution
             environments for request processing. Request themselves
             are passed to handlers using the <a href="https://en.wikipedia.org/wiki/Common_Gateway_Interface">Common Gateway Interface</a> which
             works very well with the WebAssembly System Interface (WASI)
             to provide a clear separation of the runtime environment.
           </p>

           <h2>How to get started?</h2>
           <p>
             You can register and log into the platform from the top-right corner
             of the page (under "Login").
           </p>

           <p>
             After this you can begin deploying endpoints. Endpoints can be written
             in any programming language that can target the WASM32-WASI compilation
             target. You can find examples <a href="https://github.com/TheSamsai/wasm-actions/tree/main/wasm-workloads">here</a>.
             The key thing to remember is that WASM endpoints must be designed in
             accordance with the Common Gateway Inteface style, meaning they must
             execute to completion within a few seconds.
           </p>

           <h2>What are the benefits of WASM Actions?</h2>

           <p>
             WASM Actions shares some common benefits with the old-school CGI approach,
             which have since been rediscovered through the idea of "serverless"
             applications. Namely, CGI scripts - similar to WASM Actions endpoints -
             only consume runtime resources when active. They are launched in response
             to an incoming request and automatically shut down when idle. Additionally
             WASM Actions endpoints are just as easy to deploy as PHP scripts:
             you just need to upload a file and your deployment is ready.
           </p>

           <p>
             However, WASM Actions leverages modern tech to provide
             additional benefits.  WASM endpoints are securely
             sandboxed using a WebAssembly runtime, meaning that
             endpoints cannot access files, processes or memory
             regions beyond the ones they have been given explicit access
             to. This secure-by-default and capabilities-oriented approach
             reduces the attack surface and potential damage of exploits
             in web services deployed in this way.
           </p>

           <p>
             At the same time WebAssembly provides portability across different
             CPU architectures and bundling capabilities without the need for
             container images. Your WASM binaries can be self-contained and
             managed just like files, because that's exactly what they are.
           </p>

           <p>
             Because WASM Actions endpoints communicate according to the CGI
             standard, your WASM endpoints don't suffer from vendor lock-in.
             If you are unhappy with WASM Actions, your endpoint binaries can
             simply be deployed elsewhere.
           </p>

           <h2>WASM Actions is Open</h2>

           <img src="agplv3.png" width="162"></img>

           <p>
             WASM Actions is Free and Open Source software under the GNU Affero
             General Public License version 3.0. You can freely access,
             modify and share the source code of WASM Actions here: <a href="https://github.com/TheSamsai/wasm-actions">https://github.com/TheSamsai/wasm-actions</a>
           </p>

           <p>Feel free to deploy your own instances of the software and build on top of it!</p>
           
         </div> }

export default Landing
