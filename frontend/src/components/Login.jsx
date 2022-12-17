
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { register_user, login_user, save_user } from '../services/user'

const Login = ({ setUser, setNotification, setError }) => {
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

  const handleClickRegister = async (event) => {
    event.preventDefault()

    console.log(username)
    console.log(password)

    const [ok, res] = await register_user(username, password)

    if (ok) {
      setNotification("User registered!")

      setUsername("")
      setPassword("")
    } else {
      setError("Couldn't register user")
      console.log(res)
    }
  }

  const handleClickLogin = (event) => {
    event.preventDefault()

    console.log(username)
    console.log(password)

    login_user(username, password).then(res => {
      if (res.error) {
        setError(res.error)
        return
      }

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
    <div className="login-form">
      <form>
        <div className="login-container">
          <label for="username-input">Username:</label>
          <input id="username-input" value={username} type="text" onChange={handleUsernameChange}/>
        </div>
        <div className="login-container">
          <label for="password-input">Password:</label>
          <input id="password-input" value={password} type="password" onChange={handlePasswordChange}/>
        </div>
        <div className="login-buttons">
          <button onClick={handleClickRegister}>Register</button>
          <button onClick={handleClickLogin}>Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login;
