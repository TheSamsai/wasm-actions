
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { create_action, modify_action, delete_action } from '../services/actions';

import { BACKEND_URL } from '../services/config'


const WasmEndpoint = (props) => {
  const { user, endpoint, setEndpoints, virtualFilesystems, setError, setNotification, closeForm } = props;
  
  const [selectedFile, setSelectedFile] = useState(null);

  console.log(endpoint)

  console.log(user)

  const [usingProtectionToken, setUsingProtectionToken] = useState(endpoint ? endpoint.params.hasOwnProperty("protectionToken") : false)
  const [protectionToken, setProtectionToken] = useState(endpoint ? (endpoint.params.protectionToken ? endpoint.params.protectionToken : "") : "")

  const [usingFilesystem, setUsingFilesystem] = useState(endpoint ? endpoint.params.hasOwnProperty("fs_name") : false)
  const [filesystemName, setFilesystemName] = useState(endpoint ? (endpoint.params.fs_name ? endpoint.params.fs_name : "") : "")

  const onFileChange = (event) => {
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0]);
  }

  const generateToken = () => {
    setProtectionToken(uuidv4())
  }

  const applyChange = async () => {
    let params = {}

    if (usingProtectionToken) {
      params = {...params, protectionToken}
    }

    if (usingFilesystem) {
      params = {...params, fs_name: filesystemName}
    }

    if (!endpoint && !selectedFile) {
      setError("Action must contain a valid WASM payload!")
      return
    }

    let canProceed = false
    let jsonResponse = null

    if (endpoint) {
      const {ok, response} = await modify_action(user, endpoint, {
        filename: selectedFile ? selectedFile.name : endpoint ? endpoint.filename : "unreachable",
        owner: user.username,
        params
      });

      console.log(ok, response)

      canProceed = ok
      jsonResponse = response
    } else {
      const {ok, response} = await create_action(user, {
        filename: selectedFile ? selectedFile.name : endpoint ? endpoint.filename : "unreachable",
        owner: user.username,
        params
      });

      console.log(ok, response)

      canProceed = ok
      jsonResponse = response
    }

    if (canProceed) {
      if (selectedFile) {
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
      }

      setEndpoints(jsonResponse)
    } else {
      setError(jsonResponse.error)
    }

    closeForm();
  }

  const deleteEndpoint = async () => {
    const endpoints = await delete_action(user, endpoint);

    setNotification("Endpoint deleted!")

    setEndpoints(endpoints);
  }

  const endpointUrl = endpoint ? encodeURI(`${BACKEND_URL}/wasm/${user.username}/${endpoint.filename}`) : ''

  return (
    <div style={{ width: "100%"}}>
      <h2>{endpoint ? endpoint.filename : "Create a new endpoint"}</h2>

        <div>
          { endpoint ?
            <p>Endpoint URL: <a href={endpointUrl}>{endpointUrl}</a></p>
            : <div></div>
          }

          <div className="capability-options">
            <label for="wasmFile">WASM file:</label>
            <input type="file" id="wasmFile" name="wasmFile" onChange={onFileChange}></input> 
          </div>

          <div>
            <h3>Endpoint security</h3>

            <div className="capability-options">
              <label>Token protection</label>
              <input type="checkbox" checked={usingProtectionToken} onChange={(e) => setUsingProtectionToken(!usingProtectionToken)}></input>
            </div>

            <div className="capability-options">
              <label>Token</label>
              <div style={{ gap: "10px"}}>
                <input type="text" value={protectionToken} onChange={(e) => setProtectionToken(e.target.value)}></input>
                <button onClick={generateToken}>Generate</button>
              </div>
            </div>
          </div>

          <div>
            <h3>Capabilities</h3>
            <div className="capability-options">
              <label>Filesystem access</label>
              <input type="checkbox" checked={usingFilesystem} onChange={(e) => setUsingFilesystem(!usingFilesystem)}></input>
            </div>

            <div className="capability-options">
              <label>Virtual filesystem</label>
              {/* <input type="text" value={filesystemPrefix} onChange={(e) => setFilesystemPrefix(e.target.value)}></input> */}
              <select onChange={(e) => setFilesystemName(e.target.value)} value={filesystemName}>
                <option value="None">None</option>
                { virtualFilesystems.map(fs => (
                  <option key={fs._id} value={fs.name}>{fs.name}</option>
                ))}
              </select>
            </div>

          </div>

          { endpoint && endpoint.logs ?
            <div>
              <h3>Error Logs</h3>

              <ul style={{ backgroundColor: "black", listStyleType: "none", marginRight: "25%"}}>
                { endpoint.logs.filter(log => log.message.stderr !== "").map(log => {
                  return <li key={log._id}>{log.message.stderr}</li>
                })}
              </ul>
            </div>
            : <div></div>}

          <div className="endpoint-management-buttons">
            <button onClick={endpoint ? deleteEndpoint : closeForm} style={{backgroundColor: "red", color: "white"}}>{ endpoint ? "Delete" : "Cancel"}</button>
            <button onClick={applyChange} style={{backgroundColor: "green", color: "white"}}>{ endpoint ? "Apply" : "Create"}</button>
          </div>
        </div>
    </div>
  )
}

export default WasmEndpoint;
