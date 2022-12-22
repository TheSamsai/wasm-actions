
import {
    Link
} from 'react-router-dom'

import {
  delete_user
} from '../services/user'

const Nav = (props) => {

  const { user, setUser } = props

  const logout = () => {
    delete_user()
    setUser(false);
  }

  return (
    <nav className="topnav">
      <Link to="/">Home</Link>

      <div style={{marginLeft: "auto"}}>
        { user ?
          <Link to="/" >
            {user.username}
          </Link>
          : 
          <Link to="/login" >
            Login
          </Link>
        }

        <div style={{float: "right"}}>
          { user ? (<div><button onClick={logout}>Logout</button></div>) : (<div></div>)}
        </div>
      </div>
    </nav>
  )
}

export default Nav;
