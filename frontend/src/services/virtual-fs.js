
import { BACKEND_URL } from './config'

const get_virtual_filesystems = async (user) => {
  const res = await fetch(`${BACKEND_URL}/virtual-filesystems`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  })

  return await res.json()
}

const create_virtual_filesystem = async (user, virtual_fs) => {
  const res = await fetch(`${BACKEND_URL}/virtual-filesystems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(virtual_fs)
  });

  return {
    ok: res.ok,
    response: await res.json()
  }
}

const delete_virtual_filesystem = async (user, virtual_fs) => {
  const res = await fetch(`${BACKEND_URL}/virtual-filesystems`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(virtual_fs)
  });

  return {
    ok: res.ok,
    response: await res.json()
  }
}

export {
  get_virtual_filesystems,
  create_virtual_filesystem,
  delete_virtual_filesystem
}
