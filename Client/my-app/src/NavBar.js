import './NavBar.css';
import  {Link} from "react-router-dom";

const NavBar = () => {

    return (
        <>
            <div id="menu">
                <div id="menu-items">
                    <div className="menu-item">Log In</div>
                    <div className="menu-item">Register</div>
                    <div className="menu-item">About</div>
                </div>
            </div>
        </>
    );
}

// im using the color of the menu as the ping pong racket one is red one is blue
const Nav = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light " id="navbar">
                <div className="container-fluid" id="nav">


                    <Link to="/" className="navbar-brand d-flex align-items-center">

                        <img
                            src={"logo.jpg"}
                            alt="Logo"
                            style={{height: '3rem'}}
                        />
                        Log in </Link>
                    {/*<a className="navbar-brand d-flex align-items-center" href="#">*/}

                    {/*</a>*/}

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">

                        <span className="navbar-toggler-icon bg-danger"></span>
                    </button>




                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                {/*<a className="nav-link active" aria-current="page" href="#">Home</a>*/}
                                <Link to="/about" className="nav-link active">About </Link>
                            </li>
                            <li className="nav-item">
                                {/*<a className="nav-link active" href="#">Features</a>*/}
                                <Link to="/login" className="nav-link active">Log In </Link>
                            </li>
                            <li className="nav-item">
                                {/*<a className="nav-link active" href="#">Pricing</a>*/}
                                <Link to="/register" className="nav-link active">Register</Link>
                            </li>

                            <li className="nav-item">
                                {/*<a className="nav-link active" href="#">Pricing</a>*/}
                                <Link to="/statistics" className="nav-link active">Statistics</Link>
                            </li>

                            <li className="nav-item">
                                {/*<a className="nav-link active" href="#">Pricing</a>*/}
                                <Link to="/allGames" className="nav-link active">My Games</Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
        ;
};


export {NavBar, Nav}
