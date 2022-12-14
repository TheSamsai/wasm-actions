
import { delete_virtual_filesystem } from '../services/virtual-fs'

const VirtualFS = ({ virtualFilesystem, setVirtualFilesystems, showNotification, user }) => {

  const deleteFilesystem = async () => {
    console.log("deleting filesystem")

    const {ok, response} = await delete_virtual_filesystem(user, virtualFilesystem)

    if (ok) {
      setVirtualFilesystems(response)
      showNotification("Virtual filesystem deleted!")
    }
  }

  return <div style={{ display: "flex", gap: "50px"}}>
           {virtualFilesystem.name}
           <button onClick={deleteFilesystem} style={{backgroundColor: "red", color: "white"}}>Delete</button>
         </div>
}


export default VirtualFS
