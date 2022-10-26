
import { useState } from 'react';

import { create_action } from '../services/actions';

import WasmEndpoint from './WasmEndpoint'

const CreateEndpointForm = (props) => {
    const {
        closeForm,
        user,
        setEndpoints
    } = props;

    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (event) => {
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0]);
    }

    const createEndpoint = async () => {
        const formData = new FormData();
        formData.append(
            "wasmFile",
            selectedFile,
            selectedFile.name
        );

        console.log('Begin upload...');

        await fetch('http:127.0.0.1:3001/upload', {
            method: 'POST',
            body: formData
        });

        console.log("DO STUFF!");

        const newEndpoints = await create_action(user, {
            filename: selectedFile.name,
            owner: user.username,
            params: {}
        });

        console.log('Uploaded!');

        setEndpoints(newEndpoints);

        closeForm();
    }

    return (
        <div class="create-endpoint-background">
          <div class="create-endpoint-form">
            <div>
              <p>Endpoint URL: <a href="http://127.0.0.1/wasm/example-endpoint">http://127.0.0.1/wasm/example-endpoint</a></p>

              <div class="capability-options">
                <label for="wasm-module">WASM file:</label>
                <input type="file" id="wasmFile" name="wasmFile" onChange={onFileChange}></input> 
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
        </div>
    )
}

export default CreateEndpointForm;
