import React, { useEffect, useState, useRef } from "react";
import {
  server2URL,
  exampleServerURL,
  mapboxglKey,
  onLoad,
} from "../utils/EnvReact";
// eslint-disable-next-line
import mapboxgl from "!mapbox-gl";
export function Map(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(22.302711);
  const [lng, setLng] = useState(114.177216);
  const [zoom, setZoom] = useState(9);
  /*
    const mapClickUrl = useRef("");
    const mapAutoClick = (url) => {
      console.log("map pop click");
      mapClickUrl.current = url;
      setTimeout(() => document.getElementById("mapAutoClick").click(), "70");
    };
    */

  const mapboxInit = () => async () => {
    // If no key or key length not right, then load try to load it but still failed, then wait 2s and try again
    if (
      !mapboxglKey() ||
      (mapboxglKey().length !== 93 && (await onLoad()).mapboxglKey == null)
    )
      return setTimeout(mapboxInit(), 2000);

    // initialize map only once
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,

      // Remove Unneeded buttons from Mapbox
      attributionControl: false,
    });

    if (props.id !== "all") {
      await fetch(server2URL + "/venueLatLong/" + props.id)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.latitude);
          new mapboxgl.Marker()
            .setLngLat([data.longitude, data.latitude])
            .addTo(map.current);
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
          let url = "/venue/" + String(data[i].id);
          // https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            "<a href=" + url + ">" + String(data[i].venue) + "</a>"
          );
          const el = document.createElement("div");
          el.id = "marker";
          new mapboxgl.Marker()
            .setLngLat([data[i].longitude, data[i].latitude])
            .setPopup(popup)
            .addTo(map.current);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => mapboxInit(), []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    // <section id='map' className='p-2 m-1 border border-primary rounded-1'>
    <div className="d-flex m-auto">
      <section
        id="map"
        className="p-1 mx-1 border border-primary rounded-1 d-inline-block w-100"
      >
        <h4>Map</h4>
        <div>
          {/* Mapbox */}
          <div
            ref={mapContainer}
            className="map-container"
            style={{ width: "100%", height: "400px" }}
          />
        </div>
        {/*<Link to={mapClickUrl.current}>
            <button id="mapAutoClick" hidden></button>
    </Link>*/}
      </section>
    </div>
  );
}
