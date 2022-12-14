
import { useState } from 'react'

import { create_virtual_filesystem } from '../services/virtual-fs'

const CreateVirtualFS = ({ user, setVirtualFilesystems, showNotification, showError }) => {
  const [name, setName] = useState('')

  const create = async () => {
    const {ok, response} = await create_virtual_filesystem(user, { name })

    if (ok) {
      setVirtualFilesystems(response)
      showNotification("Created a Virtual Filesystem")
    } else {
      showError(response.error)
    }
  }

  return <div>
           <div style={{ display: "flex", gap: "20px" }}>
              <label for="fs-name">Name</label>
              <input id="fs-name" size="50" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
            </div>


          <div className="endpoint-management-buttons">
            <button onClick={create} style={{backgroundColor: "green", color: "white"}}>{ "Create"}</button>
          </div>
         </div>
}

export default CreateVirtualFS
