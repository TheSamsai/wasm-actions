
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { create_action } from '../services/actions'
import WasmEndpoint from './WasmEndpoint';

const CreateEndpointForm = (props) => {
  const {
    closeForm,
    user,
    setEndpoints,
    virtualFilesystems,
    setError
  } = props;

  console.log(user)

  return (
    <div class="create-endpoint-background">
      <div class="create-endpoint-form">
        <div style={{ margin: "15px", width: "100%"}}>
          <WasmEndpoint user={user} setEndpoints={setEndpoints} virtualFilesystems={virtualFilesystems} setError={setError} closeForm={closeForm}/>
        </div>
      </div>
    </div>
  )
}

export default CreateEndpointForm;
