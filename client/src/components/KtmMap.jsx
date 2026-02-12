"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon not showing in Next.js
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
  const position = [27.751501257971672, 85.39131030646053]; // Gokarneshwor

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={position}>
          <Popup>
            <span className="text-xl font-semibold text-orange-500">
              StyleHub
            </span>
            <br />
            Gokarneshwor, Kathmandu
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default KtmMap;
