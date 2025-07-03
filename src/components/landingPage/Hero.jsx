import { useState } from 'react';
import HeroBanner from '../../assets/images/landing/hero-plane.jpg';
import { LuBox } from "react-icons/lu";
import { MdAirlineStops } from "react-icons/md";

const Hero = () => {
  const [activeTab, setActiveTab] = useState('track');
  const [trackingInputs, setTrackingInputs] = useState(['']);



  const handleChange = (value, index) => {
    const updated = [...trackingInputs];
    updated[index] = value;
    setTrackingInputs(updated);
  };

  return (
    <section
      className="relative bg-cover bg-center py-20 my-20 md:py-10 mx-3 md:mx-5 h-auto md:h-[550px]  rounded-lg px-4 text-white"
      style={{ backgroundImage: `url(${HeroBanner})` }}
    >
      <div className="max-w-7xl mx-auto md:mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        
        {/* Left Content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Navigating Logistics with a Focus on Timely Deliveries
          </h1>
          <p className="text-lg md:text-xl">
            Experience flawless freight solutions tailored for your needs. We take pride in delivering excellence with punctuality at the forefront.
          </p>
        </div>

        {/* Right Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl text-black w-full md:w-[450px]">
          {/* Tabs */}
          <div className="flex justify-between mb-6 border border-gray-300 rounded-full overflow-hidden">
            <button
              onClick={() => setActiveTab('track')}
              className={`w-1/2 py-2 px-4 flex items-center justify-center gap-2 font-semibold text-sm rounded-full transition ${
                activeTab === 'track' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-600'
              }`}
            >
              <LuBox className='w-5 h-5'/> Tracking Package
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`w-1/2 py-2 px-4 flex items-center justify-center gap-2 font-semibold text-sm rounded-full transition ${
                activeTab === 'rates' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-600'
              }`}
            >
              <MdAirlineStops className='w-5 h-5'/> Freight Rates
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'track' ? (
            <form className="space-y-4">
              {trackingInputs.map((val, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Tracking Number"
                  value={val}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            
              <button
                type="submit"
                className="w-full mt-4 bg-gray-900 hover:bg-gray-800 hover:duration-300 cursor-pointer text-white font-bold py-3 rounded-full transition"
              >
                Track Order
              </button>
            </form>
          ) : (
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Origin Zip Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Destination Zip Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-gray-900 hover:bg-gray-800 hover:duration-300 cursor-pointer text-white font-bold py-3 rounded-full transition"
              >
                Calculate Rate
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
