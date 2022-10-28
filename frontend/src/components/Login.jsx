
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { register_user, login_user, save_user } from '../services/user'

const Login = ({ setUser }) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")

  const [password, setPassword] = useState("")

  const handleUsernameChange = (event) => {
    event.preventDefault()

    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    event.preventDefault()

    setPassword(event.target.value)
  }

  const handleClickRegister = (event) => {
    event.preventDefault()

    console.log(username)
    console.log(password)

    register_user(username, password).then(res => console.log(res))
  }

  const handleClickLogin = (event) => {
    event.preventDefault()

    console.log(username)
    console.log(password)

    login_user(username, password).then(res => {
      const user = {
        username: username,
        token: res.token
      }

      setUser(user)

      save_user(user)

      navigate("/")
    })
  }

  return (
    <div class="login-form">
      <form>
        <div class="login-container">
          <label>Username:</label>
          <input type="text" onChange={handleUsernameChange}/>
        </div>
        <div class="login-container">
          <label>Password:</label>
          <input type="password" onChange={handlePasswordChange}/>
        </div>
        <div class="login-buttons">
          <button onClick={handleClickRegister}>Register</button>
          <button onClick={handleClickLogin}>Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login;
