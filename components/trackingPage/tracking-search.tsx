import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const TrackingSearch = ({ onSearch }) => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSearch(trackingNumber.trim());
    }
  };

  return (
    <div className="bg-white p-6 rounded-sm">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Enter your receipt number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-md border border-gray-300 text-gray-900 placeholder-gray-500 bg-white focus:outline-none"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        <button 
          type="submit" 
          className="h-12 px-6 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          Track
        </button>
      </form>
    </div>
  );
};

export default TrackingSearch;
