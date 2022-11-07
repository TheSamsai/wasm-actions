import './App.css';

import {
  useState,
  useEffect
} from 'react'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Nav from './components/Nav'
import Home from './components/Home'
import Login from './components/Login'
import Error from './components/Error'

import { get_user, check_valid } from './services/user'

function App() {
  const [user, setUser] = useState(false)

  const [error, setError] = useState("Ink ran out")

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
        <Nav user={user} setUser={setUser}/>
        <header className="App-header">
          <Error error={error} setError={setError}/>
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/" element={<Home user={user} setError={setError}/>} />
          </Routes>
        </header>
      </Router>

    </div>
  );
}

export default App;
