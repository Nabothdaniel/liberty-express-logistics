// @ts-nocheck
"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet markers in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// A custom pulsing animated airplane icon
const pulsingPlaneIcon = new L.divIcon({
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="absolute inset-0 bg-[#8A5A44] rounded-full opacity-40 animate-ping"></div>
      <div class="relative bg-[#8A5A44] text-white p-1.5 rounded-full shadow-lg border-2 border-white z-10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.3c-.2.5.1 1 .6 1.1l7.6 1.9-3 3-3.1-1c-.5-.1-.9.1-1.1.5l-.8 2c-.2.5 0 1 .5 1.1l4.9 1.4 1.4 4.9c.1.5.6.7 1.1.5l2-.8c.4-.2.6-.6.5-1.1l-1-3.1 3-3 1.9 7.6c.1.5.6.8 1.1.6l3.3-1.2c.5-.2.8-.6.7-1.1z"/></svg>
      </div>
    </div>
  `,
  className: "bg-transparent",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

function MapController({ bounds, focusLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && !focusLocation) {
      try {
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {}
    }
  }, [bounds, map, focusLocation]);

  useEffect(() => {
    if (focusLocation) {
      const flyToFocus = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(focusLocation)}`);
          const data = await res.json();
          if (data && data.length > 0) {
            map.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 12, { duration: 2 });
          }
        } catch (e) {}
      };
      flyToFocus();
    }
  }, [focusLocation, map]);
  return null;
}

// Weather Widget overlay for coordinates
function WeatherWidget({ coord, label }) {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    if (!coord) return;
    async function fetchWeather() {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coord[0]}&longitude=${coord[1]}&current_weather=true`);
        const data = await res.json();
        if (data.current_weather) {
          setWeather(data.current_weather);
        }
      } catch (e) {}
    }
    fetchWeather();
  }, [coord]);

  if (!weather) return null;

  return (
    <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2 pointer-events-auto">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider leading-none">{label} Weather</span>
        <span className="text-sm font-black text-gray-900 leading-tight">{weather.temperature}°C</span>
      </div>
      <div className="text-xl">{weather.temperature > 20 ? '☀️' : weather.temperature > 10 ? '⛅' : '🌧️'}</div>
    </div>
  );
}

export default function LiveMap({ fromLocation, toLocation, currentLocation, status, focusLocation }) {
  const [loading, setLoading] = useState(true);
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord, setToCoord] = useState(null);
  const [currentCoord, setCurrentCoord] = useState(null);

  useEffect(() => {
    async function geocodeAll() {
      const fetchCoords = async (query) => {
        if (!query) return null;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } catch (e) {}
        return null;
      };

      const [fromC, toC] = await Promise.all([
        fetchCoords(fromLocation),
        fetchCoords(toLocation)
      ]);
      
      setFromCoord(fromC);
      setToCoord(toC);
      
      if (currentLocation) {
        const currC = await fetchCoords(currentLocation);
        setCurrentCoord(currC || fromC);
      } else {
        const isArrived = ["arrived", "delivered", "out_for_delivery"].includes(status);
        setCurrentCoord(isArrived ? toC : fromC);
      }
      
      setLoading(false);
    }
    geocodeAll();
  }, [fromLocation, toLocation, currentLocation, status]);

  if (loading) {
    return (
      <div className="w-full h-full bg-[#E5E3DB] animate-pulse flex items-center justify-center">
        <span className="text-gray-500 font-medium tracking-wide text-sm">Connecting to Satellites...</span>
      </div>
    );
  }

  const boundsCoords = [fromCoord, toCoord, currentCoord].filter(Boolean);
  const bounds = boundsCoords.length > 0 ? L.latLngBounds(boundsCoords) : null;
  const polylinePositions = [fromCoord, toCoord].filter(Boolean);

  return (
    <div className="w-full h-full relative">
      {/* Floating Weather Panels on Map */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-3 pointer-events-none">
        {fromCoord && <WeatherWidget coord={fromCoord} label="Origin" />}
        {toCoord && <WeatherWidget coord={toCoord} label="Destination" />}
      </div>

      {status && (
        <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">Live GPS Tracker</span>
        </div>
      )}

      {/* @ts-ignore - React Leaflet v5 type definition mismatch with React 19 */}
      <MapContainer center={[51.505, -0.09] as any} zoom={4} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 10 }}>
        {bounds && <MapController bounds={bounds} focusLocation={focusLocation} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {fromCoord && (
          <Marker position={fromCoord}>
            <Popup>
              <div className="font-bold text-xs uppercase text-gray-500">Origin</div>
              <div className="font-black text-gray-900">{fromLocation}</div>
            </Popup>
          </Marker>
        )}
        
        {toCoord && (
          <Marker position={toCoord}>
             <Popup>
              <div className="font-bold text-xs uppercase text-gray-500">Destination</div>
              <div className="font-black text-gray-900">{toLocation}</div>
            </Popup>
          </Marker>
        )}

        {polylinePositions.length === 2 && (
          <Polyline positions={polylinePositions} pathOptions={{ color: '#8A5A44', weight: 3, dashArray: '6, 8', opacity: 0.7 }} />
        )}

        {currentCoord && (
          <Marker position={currentCoord} icon={pulsingPlaneIcon}>
            <Popup>
              <div className="font-semibold text-gray-800">Current Live Location</div>
              <div className="text-xs text-gray-600 mb-1">{currentLocation || (["arrived"].includes(status) ? toLocation : fromLocation)}</div>
              <div className="text-xs font-bold text-white capitalize bg-[#8A5A44] px-2 py-0.5 rounded-md inline-block mt-1">{(status || "").replace(/_/g, " ")}</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
