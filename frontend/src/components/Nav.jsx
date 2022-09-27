
import {
    Link
} from 'react-router-dom'

const Nav = (props) => {
    return (
        <nav class="topnav">
          <ul>
            <Link to="/">Home</Link>

            <Link to="/login" style={{"float": "right"}}>
              { props.user ? props.user.username : "Login"}
            </Link>
          </ul>
        </nav>
    )
}

export default Nav;
