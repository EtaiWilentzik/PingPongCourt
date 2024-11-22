import "./CoolStaff.css"
const Shadow = () => {
    return (
        <>
            {  cool1()}
            {cool2()}
        </>



    )
}

const cool1=()=>{
      return (
        <div>
            <h1 className="elegantshadow">Elegant Shadow</h1>
            <h1 className="deepshadow">Deep Shadow</h1>
            <h1 className="insetshadow">Inset Shadow</h1>
            <h1 className="retroshadow">Retro Shadow</h1>
        </div>

    )
}
const cool2=()=>{
      return (
          <>
              <ul>
                  <li>S</li>
                  <li>M</li>
                  <li>O</li>
                  <li>K</li>
                  <li>Y</li>
              </ul>

              <p>Hover on <strong>SMOKY</strong> to see the animation</p>
          </>

      )
}

export default Shadow