// import React, {
//   useState
// } from 'react';
// Login
// TODO:: Re-style, Submit
import React from "react";
import Home from "./Home";

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

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      adminflag:
        this.props.adminflag === undefined ? false : this.props.adminflag,
      loginflag:
        this.props.loginflag === undefined ? false : this.props.loginflag,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.username === "admin") {
      if (this.state.password === "admin") {
        this.setState({ adminflag: true, loginflag: true });
      }
    } else if (this.state.username === "user") {
      if (this.state.password === "user") {
        this.setState({ adminflag: false, loginflag: true });
      }
    } else {
      document.getElementById("123").innerText =
        "Please input a correct username and password";
      document.getElementById("123").classList.add("text-danger");
    }
  }
  render() {
    return (
      <div>
        {!this.state.loginflag ? (
          <form className="form" method="POST">
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Sign In{this.state.flag}</h3>

              <div className="p-2 form-group mt-3">
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={this.state.a}
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  placeholder="Enter username here"
                  minLength="4"
                  maxLength="20"
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="password">Password:</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={this.state.b}
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  placeholder="Enter password here"
                  minLength="4"
                  maxLength="20"
                />
              </div>

              <div className="p-2 d-grid gap-2 mt-3">
                <button onClick={this.handleSubmit} className="btn btn-primary">
                  Sign In
                </button>
              </div>
              <p id="123"></p>
            </div>
          </form>
        ) : (
          <Home
            loggedIn={this.state.loginflag}
            isAdmin={this.state.adminflag}
          />
        )}
      </div>
    );
  }
}
// Login;
