// components/TrackingOrdersHeader.jsx
import React, { useState } from 'react';
import CreateShipmentModal from './CreateShipmentModal';

export default function TrackingOrdersHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-lg md:text-3xl font-bold text-gray-900">Tracking Orders List</h1>
          <div className="text-sm text-gray-600 mt-1">
            <span>Today • July 15, 2023</span>
          </div>
        </div>

        <div>
          <button
            className="px-6 py-2 bg-gray-900 cursor-pointer text-white rounded-lg hover:bg-gray-700 active:bg-gray-800"
            onClick={() => setShowModal(true)}
          >
            Create shipment
          </button>
        </div>
      </div>

      {showModal && <CreateShipmentModal onClose={() => setShowModal(false)} />}
    </>
  );
}
