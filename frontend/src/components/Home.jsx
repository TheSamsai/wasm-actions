

import { useState, useEffect } from 'react';

import { get_actions } from '../services/actions';

import WasmEndpoint from './WasmEndpoint';
import CreateEndpointForm from './CreateEndpointForm';

const Home = (props) => {
  const { user, setError } = props;

  const text = "Hello, wasmverse!";

  const [endpoints, setEndpoints] = useState([]);

  const [createForm, setCreateForm] = useState(null);

  const handleClickCreate = () => {
    setCreateForm(<CreateEndpointForm user={user} closeForm={closeCreateForm} setEndpoints={setEndpoints} setError={setError}/>);
  }

  const closeCreateForm = () => {
    console.log("closed");
    setCreateForm(null);
  }

  useEffect(() => {
    const fetchEndpoints = async () => {
      const newEndpoints = await get_actions(user);

      console.log(newEndpoints);

      if (newEndpoints) {
        
        setEndpoints(newEndpoints);
      }
    }

    if (user) {
      fetchEndpoints();
    }
  }, [user])

  if (!user) {
    return (
      <div>
        <h1>Please login first</h1>
      </div>
    )
  }

  console.log(user.username);

  return (
    <div className="App-content">
      <h1>WASM Actions</h1>

      <p>Welcome, {user.username}!</p>

      <h2>WASM Endpoints</h2>

      <button onClick={handleClickCreate}>Create a new endpoint</button>

      {createForm}

      <ul>
        { endpoints.map(e => {
          return (
            <li><WasmEndpoint endpoint={e} user={user} setEndpoints={setEndpoints}/></li>
          )
        })}
      </ul>
    </div> 
  )
}

export default Home;
