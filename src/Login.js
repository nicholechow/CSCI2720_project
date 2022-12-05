// import React, {
//   useState
// } from 'react';
// Login
// TODO:: Re-style, Submit

// Reference: https://supertokens.com/blog/building-a-login-screen-with-react-and-bootstrap
export default function Login(/*props*/){
// class Login extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // const { params } = useParams();
  //   this.state = {mode: this.props.match.params.mode};
  // }
  // const [mode, setMode] = useState(props.mode);

  // render() {

    const handleSubmit = (e) =>{
      e.preventDefault();
      var {username, password} = document.forms[0];
      if (username.value==="admin"&&password.value==="admin"){
        alert("You are an admin"); //testing
      }else{
        alert("You are not an admin")
      }
    }

    return (
      <form className="form" onSubmit={handleSubmit}>{/*method='POST'*/}
        <div className='p-4 col-6 m-auto border border-4 border-primary rounded-3'>

          {/* Title */}
          {/* <h3>{mode ? "Sign In" : "Sign Up"}</h3> */}
          <h3>Sign In</h3>

          {/* Username Text Box */}
          <div className="p-2 form-group mt-3">
            <label htmlFor="username">Username:</label>
            <input id="username" name="username" type="text" className="form-control mt-1" placeholder="Enter username here" minlength="4" maxlength="20"/>
          </div>

          {/* NOT NEEDED */}
          {/* Email Text Box *\/}
          <div className="form-group mt-3">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" className="form-control mt-1" placeholder="Enter email here"/>
          </div> */}

          {/* Password Text Box */}
          <div className="p-2 form-group mt-3">
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" className="form-control mt-1" placeholder="Enter password here" minlength="4" maxlength="20"/>
          </div>

          {/* Submit button, TODO:: Submit this to server */}
          <div className="p-2 d-grid gap-2 mt-3">
            <button type="submit" onClick="myFunc();" className="btn btn-primary">
              {/* {mode ? "Sign In" : "Sign Up"} */}
              Sign In
            </button>
          </div>
          
          {/* NOT NEEDED */}
          {/* Forget Password, not sure if this is needed *\/}
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p> */}
        </div>

        {/* NOT NEEDED */}
        {/* Sign Up/In Reminder */}
        {/* <div className="p-2 text-center">
          {mode ? 'Not registered yet? ' : 'Already registered? '}
          <span className="link-primary" 
            /* changeAuthState(): changes the state, it only get called here, hence simplified into inline function *./
            onClick={() => setMode(!mode)}>
          {mode ? "Sign Up" : "Sign In"}
          </span>
        </div> */}
      </form>
    );
  // }
}

// Login;