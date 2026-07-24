"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Search, Plane, X, Share, Navigation } from "lucide-react";
import { db } from "../../firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { StatusManager } from "../../utils/status-manager";
import Header from "../../components/landingPage/Header";

// Images for the flight details card (similar to the plane image in the UI)
import heroPlane from "../../assets/images/landing/hero-plane.jpg";

const LiveMap = dynamic(() => import("../../components/track/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F7F6F2] flex items-center justify-center flex-col gap-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute w-16 h-16 border-4 border-[#8A5A44] rounded-full border-t-transparent animate-spin"></div>
        <Plane className="w-6 h-6 text-[#8A5A44] absolute animate-pulse" />
      </div>
      <span className="text-gray-500 font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Map</span>
    </div>
  ),
});

const statusColors = {
  booked: "bg-blue-100 text-blue-800",
  check_in: "bg-indigo-100 text-indigo-800",
  boarding: "bg-yellow-100 text-yellow-800",
  in_flight: "bg-orange-100 text-orange-800",
  landed: "bg-teal-100 text-teal-800",
  arrived: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-700",
};

export default function TrackPage() {
  return (
    <SuspenseWrapper>
      <TrackContent />
    </SuspenseWrapper>
  );
}

function SuspenseWrapper({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      {children}
    </div>
  );
}

