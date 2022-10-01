
import { useState } from 'react'

const WasmEndpoint = () => {
    
    const [shown, setShown] = useState(false);

    const handleToggleShown = () => {
        setShown(!shown);
    }

    return (
        <div>
          <h2>[Example endpoint] <button onClick={handleToggleShown}>Toggle</button></h2>

          { shown ?
            <div>
              <p>Endpoint URL: <a href="http://127.0.0.1/wasm/example-endpoint">http://127.0.0.1/wasm/example-endpoint</a></p>

              <div class="capability-options">
                <label for="wasm-module">Update WASM:</label>
                <input type="file" id="wasm-module" name="wasm-module"></input> 
              </div>

              <div>
                <h3>Capabilities</h3>
                <div class="capability-options">
                  <label>Filesystem access</label>
                  <input type="checkbox"></input>
                </div>

                <div class="capability-options">
                  <label>Filesystem prefix</label>
                  <input type="text"></input>
                </div>

                <div class="capability-options">
                  <label>HTTP requests</label>
                  <input type="checkbox"></input>
                </div>
              </div>

              <div class="endpoint-management-buttons">
                <button style={{backgroundColor: "red"}}>Delete</button>
                <button style={{backgroundColor: "green"}}>Apply</button>
              </div>
            </div>
            : <div></div> }
        </div>
    )
}

export default WasmEndpoint;
