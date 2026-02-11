// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// const Maps = () => {
//   const mapRef = useRef(null);
//   const [mapLoaded, setMapLoaded] = useState(false);

//   useEffect(() => {
//     const initMap = async () => {
//       try {
//         // Set API key and version
//         setOptions({
//           apiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
//           version: "weekly",
//         });

//         // Import the Maps library
//         const { Map } = await importLibrary("maps");

//         const position = { lat: 27.7179, lng: 85.366 };

//         const options = {
//           center: position,
//           zoom: 15,
//         };

//         // Create map
//         new Map(mapRef.current, options);

//         setMapLoaded(true);
//       } catch (error) {
//         console.error("Error loading Google Maps:", error);
//       }
//     };

//     initMap();
//   }, []);

//   return (
//     <main>
//       {!mapLoaded && (
//         <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">
//           Loading map...
//         </div>
//       )}
//       <div
//         ref={mapRef}
//         className={`w-full h-[400px] ${mapLoaded ? "block" : "hidden"}`}
//       ></div>
//     </main>
//   );
// };

// export default Maps;
