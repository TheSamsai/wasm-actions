
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { create_action } from '../services/actions'
import WasmEndpoint from './WasmEndpoint';

const CreateEndpointForm = (props) => {
  const {
    closeForm,
    user,
    setEndpoints,
    setError
  } = props;

  console.log(user)

  return (
    <div class="create-endpoint-background">
      <div class="create-endpoint-form">
        <WasmEndpoint user={user} setEndpoints={setEndpoints} setError={setError} closeForm={closeForm}/>
      </div>
    </div>
  )
}

export default CreateEndpointForm;
