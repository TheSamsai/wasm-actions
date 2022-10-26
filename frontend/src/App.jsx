import './App.css';

import {
    useState
} from 'react'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Nav from './components/Nav'
import Home from './components/Home'
import Login from './components/Login'

function App() {
    
    const [user, setUser] = useState(false);

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
