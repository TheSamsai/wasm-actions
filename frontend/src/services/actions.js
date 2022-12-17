
import { BACKEND_URL } from './config'

const get_actions = async (user) => {
  const res = await fetch(`${BACKEND_URL}/actions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  })

  return await res.json()
}

const create_action = async (user, action) => {
  const res = await fetch(`${BACKEND_URL}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(action)
  });

  return {
    ok: res.ok,
    response: await res.json()
  }
}

const modify_action = async (user, action, newAction) => {
  const res = await fetch(`${BACKEND_URL}/actions/${action._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(newAction)
  });

  return {
    ok: res.ok,
    response: await res.json()
  }
}

const delete_action = async (user, action) => {
  const res = await fetch(`${BACKEND_URL}/actions/${action._id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    // body: JSON.stringify(action)
  });

  return await res.json()
}

const get_logs = async (user, action) => {
  console.log(action)

  const res = await fetch(`${BACKEND_URL}/logs/${action._id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
  })

  return [res.ok, await res.json]
}

export {
  get_actions,
  create_action,
  modify_action,
  delete_action,
  get_logs
}
