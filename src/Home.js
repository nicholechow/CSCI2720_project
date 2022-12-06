import React, { useRef, useEffect, useState } from 'react';
import {
  Link
} from 'react-router-dom';
import vars from "./Vars";
import {A} from "./Login";

// Reference: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiMTE1NTE3MDk1MiIsImEiOiJjbGI5OXI3eDgwc21vM3BxYzd1MTNrMXA0In0.0HxBmgExZx-Y_BfWj_tF8Q';

// Home
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn === undefined ? false : true,
      isAdmin: this.props.isAdmin === undefined ? false : this.props.isAdmin
    };

    // Debug Account
    vars.username = (vars.loggedIn === this.props.loggedIn) ? "Debugger" : "";
     console.log(A);
    console.log(vars.loggedIn);
  }
  render() {
    
    if (!this.state.loggedIn)
      return (
        <div className='p-4 col-6 m-auto border border-4 border-primary rounded-3'>

          {/* Title */}
          <h3 className='p-3'>Welcome to Group 19's Project</h3>
          {/* <Link to="/login/signup" className="text-decoration-none p-3"><button className='btn p-auto m-auto'>Sign Up</button></Link> */}
          <Link to="/login/signin" className="text-decoration-none p-3"><button className='btn p-auto m-auto'>Sign In</button></Link>
        </div>
      )

    if (!this.state.isAdmin)
      return (
        <div className='p-1 border border-primary rounded-1 container'>
          <Location />
          <Map />
          <br />
          <Details />
          <Comments />
        </div>
      )

    if (this.state.isAdmin)
      return(
        <div className='p-1 border border-primary rounded-1 container'>
          <Comments />
        </div>
      );
  }
}
// Home;

// Location
function Location() {
  return (
    <div className='col-sm-12 col-md-4 col-lg-3 d-inline-block'>
    <section id='locations' className='p-1 mx-1 border border-primary rounded-1'>
      <h4>Locations</h4>
      <input id='search_bar' className='my-1' type='text' placeholder='Search Bar'></input>
      <button id='sort' className='mx-1 py-1 btn btn-outline-primary' type='button'>Sort</button>
      {/* <button id='favourites'></button> */}
      <table className='p-2'>
        <tbody>
          <tr><td>Location 1</td></tr>
          <tr><td>Location 2</td></tr>
          <tr><td>Location 3</td></tr>
        </tbody>
      </table>
    </section>
    </div>
  );
}
// Location;

// Map
function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(22.302711);
  const [lng, setLng] = useState(114.177216);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    // console.log(1);
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      
      // Remove Unneeded buttons from Mapbox
      attributionControl: false
    });
  });
  
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    // <section id='map' className='p-2 m-1 border border-primary rounded-1'>
    <div className='d-inline-block col-sm-12 col-md-8 col-lg-9'>
    <section id='map' className='p-1 mx-1 border border-primary rounded-1 d-inline-block w-100'>
      <h4>Map</h4>
      <div>
        {/* Mapbox */}
        <div ref={mapContainer} className="map-container" style={{width: '100%', height: '800px'}} />
      </div>
    </section>
    </div>
  );
}
// Map;

// Details
function Details() {
  return (
    <section id='details' className='col-sm-12 col-md-8 border border-primary rounded-1 d-inline-block'>
      <h4 className='d-inline-block me-3'>{"<"}Location Name{">"}</h4>
      <button id='favourite' className='p-1 py-1 btn btn-outline-primary'>Add to Favourites</button>
      <table>
        <thead>
          <tr><th className='pe-4 me-auto'>Title</th>
          <th className='pe-4 me-auto'>Venue</th>
          <th className='pe-4 me-auto'>Time</th>
          <th className='pe-4 me-auto'>Description</th>
          <th className='pe-4 me-auto'>Presenter</th>
          <th className='pe-4 me-auto'>Price</th></tr>
        </thead>

        {/* Fetch Data & Insert Here Automatically*/}
        <tbody>
          <tr><td>AAA</td><td>Room 101</td><td>Is</td><td>Description</td><td>Presenter</td><td>$100</td></tr>
          <tr><td>BBBB</td><td>Room 102</td><td>Stopped</td><td>Desc</td><td>Paster</td><td>Your</td></tr>
          <tr><td>CCCCCCCC</td><td>Room 103</td><td>.</td><td>Dsc</td><td>Futurer</td><td>Life</td></tr>
        </tbody>
      </table>
    </section>
  );
}
// Details;

// Comments
function Comments() {
  return (
    <section id='comments' className='col-sm-12 col-md-4 p-2 m-1 border border-primary rounded-1 d-inline-block'>
      <h4>Comments</h4>
      <table>
        <thead>
          <tr><th className='pe-4 mr-auto'>Username</th><th className='pe-4 mr-auto'>Comment</th>{/* <td>Time</td> */}</tr>
        </thead>

        {/* Fetch Data & Insert Here Automatically*/}
        <tbody>
          <tr><td>Alex Au</td><td>Cool Location</td></tr>
          <tr><td>Bedgy Bo</td><td>Agree</td></tr>
        </tbody>
      </table>
    </section>
  );
}
// Comments;
