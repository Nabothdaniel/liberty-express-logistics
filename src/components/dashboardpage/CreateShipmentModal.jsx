// Updated CreateShipmentModal.jsx
import { useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useAtomValue } from 'jotai';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { userAtom } from '../../atoms/authAtom';
import { db } from '../../firebase/firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreateShipmentModal({ onClose }) {
  const overlayRef = useRef();
  const [price, setPrice] = useState(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

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
    deliveryDate: '', 
    priority: false,
  });

  const ratePerKg = 5.5;

  const calculatePrice = ({ weight, length, width, height }) => {
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
    const updated = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(updated);

    const { weight, length, width, height } = updated;
    if (weight && length && width && height) {
      setPrice(
        calculatePrice({
          weight: parseFloat(weight),
          length: parseFloat(length),
          width: parseFloat(width),
          height: parseFloat(height),
        })
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!price || !user?.uid) return;

    setLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (userData.balance >= parseFloat(price)) {
        await updateDoc(userRef, {
          balance: userData.balance - parseFloat(price),
        });

        const shipmentRef = await addDoc(collection(db, 'shipments'), {
          ...formData,
          userId: user.uid,
          createdAt: serverTimestamp(),
          price: parseFloat(price),
          status: 'Pending',
          trackingCode: `TRK-${Date.now().toString().slice(-4)}`,
          history: [],
        });

        await updateDoc(shipmentRef, {
          history: [
            {
              action: 'Created',
              user: user.uid,
              timestamp: new Date().toISOString(),
            },
          ],
        });

        toast.success('Shipment created successfully');
        onClose();

        // Redirect to tracking page with ID
       // navigate(`/track/${shipmentRef.id}`);
      } else {
        setShowAddFunds(true);
      }
    } catch (err) {
      console.error('Error processing shipment:', err);
      toast.error('Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto md:overflow-y-hidden max-h-screen h-screen"
    >
      <div className="bg-white rounded-xl w-full max-w-2xl mx-auto my-20 p-6 relative shadow-lg">
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
          <input name="deliveryDate" type="date" className="input-style" placeholder="Expected Delivery Date" onChange={handleChange} />

          <label className="flex items-center space-x-2 col-span-full text-sm text-gray-700">
            <input type="checkbox" name="priority" onChange={handleChange} />
            <span>Priority Shipment</span>
          </label>

          {price && (
            <div className="col-span-full text-gray-800 font-semibold">
              Estimated Shipment Price: <span className="text-green-600">${price}</span>
            </div>
          )}

          {showAddFunds && (
            <div className="col-span-full bg-red-50 p-4 rounded border border-red-200 text-red-700">
              <p className="mb-2">Insufficient balance. Please fund your wallet to continue.</p>
              {/* Flutterwave button can go here */}
            </div>
          )}

          <button
            type="submit"
            className="col-span-full bg-gray-900 active:bg-gray-700 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Submit Shipment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
