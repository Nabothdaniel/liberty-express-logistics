import React, { useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function CreateShipmentModal({ onClose }) {
  const overlayRef = useRef();
  const [price, setPrice] = useState(null);

  const [formData, setFormData] = useState({
    sender: '',
    receiver: '',
    origin: '',
    destination: '',
    cargoType: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    date: '',
    priority: false,
  });

  const ratePerKg = 5.5; // Example rate

  const calculatePrice = (data) => {
    const { weight, length, width, height } = data;
    const volumetricWeight = (length * width * height) / 5000;
    const chargeableWeight = Math.max(weight, volumetricWeight);
    return (chargeableWeight * ratePerKg).toFixed(2);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(newData);

    // Trigger live price update if key fields are present
    const { weight, length, width, height } = newData;
    if (weight && length && width && height) {
      setPrice(calculatePrice({
        weight: parseFloat(weight),
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Shipment submitted:', formData);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 px-6 bg-black/50 backdrop-blur-sm z-50 py-20 flex items-center justify-center"
    >
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800"
        >
          <FiX className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Air Shipment</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="sender" placeholder="Sender Name" className="input" required onChange={handleChange} />
          <input name="receiver" placeholder="Receiver Name" className="input" required onChange={handleChange} />
          <input name="origin" placeholder="Origin Airport" className="input" required onChange={handleChange} />
          <input name="destination" placeholder="Destination Airport" className="input" required onChange={handleChange} />
          <input name="cargoType" placeholder="Cargo Type" className="input" required onChange={handleChange} />
          <input name="weight" type="number" step="0.1" placeholder="Weight (kg)" className="input" required onChange={handleChange} />
          <input name="length" type="number" step="0.1" placeholder="Length (cm)" className="input" required onChange={handleChange} />
          <input name="width" type="number" step="0.1" placeholder="Width (cm)" className="input" required onChange={handleChange} />
          <input name="height" type="number" step="0.1" placeholder="Height (cm)" className="input" required onChange={handleChange} />
          <input name="date" type="date" className="input-style" required onChange={handleChange} />

          <label className="flex items-center space-x-2 col-span-full text-sm text-gray-700">
            <input type="checkbox" name="priority" onChange={handleChange} />
            <span>Priority Shipment</span>
          </label>

          {price && (
            <div className="col-span-full text-gray-800 font-semibold">
              Estimated Shipment Price: <span className="text-green-600">${price}</span>
            </div>
          )}

          <button
            type="submit"
            className="col-span-full bg-gray-900 active:bg-gray-700 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Submit Shipment
          </button>
        </form>
      </div>
    </div>
  );
}

