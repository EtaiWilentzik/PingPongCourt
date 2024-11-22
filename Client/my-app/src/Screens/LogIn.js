import "./LogIn.css";
import { useContext, useState } from "react";
import { AuthContext } from "../App/AuthContext";
import { useNavigate } from "react-router-dom";
const F = () => {
  console.log(window.innerWidth); // Logs the current width of the browser window
  console.log("the height is " + window.innerHeight);
};
const LogIn = () => {
  const { setToken } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.data.token);
        navigate("/");
      } else {
        setError(data.message || "Failed to log in.");
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    }
  };

  return (
    <>
      <div className="d-flex align-items-center flex-column change">
        <h2 className="display-4 mb-5">Log in</h2>
        <div className="input-group mb-5">
          <span className="input-group-text">
            <i className="bi bi-person"></i>
          </span>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>
        </div>

        <div className="input-group mb-5">
          <span className="input-group-text">
            {" "}
            <i className="bi bi-lock-fill"></i>
          </span>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button onClick={handleLogin} className="mb-5 btn btn-primary">
          Log in
        </button>
      </div>
    </>
  );
};
const Log = () => {
  return (
    <>
      <F />
      <div className="container">
        <div className="row  justify-content-center row-equal-height">
          <div className=" col-md-4  neon-div-2  " id="left">
            <LogIn />
          </div>
          <div className="col-md-7" id="right">
            <img
              src="/picture2.jpg"
              alt="ping pong paddles"
              className="img-fluid full-img "
            />
          </div>
        </div>
      </div>
    </>
  );
};
export { Log };
