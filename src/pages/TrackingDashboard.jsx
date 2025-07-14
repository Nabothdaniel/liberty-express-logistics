import { useState } from "react";
import TrackingSearch from "../components/trackingPage/tracking-search";
import ShipmentDetails from "../components/trackingPage/shipment-details";
import DeliveryTimeline from "../components/trackingPage/delivery-timline";
import DeliveryMap from "../components/trackingPage/delivery-map";
import CourierInfo from "../components/trackingPage/courier-info";
import { toast } from "react-toastify";
import Header from "../components/dashboardpage/Header";

const TrackingDashboard = () => {
  const [searchResults, setSearchResults] = useState("GSK73842948346");

  // Mock data
  const mockShipments = [
    {
      id: "GSK73842948346",
      status: "delivered",
      arrivalDate: "21 May",
      arrivalTime: "17:00",
      items: 3,
    },
    {
      id: "GSK45678947645",
      status: "in-transit",
    },
  ];

  const mockTimelineEvents = [
    {
      id: "1",
      time: "16:43",
      status: "Order delivered to destination address",
      icon: "delivered",
      completed: true,
    },
    {
      id: "2",
      time: "13:12",
      status: "The order is on its way to Sampang",
      icon: "in-transit",
      completed: true,
    },
    {
      id: "3",
      time: "10:34",
      status: "Order handed over to courier",
      icon: "handed-over",
      completed: true,
    },
    {
      id: "4",
      time: "07:30",
      status: "Items being packed",
      icon: "packed",
      completed: true,
    },
  ];

  const handleSearch = (trackingNumber) => {
    setSearchResults(trackingNumber);
    toast.success(`Tracking shipment: ${trackingNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-200/20">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <TrackingSearch onSearch={handleSearch} />
            
            <ShipmentDetails 
              totalPackages={1204}
              shipments={mockShipments}
            />
            
            <DeliveryTimeline 
              events={mockTimelineEvents}
              currentStatus="ON GOING"
            />
            
            <CourierInfo 
              name="Mat Tinggal"
              phone="+62 812 3456 7890"
            />
          </div>
          
          {/* Right Column - Map */}
          <div className="lg:col-span-2">
            <DeliveryMap 
              from="Jl. Rajawali I, Gg. III, S..."
              to="Jl. Delima Indah II, No..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingDashboard;