

import { useState, useEffect } from 'react';

import { get_actions } from '../services/actions';

import WasmEndpoint from './WasmEndpoint';
import CreateEndpointForm from './CreateEndpointForm';

const Home = (props) => {
    const { user } = props;

    const text = "Hello, wasmverse!";

    const [endpoints, setEndpoints] = useState([]);

    const [createForm, setCreateForm] = useState(null);

    const handleClickCreate = () => {
        setCreateForm(<CreateEndpointForm user={user} closeForm={closeCreateForm}/>);
    }

    const closeCreateForm = () => {
        console.log("closed");
        setCreateForm(null);
    }

    useEffect(() => {
        const fetchEndpoints = async () => {
            const newEndpoints = await get_actions(user);

            console.log(newEndpoints);

            setEndpoints(newEndpoints);
        }

        if (user) {
            fetchEndpoints();
        }
    }, [])

    if (!user) {
        return (
            <div>
              <h1>Please login first</h1>
            </div>
        )
    }

    console.log(user.username);

    return (
        <div>
          <h1>WASM Actions</h1>

          <p>Welcome, {user.username}!</p>

          <h2>WASM Endpoints</h2>

          <button onClick={handleClickCreate}>Create a new endpoint</button>

          {createForm}

          <ul>
            { endpoints.map(e => {
                return (
                    <li><WasmEndpoint endpoint={e}/></li>
                )
            })}
          </ul>
        </div> 
    )
}

export default Home;
