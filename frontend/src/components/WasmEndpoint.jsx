
import { useState } from 'react'

import { delete_action } from '../services/actions';

const WasmEndpoint = (props) => {
    const { user, endpoint, setEndpoints } = props;
    
    const [shown, setShown] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleToggleShown = () => {
        setShown(!shown);
    }

    const onFileChange = (event) => {
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0]);
    }

    const applyChanges = async () => {
        // const formData = new FormData();
        // formData.append(
        //     "wasmFile",
        //     selectedFile,
        //     selectedFile.name
        // );

        // console.log('Begin upload...');

        // await fetch('http://127.0.0.1:3001/upload', {
        //     method: 'POST',
        //     body: formData
        // });

    //     console.log("DO STUFF!");

    //     await create_action(user, {
    //         filename: "hello-cgi.wasm",
    //         owner: user.username,
    //         params: {}
    //     });

    //     console.log('Uploaded!');
    }

    const deleteEndpoint = async () => {
        const endpoints = await delete_action(user, endpoint);

        setEndpoints(endpoints);
    }

    return (
        <div>
          <h2>{endpoint.filename} <button onClick={handleToggleShown}>Toggle</button></h2>

          { shown ?
            <div>
              <p>Endpoint URL: <a href="http://127.0.0.1/wasm/example-endpoint">http://127.0.0.1/wasm/example-endpoint</a></p>

              <div class="capability-options">
                <label for="wasm-module">Update WASM:</label>
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
                <button onClick={deleteEndpoint} style={{backgroundColor: "red"}}>Delete</button>
                <button onClick={applyChanges} style={{backgroundColor: "green"}}>Apply</button>
              </div>
            </div>
            : <div></div> }
        </div>
    )
}

export default WasmEndpoint;
