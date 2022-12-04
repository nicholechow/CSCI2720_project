import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import vars from "./Vars";
import Home from "./Home";
import Login from "./Login";

// App
function App() {
  return (
  <>
    <BrowserRouter>
      <div className="nav justify-content-between bg-warning sticky-top">
        <div><Link to="/"><button className='btn btn-transparent'>CSCI2720 Group 19's Project</button></Link></div>
        {vars.username ? '<div><Link to="/debug"><button className="btn btn-transparent">' + vars.username + '</button></Link></div>' : ""}
        <div>
          {vars.loggedIn ? 
            <Link to="/logout"><button className="btn btn-transparent">Log Out</button></Link>:
            <Link to="/debug"><button className="btn btn-transparent">Debug Login</button></Link>}
        </div>
      </div>

      <hr className="m-0 mb-3"/>

      <Routes>
        {/* <Route path="/login/signup" element={<Login mode={signup}/>} /> */}
        <Route path="/login/signin" element={<Login />} />
        <Route path="*" element={<Home />} />
        <Route path="/debug" element={<Home loggedIn={true}/>} />
      </Routes>
    </BrowserRouter>
  </>
  );
}
// App;

export default App;
