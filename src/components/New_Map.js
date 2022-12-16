/*
 * CSCI2720/ESTR2106 Course Project
 * A Social Map of Events
 *
 * We declare that the assignment here submitted is original
 * except for source material explicitly acknowledged,
 * and that the same or closely related material has not been
 * previously submitted for another course.
 * We also acknowledge that we are aware of University policy and
 * regulations on honesty in academic work, and of the disciplinary
 * guidelines and procedures applicable to breaches of such
 * policy and regulations, as contained in the website.
 *
 * University Guideline on Academic Honesty:
 *   http://www.cuhk.edu.hk/policy/academichonesty
 * Faculty of Engineering Guidelines to Academic Honesty:
 *   https://www.erg.cuhk.edu.hk/erg/AcademicHonesty
 *
 * Student Name: Choi Man Kit, Chow Tsz Ching, Chui Kin Ho, Heung Tsz Kit, Tse Chi Man, Yu Kin Lam
 * Student ID  : 1155144350, 1155142491, 1155170952, 1155143358, 1155142152, 1155143885
 * Date        : 17 Dec 2022
 */

import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import { mapboxglKey, server2URL } from '../utils/EnvReact';

const venue = {}
const venues = []
const mapboxInit = (props) => async () => {

  const map = useRef(null);

  // If no key or key length not right, then load try to load it but still failed, then wait 2s and try again
  if (
    !mapboxglKey() ||
    (mapboxglKey().length !== 93).mapboxglKey == null)
    return setTimeout(mapboxInit(), 2000);

  if (props.id !== "all") {
    await fetch(server2URL + "/venueLatLong/" + props.id)
      .then((res) => res.json())
      .then((data) => {
        venue = {lat: data.lat, lng: data.longitude}
        // // console.log(data.latitude);
        // new mapboxgl.Marker()
        //   .setLngLat([data.longitude, data.latitude])
        //   .addTo(map.current);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  }

  await fetch(server2URL + "/allVenueLatLong")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      for (let i = 0; i < 10; i++) {
        venues.push({url: "/venue/" + String(data[i].id), lat: data[i].longitude, lng: data[i].latitude, venue: data[i].venue})
        // let url = "/venue/" + String(data[i].id);
        // // https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
        // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        //   "<a href=" + url + ">" + String(data[i].venue) + "</a>"
        // );
        // const el = document.createElement("div");
        // el.id = "marker";
        // new mapboxgl.Marker()
        //   .setLngLat([data[i].longitude, data[i].latitude])
        //   .setPopup(popup)
        //   .addTo(map.current);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  // Do something
}


export function New_Map() {
  const [viewport, setViewport] = useState({
    longitude: -100,
    latitude: 40,
    width: "100vw",
    height: "100vh",
    zoom: 3.5
  })

  useEffect(() => mapboxInit(), []);

  // mapboxglKey() && mapboxglKey().length == 93 ?
  return (
    <>
    <ReactMapGL
      {...viewport}
      // mapboxApiAccessToken={mapboxglKey()}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_GL_KEY}
    >

      <Marker
        coordinates={[-0.2416815, 51.5285582]}
        anchor="bottom">
        <img src="./pin.png/"/>
      </Marker>

      <Marker longitude={-100} latitude={40} anchor="bottom" >
        <img src="./pin.png" />
      </Marker>
    </ReactMapGL>
    </>
  )
}