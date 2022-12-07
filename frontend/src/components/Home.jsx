

import { useState, useEffect } from 'react';

import { get_actions, get_logs } from '../services/actions';

import WasmEndpoint from './WasmEndpoint';
import CreateEndpointForm from './CreateEndpointForm';

const Home = (props) => {
  const { user, setError } = props;

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

      for (let endpoint of newEndpoints) {
        console.log(endpoint)
        endpoint.logs = await get_logs(user, endpoint)
      }

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
      <div style={{ display: "flex", justifyContent: "center"}}>
        <h1>Please login first</h1>
      </div>
    )
  }

  console.log(user.username);

  return (
    <div className="App-content">
      <h1>WASM Actions</h1>

      <p>Welcome, {user.username}!</p>

      <h2>Virtual filesystems</h2>

      <ul>
        <li>
          <h3>Test filesystem</h3>

          <p>Description: Test filesystem used for the file-test.wasm endpoint</p>
        </li>
      </ul>

      <h2>WASM Endpoints</h2>

      <button onClick={handleClickCreate}>Create a new endpoint</button>

      {createForm}

      <ul>
        { endpoints.map(e => {
          return (
            <li><WasmEndpoint endpoint={e} user={user} setEndpoints={setEndpoints} setError={setError} closeForm={() => 0}/></li>
          )
        })}
      </ul>
    </div> 
  )
}

export default Home;
