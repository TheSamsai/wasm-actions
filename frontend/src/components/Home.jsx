
import logo from '../logo.svg';

const Home = () => {
    const text = "Hello, wasmverse!";

    return (
        <div>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {text}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </div> 
    )
}

export default Home;
