"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const KtmMap = () => {
  // multiple locations
  const locations = [
    {
      name: "StyleHub - Gokarneshwor",
      position: [27.751501257971672, 85.39131030646053],
      address: "Gokarneshwor, Kathmandu",
    },
    {
      name: "StyleHub - New Baneshwor",
      position: [27.69, 85.335],
      address: "New Baneshwor, Kathmandu",
    },
    {
      name: "StyleHub - Thamel",
      position: [27.7172, 85.324],
      address: "Thamel, Kathmandu",
    },
  ];

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={locations[0].position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {locations.map((location, index) => (
          <Marker key={index} position={location.position}>
            <Popup>
              <span className="text-xl font-semibold text-orange-500">
                {location.name}
              </span>
              <br />
              {location.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default KtmMap;
