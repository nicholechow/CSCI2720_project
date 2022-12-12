// import React, {
//   useState
// } from 'react';
// Login
// TODO:: Re-style, Submit
import React, { useEffect } from "react";
import { Link } from "react-router-dom";


/*

// Reference: https://supertokens.com/blog/building-a-login-screen-with-react-and-bootstrap
export default function Login(){
//export class Login extends React.Component {
 //  constructor(props) {
  //   super(props);
  //    const { params } = useParams();
  //   this.state = {mode: this.props.match.params.mode};
 //  }
  // const [mode, setMode] = useState(props.mode);

  // render() {
//}
    const handleSubmit = (e) =>{
      e.preventDefault();
      var {username, password} = document.forms[0];
      if (username.value==="admin"&&password.value==="admin"){
        A=1;
      }else{
        alert("You are not an admin");
      }
    }

    if (A==1){return <Home loggedIn={true} isAdmin={true}/>}

    return (
      <form className="form" onSubmit={handleSubmit}>
        <div className='p-4 col-6 m-auto border border-4 border-primary rounded-3'>

        
          <h3>Sign In</h3>

     
          <div className="p-2 form-group mt-3">
            <label htmlFor="username">Username:</label>
            <input id="username" name="username" type="text" className="form-control mt-1" placeholder="Enter username here" minlength="4" maxlength="20"/>
          </div>



     
          <div className="p-2 form-group mt-3">
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" className="form-control mt-1" placeholder="Enter password here" minlength="4" maxlength="20"/>
          </div>

          // Submit button, TODO:: Submit this to server *
          <div className="p-2 d-grid gap-2 mt-3">
            <button type="submit" onClick="myFunc();" className="btn btn-primary">
              // {mode ? "Sign In" : "Sign Up"} 
              Sign In
            </button>
          </div>
          
     
        </div>

       
      </form>
    );
  // }
}
*/

export default function Login(props) {

  useEffect(() => {
    document.title = 'Login';
  }, []);
  
  return (
    <div>
      <form className="form" onSubmit={props.data.handleSubmit}>
        <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
          <h3>Sign In</h3>

          <div className="p-2 form-group mt-3">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              onChange={props.data.handleChange}
              className="form-control mt-1"
              placeholder="Enter username here"
              minLength="4"
              maxLength="20"
              required
            />
          </div>

          <div className="p-2 form-group mt-3">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={props.data.handleChange}
              className="form-control mt-1"
              placeholder="Enter password here"
              minLength="4"
              maxLength="20"
              required
            />
          </div>

          <div className="p-2 d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Sign in
            </button>               
          </div>
          <p id="123"></p>
        </div>
      </form>
      <Link to={props.data.displaylink}>
          <button id="autoclick" className="btn btn-transparent">
            {props.data.displaytext}
          </button>
      </Link>
        
    </div>
  );
}
// Login;
