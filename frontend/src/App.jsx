import './App.css';

import {
  useState,
  useEffect,
  useRef
} from 'react'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Nav from './components/Nav'
import Home from './components/Home'
import Login from './components/Login'
import Error from './components/Error'
import Notification from './components/Notification'

import { get_user, check_valid } from './services/user'

function App() {
  const [user, setUser] = useState(false)

  const [error, setError] = useState(null)

  const errorTimeoutTimer = useRef(null)

  const [notification, setNotification] = useState(null)

  const notificationTimeoutTimer = useRef(null)

  const showNotification = (notification) => {
    setNotification(notification)

    if (notificationTimeoutTimer.current) {
      clearTimeout(notificationTimeoutTimer.current)
    }

    notificationTimeoutTimer.current = setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const showError = (error) => {
    setError(error)

    if (errorTimeoutTimer.current) {
      clearTimeout(errorTimeoutTimer.current)
    }

    errorTimeoutTimer.current = setTimeout(() => {
      setError(null)
    }, 5000)
  }

  useEffect(() => {
    const setIfValid = async () => {
      const user = get_user()

      if (user) {
        const valid = await check_valid(user)

        if (valid) {
          setUser(user)
        }
      }
    }

    setIfValid()
  }, [])

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <div style={{position: "fixed", width: "100%"}}>
            <Nav user={user} setUser={setUser}/>
            <Error error={error} setError={setError}/>
            <Notification notification={notification} setNotification={setNotification}/>
          </div>
          <div style={{marginTop: "5%"}}>
            <Routes>
              <Route path="/login" element={<Login setUser={setUser} showNotification={showNotification} showError={showError}/>} />
              <Route path="/" element={<Home user={user} showError={showError} showNotification={showNotification}/>} />
            </Routes>
          </div>
        </header>
      </Router>

    </div>
  );
}

export default App;
