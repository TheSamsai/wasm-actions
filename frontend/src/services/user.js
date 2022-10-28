
const BASE_URL = "http://localhost:3001"

const register_user = async (username, password) => {
  const res = await fetch(`${BASE_URL}/register`, {
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
  const res = await fetch(`${BASE_URL}/login`, {
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
  save_user,
  get_user
}
