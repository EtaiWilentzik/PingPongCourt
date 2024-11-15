import  "./Register.css"
import {Nav} from "./NavBar";

const Register = () => {
    return (
        <>
            <div className="d-flex align-items-center   flex-column change aaaa ">
                <h2 className="display-4 mb-5  " id="register">Register</h2>

                <div className="center-content ">
                    <div className="input-group mb-5 ">
                        <span className="input-group-text"><i className="bi bi-person"></i></span>
                        <div className="form-floating w-75">
                            <input type="text" className="form-control" id="floatingInputGroup1"
                                   placeholder="Username"/>
                            <label htmlFor="floatingInputGroup1">Username</label>
                        </div>
                    </div>
                </div>


                <div className=" input-group mb-5 w-75  ">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <div className="form-floating w-75 ">
                        <input type="text" className="form-control" id="floatingInputGroup1" placeholder="Email"/>
                        <label htmlFor="floatingInputGroup1">Email</label>
                    </div>
                </div>

                <div className="input-group mb-5 w-75 " id="feild">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <div className="form-floating w-75">
                        <input type="password" className="form-control" id="floatingInputGroup3"
                               placeholder="Password"/>
                        <label htmlFor="floatingInputGroup1">Password</label>
                    </div>
                </div>


                <button type="submit" className="btn btn-danger mb-5">Register</button>

            </div>
        </>
    );
}

const Reg = () => {
    return (
        <>

            <div className="container">
                <div className="row justify-content-center row-equal-height">
                    <div className=" col-12  col-md-4   neon-div order-2 order-md-1" id="left">
                        <Register/>
                    </div>
                    <div className=" col-12 col-md-8 order-1 order-md-2" id="right" >
                    <img
                        src="/picture1.jpg"
                        alt="ping pong paddles"
                        className="img-fluid full-img "
                    />
                </div>
            </div>
        </div>
        </>


    );
};

export {Register, Reg}