
import { BACKEND_URL } from './config'

const register_user = async (username, password) => {
  const res = await fetch(`${BACKEND_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "username": username,
      "password": password
    })
  })

  return await res.json()
}

const login_user = async (username, password) => {
  const res = await fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "username": username,
      "password": password
    })
  })

  return await res.json()
}

const check_valid = async (user) => {
  const res = await fetch(`${BACKEND_URL}/hidden`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  })

  return res.ok
}

const save_user = (user) => {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

const get_user = () => {
  return JSON.parse(localStorage.getItem("loggedInUser"))
}

const delete_user = () => {
  localStorage.removeItem("loggedInUser")
}

export {
  register_user,
  login_user,
  check_valid,
  save_user,
  get_user,
  delete_user
}
