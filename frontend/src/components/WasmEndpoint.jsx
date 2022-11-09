
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { create_action, delete_action } from '../services/actions';


const WasmEndpoint = (props) => {
  const { user, endpoint, setEndpoints, setError, closeForm } = props;
  
  const [selectedFile, setSelectedFile] = useState(null);

  console.log(endpoint)

  const [usingProtectionToken, setUsingProtectionToken] = useState(endpoint ? endpoint.params.hasOwnProperty("protectionToken") : false)
  const [protectionToken, setProtectionToken] = useState(endpoint ? (endpoint.params.protectionToken ? endpoint.params.protectionToken : "") : "")

  console.log(usingProtectionToken)

  const onFileChange = (event) => {
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0]);
  }

  const generateToken = () => {
    setProtectionToken(uuidv4())
  }

  const createEndpoint = async () => {
    console.log("DO STUFF!");

    let params = {}

    if (usingProtectionToken) {
      params = {...params, protectionToken}
    }

    const {ok, response} = await create_action(user, {
      filename: selectedFile.name,
      owner: user.username,
      params
    });

    console.log(ok, response)

    if (ok) {
      const formData = new FormData();
      formData.append(
        "wasmFile",
        selectedFile,
        selectedFile.name
      );

      console.log('Begin upload...');

      await fetch('http://127.0.0.1:3001/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      console.log('Uploaded!');

      setEndpoints(response);
    } else {
      setError(response.error)
    }

    closeForm();
  }

  const deleteEndpoint = async () => {
    const endpoints = await delete_action(user, endpoint);

    setEndpoints(endpoints);
  }

  return (
    <div>
      {/* <h2>{endpoint.filename}</h2> */}

        <div>
          <p>Endpoint URL: <a href="http://127.0.0.1/wasm/example-endpoint">http://127.0.0.1/wasm/example-endpoint</a></p>

          <div class="capability-options">
            <label for="wasm-module">Update WASM:</label>
            <input type="file" id="wasmFile" name="wasmFile" onChange={onFileChange}></input> 
          </div>

          <div>
            <h3>Endpoint security</h3>

            <div class="capability-options">
              <label>Token protection</label>
              <input type="checkbox" checked={usingProtectionToken} onClick={(e) => setUsingProtectionToken(e.target.value)}></input>
            </div>

            <div class="capability-options">
              <label>Token</label>
              <input type="text" value={protectionToken} onChange={(e) => setProtectionToken(e.target.value)}></input>
              <button onClick={generateToken}>Generate</button>
            </div>
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
            <button onClick={closeForm} style={{backgroundColor: "red"}}>Cancel</button>
            <button onClick={createEndpoint} style={{backgroundColor: "green"}}>Create</button>
          </div>
        </div>
    </div>
  )
}

export default WasmEndpoint;
