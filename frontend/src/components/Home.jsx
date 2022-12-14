

import { useState, useEffect } from 'react';

import { get_actions, get_logs } from '../services/actions';

import Landing from './Landing'

import WasmEndpoint from './WasmEndpoint';
import CreateEndpointForm from './CreateEndpointForm';

import VirtualFS from './VirtualFS'
import CreateVirtualFS from './CreateVirtualFS';
import { get_virtual_filesystems } from '../services/virtual-fs';

const Home = (props) => {
  const { user, showError, showNotification } = props;

  const [endpoints, setEndpoints] = useState([]);

  const [shouldUpdateLogs, setShouldUpdateLogs] = useState(false)

  const [virtualFilesystems, setVirtualFilesystems] = useState([])

  const [createForm, setCreateForm] = useState(null);

  const handleClickCreate = () => {
    setCreateForm(<CreateEndpointForm user={user} closeForm={closeCreateForm} virtualFilesystems={virtualFilesystems} setEndpoints={setEndpoints} showError={showError}/>);
  }

  const closeCreateForm = () => {
    console.log("closed");
    setCreateForm(null);
  }

  useEffect(() => {
    const fetchEndpoints = async () => {
      const newEndpoints = await get_actions(user);

      if (newEndpoints) {
        setEndpoints(newEndpoints);
        setShouldUpdateLogs(true)
      }
    }

    const fetchVirtualFilesystems = async () => {
      const newVirtualFilesystems = await get_virtual_filesystems(user);

      console.log(newVirtualFilesystems);

      if (newVirtualFilesystems) {
        setVirtualFilesystems(newVirtualFilesystems);
      }
    }

    const fetchUserData = async () => {
      await fetchEndpoints()
      await fetchVirtualFilesystems()
    }

    if (user) {
      fetchUserData()
    }

    console.log("User fetched")
  }, [user])

  useEffect(() => {
    const fetchLogs = async () => {
      const modifiedEndpoints = await Promise.all(endpoints.map(async endpoint => {
        const [ok, res] = await get_logs(user, endpoint)

        console.log(res)

        if (ok) {
          return {...endpoint, logs: res}
        } else {
          return {...endpoint, logs: [] }
        }
      }))

      setEndpoints(modifiedEndpoints)
    }
    
    // Since we know this effect with trigger itself, we do this to avoid a loop
    if (shouldUpdateLogs) {
      fetchLogs()
      setShouldUpdateLogs(false)
    } else {
      // On next execution we can clear the sentinel
      setShouldUpdateLogs(true)
    }
    
    console.log("logs fetched")

  }, [endpoints])

  if (!user) {
    return (
      <Landing />
    )
  }

  console.log(user.username);

  console.log(virtualFilesystems)

  return (
    <div className="App-content">
      <h1>WASM Actions</h1>

      <p>Welcome, {user.username}!</p>

      <h2>Virtual filesystems</h2>

      <CreateVirtualFS user={user} setVirtualFilesystems={setVirtualFilesystems} showNotification={showNotification}/>

      <ul>
        { virtualFilesystems.map(fs => (
          <li key={fs._id}>
            <VirtualFS user={user} virtualFilesystem={fs} setVirtualFilesystems={setVirtualFilesystems} showNotification={showNotification}/>
          </li>
        ))}
      </ul>

      <h2>WASM Endpoints</h2>

      <button onClick={handleClickCreate}>Create a new endpoint</button>

      {createForm}

      <ul>
        { endpoints.map(e => {
          return (
            <li key={e._id}><WasmEndpoint endpoint={e} user={user} setEndpoints={setEndpoints} virtualFilesystems={virtualFilesystems} showError={showError} showNotification={showNotification} closeForm={() => 0}/></li>
          )
        })}
      </ul>
    </div> 
  )
}

export default Home;
