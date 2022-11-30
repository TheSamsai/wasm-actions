
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { create_action, delete_action } from '../services/actions';

import { BACKEND_URL } from '../services/config'


const WasmEndpoint = (props) => {
  const { user, endpoint, setEndpoints, setError, closeForm } = props;
  
  const [selectedFile, setSelectedFile] = useState(null);

  console.log(endpoint)

  console.log(user)

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

  const applyChange = async () => {
    if (endpoint) {
      await delete_action(user, endpoint);
    }

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

      await fetch(`${BACKEND_URL}/upload`, {
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

  const endpointUrl = endpoint ? encodeURI(`${BACKEND_URL}/wasm/${user.username}/${endpoint.filename}`) : ''

  return (
    <div>
      <h2>{endpoint ? endpoint.filename : "Create a new endpoint"}</h2>

        <div>
          { endpoint ?
            <p>Endpoint URL: <a href={endpointUrl}>{endpointUrl}</a></p>
            : <div></div>
          }

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
              <div style={{ gap: "10px"}}>
                <input type="text" value={protectionToken} onChange={(e) => setProtectionToken(e.target.value)}></input>
                <button onClick={generateToken}>Generate</button>
              </div>
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

          { endpoint && endpoint.logs ?
            <div>
              <h3>Error Logs</h3>

              <ul style={{ backgroundColor: "black", listStyleType: "none", marginRight: "25%"}}>
                { endpoint.logs.filter(log => log.message.stderr !== "").map(log => {
                  return <li>{log.message.stderr}</li>
                })}
              </ul>
            </div>
            : <div></div>}

          <div class="endpoint-management-buttons">
            <button onClick={endpoint ? deleteEndpoint : closeForm} style={{backgroundColor: "red", color: "white"}}>{ endpoint ? "Delete" : "Cancel"}</button>
            <button onClick={applyChange} style={{backgroundColor: "green", color: "white"}}>{ endpoint ? "Apply" : "Create"}</button>
          </div>
        </div>
    </div>
  )
}

export default WasmEndpoint;
