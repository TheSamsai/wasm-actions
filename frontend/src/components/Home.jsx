
import logo from '../logo.svg';

import { useState } from 'react'

import WasmEndpoint from './WasmEndpoint'

import CreateEndpointForm from './CreateEndpointForm'

const Home = () => {
    const text = "Hello, wasmverse!";

    const endpoints = [1,1,1,1,1];

    const [createForm, setCreateForm] = useState(null)

    const handleClickCreate = () => {
        setCreateForm(<CreateEndpointForm closeForm={closeCreateForm}/>)
    }

    const closeCreateForm = () => {
        console.log("closed");
        setCreateForm(null);
    }

    return (
        <div>
          <h1>WASM Endpoints</h1>

          <button onClick={handleClickCreate}>Create a new endpoint</button>

          {createForm}

          <ul>
            { endpoints.map(e => {
                return (
                    <li><WasmEndpoint/></li>
                )
            })}
          </ul>
        </div> 
    )
}

export default Home;