function getCityCode(city) {
  if (!city) return "N/A";
  return city.substring(0, 3).toUpperCase();
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams ? searchParams.get("code") || "" : "";

  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [loading, setLoading] = useState(true);
  const [focusLocation, setFocusLocation] = useState(null);

  // Live Firestore listener
  useEffect(() => {
    const q = query(collection(db, "flights"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFlights(data);

      if (data.length > 0) {
        if (initialCode) {
          const match = data.find(
            (f) => (f.trackingCode || "").toLowerCase() === initialCode.toLowerCase()
          );
          if (match) setSelectedFlight(match);
          else setSelectedFlight(null);
        } else if (!selectedFlight) {
          setSelectedFlight(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [initialCode]);

  useEffect(() => {
    if (selectedFlight) {
      const updated = flights.find((f) => f.id === selectedFlight.id);
      if (updated) setSelectedFlight(updated);
    }
  }, [flights]);

  const filtered = flights.filter((f) => {
    if (!searchQuery || !searchQuery.trim()) return false;
    
    // Only exact tracking code match to protect user privacy
    return (f.trackingCode || "").toLowerCase() === searchQuery.trim().toLowerCase();
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F7F6F2]">
      <div className="absolute top-0 w-full z-50">
        <Header />
      </div>

      {/* Main Content Area (Full height map with floating UI) */}
      <div className="relative flex-1 w-full h-full mt-[72px]">
        {/* Background Map */}
        <div className="absolute inset-0 z-0">
          <LiveMap 
            fromLocation={selectedFlight?.fromLocation} 
            toLocation={selectedFlight?.toLocation} 
            currentLocation={selectedFlight?.currentLocation}
            status={selectedFlight?.status} 
            focusLocation={focusLocation}
          />
        </div>

        {/* Floating UI Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col md:flex-row p-4 md:p-8 gap-6 overflow-hidden">
          
          {/* Left Panel: Search & Results */}
          <div className="w-full md:w-96 flex flex-col gap-4 pointer-events-auto h-full max-h-full">
            {/* Search Box */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
              <Search className="text-gray-400 w-5 h-5 ml-2" />
              <input
                type="text"
                placeholder="Enter tracking code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-sm font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-800 mr-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            {searchQuery.trim() && (
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Plane className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">No flights found matching your code.</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {filtered.map((flight) => {
                      const isSelected = selectedFlight?.id === flight.id;
                      return (
                        <div
                          key={flight.id}
                          onClick={() => setSelectedFlight(flight)}
                          className={`p-4 rounded-2xl cursor-pointer transition-all ${
                            isSelected 
                              ? "bg-[#8A5A44] text-white shadow-md" 
                              : "hover:bg-gray-50 text-gray-800"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-mono font-bold text-sm tracking-wider">
                              {flight.trackingCode}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                              isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                            }`}>
                              {StatusManager.getStatus(flight.status).label}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <div className={`text-xs opacity-70 mb-1 ${isSelected ? "text-white" : "text-gray-500"}`}>Origin</div>
                              <div className="font-bold text-xl">{getCityCode(flight.fromLocation)}</div>
                            </div>
                            <div className="flex-1 px-4 relative flex items-center justify-center">
                              <div className={`w-full h-[1px] ${isSelected ? "bg-white/30" : "bg-gray-300"}`}></div>
                              <Plane className={`absolute w-4 h-4 ${isSelected ? "text-white" : "text-gray-400"}`} />
                            </div>
                            <div className="text-right">
                              <div className={`text-xs opacity-70 mb-1 ${isSelected ? "text-white" : "text-gray-500"}`}>Dest</div>
                              <div className="font-bold text-xl">{getCityCode(flight.toLocation)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Flight Details */}
          {selectedFlight && (
            <div className="w-full md:w-[420px] ml-auto pointer-events-auto max-h-full overflow-y-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
                
                {/* Header Image Area */}
                <div className="relative h-48 w-full bg-gray-900">
                  <Image src={heroPlane} alt="Plane" layout="fill" objectFit="cover" className="opacity-80" />
                  
                  {/* Top Bar inside Image */}
                  <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white">
                    <div>
                      <h2 className="font-mono font-bold text-lg tracking-wider text-[#F2E5D0]">
                        {selectedFlight.trackingCode}
                      </h2>
                      <p className="text-xs font-medium opacity-90">Liberty Express Airlines</p>
                    </div>
                    <button onClick={() => setSelectedFlight(null)} className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-6">
                  {/* Route & Progress */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-3xl font-black text-gray-900">{getCityCode(selectedFlight.fromLocation)}</div>
                      <div className="text-xs font-bold text-gray-500 truncate max-w-[100px]" title={selectedFlight.fromLocation}>{selectedFlight.fromLocation}</div>
                    </div>
                    
                    <div className="flex-1 px-6">
                      <div className="relative flex items-center">
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8A5A44] transition-all duration-1000 ease-out" 
                            style={{ width: `${StatusManager.getStatus(selectedFlight.status).progress}%` }} 
                          />
                        </div>
                        <Plane 
                          className="absolute text-[#8A5A44] w-5 h-5 -mt-2.5 transition-all duration-1000 ease-out bg-white rounded-full" 
                          style={{ left: `calc(${StatusManager.getStatus(selectedFlight.status).progress}% - 10px)` }} 
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black text-gray-900">{getCityCode(selectedFlight.toLocation)}</div>
                      <div className="text-xs font-bold text-gray-500 truncate max-w-[100px]" title={selectedFlight.toLocation}>{selectedFlight.toLocation}</div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#F7F6F2] p-4 rounded-2xl">
                      <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Departure Date</div>
                      <div className="font-bold text-gray-900 text-sm">{selectedFlight.flightDate || "TBD"}</div>
                    </div>
                    <div className="bg-[#F7F6F2] p-4 rounded-2xl">
                      <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Arrival Date</div>
                      <div className="font-bold text-gray-900 text-sm">{selectedFlight.arrivalDate || "TBD"}</div>
                    </div>
                  </div>

                  {/* Flight Information */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Flight Information</h3>
                    <div className="bg-[#F7F6F2] rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
                        <span className="text-sm font-medium text-gray-600">Passenger</span>
                        <span className="text-sm font-bold text-gray-900">{selectedFlight.firstName} {selectedFlight.lastName}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
                        <span className="text-sm font-medium text-gray-600">Flight Class</span>
                        <span className="text-sm font-bold text-gray-900 capitalize">{(selectedFlight.flightType || "economy").replace("_", " ")}</span>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <span className="text-sm font-medium text-gray-600">Current Status</span>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${statusColors[selectedFlight.status] || "bg-gray-100 text-gray-800"}`}>
                          {StatusManager.getStatus(selectedFlight.status).label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline / Live Updates (If any) */}
                  {selectedFlight.statusHistory && selectedFlight.statusHistory.length > 0 && (
                    <div className="mb-6">
                       <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Live Updates</h3>
                       <div className="space-y-4 max-h-[150px] overflow-y-auto pr-2">
                         {[...selectedFlight.statusHistory].reverse().map((entry, i) => {
                           const hasLocation = entry.note && (entry.note.includes("at ") || entry.note.includes("in "));
                           // naive location extraction for demo interactivity
                           let extractedLoc = null;
                           if (hasLocation) {
                              const match = entry.note.match(/(?:at|in)\s+([A-Z][a-zA-Z\s]+)/);
                              if (match) extractedLoc = match[1].trim();
                           }
                           
                           return (
                             <div 
                               key={i} 
                               className={`flex gap-3 p-2 rounded-xl transition-all ${extractedLoc ? "cursor-pointer hover:bg-gray-100" : ""}`}
                               onClick={() => extractedLoc && setFocusLocation(extractedLoc)}
                               title={extractedLoc ? "Click to view on map" : ""}
                             >
                               <div className="flex flex-col items-center">
                                 <div className={`w-2 h-2 rounded-full ${extractedLoc ? "bg-blue-500 animate-pulse" : "bg-[#8A5A44]"} mt-1.5`} />
                                 {i !== selectedFlight.statusHistory.length - 1 && <div className="w-px h-full bg-gray-200 mt-1" />}
                               </div>
                               <div className="pb-1">
                                 <p className="text-sm font-medium text-gray-900">{entry.note || StatusManager.getStatus(entry.status).label}</p>
                                 <p className="text-[10px] text-gray-400 font-medium mt-0.5">{new Date(entry.timestamp).toLocaleString()}</p>
                                 {extractedLoc && (
                                   <span className="text-[9px] uppercase tracking-wider text-blue-500 font-bold mt-1 inline-block">📍 View on Map</span>
                                 )}
                               </div>
                             </div>
                           );
                         })}
                       </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setFocusLocation(selectedFlight?.toLocation || null)}
                      className="flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Route</span>
                    </button>
                    <button 
                      onClick={() => {
                        const trackUrl = window.location.origin + '/track?code=' + selectedFlight.trackingCode;
                        if (navigator.share) {
                          navigator.share({
                            title: 'Track My Flight',
                            text: `Track my flight ${selectedFlight.trackingCode} on Liberty Express`,
                            url: trackUrl,
                          }).catch(console.error);
                        } else {
                          navigator.clipboard.writeText(trackUrl);
                          alert("Tracking link copied to clipboard!");
                        }
                      }}
                      className="flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <Share className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
