import  "./LogIn.css"
import {Nav} from "./NavBar";

const LogIn=()=>{
    return (

  <>
      {/*the d flex put it in the center the input group make sure everything is on the same height inside the line*/}
      <div className="d-flex align-items-center flex-column change ">
          <h2 className="display-4 mb-5">Log in</h2>
          {/* input group make sure everything is on the same height inside the line w-25 makes it 25 width of the view window*/}
          <div className="input-group mb-5  ">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <div className="form-floating">
                  <input type="text" className="form-control" id="floatingInputGroup1" placeholder="Username"/>
                  <label htmlFor="floatingInputGroup1">Username</label>
              </div>
          </div>

          <div className="input-group mb-5 ">
              <span className="input-group-text"> <i className="bi bi-lock-fill"></i></span>
              <div className="form-floating">
                  <input type="password" className="form-control" id="floatingInputGroup1" placeholder="Password"/>
                  <label htmlFor="floatingInputGroup1">Password</label>
              </div>
          </div>
          <p><a href="#" className="text-secondary">Does not have account Register here</a></p>

          <div className="a">
              <button type="submit" className=" mb-5 btn btn-primary">Log in</button>
          </div>


      </div>
  </>

    )

}
const F=()=>{
    console.log(window.innerWidth);  // Logs the current width of the browser window
console.log("the height is "+window.innerHeight);


}

const Log = () => {
    return (
        <>
            <F/>
            <div className="container">

                <div className="row  justify-content-center row-equal-height">
                    <div className=" col-md-4  neon-div-2  " id="left">
                        <LogIn/>
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




const GPT = () => {
    return (
        <div className="neon-div">
            Your content here
        </div>

    )
}


export {LogIn, Log, GPT}