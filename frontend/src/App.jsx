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

import { get_user } from './services/user'

function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (get_user()) {
      setUser(get_user())
    }
  }, [])

  return (
    <div className="App">
      <Router>
        <Nav user={user} />
        <header className="App-header">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/" element={<Home user={user}/>} />
          </Routes>
        </header>
      </Router>

    </div>
  );
}

export default App;
