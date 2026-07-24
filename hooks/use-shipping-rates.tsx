// src/hooks/useShippingRates.js
import { useState } from 'react';
import axios from 'axios';

const SHIPPO_TOKEN = import.meta.env.VITE_SHIPPO_API_TOKEN;

const useShippingRates = () => {
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState([]);
  const [error, setError] = useState(null);

  const getRates = async ({ from, to, parcel }) => {
    setLoading(true);
    setError(null);

    try {
      const shipmentRes = await axios.post(
        'https://api.goshippo.com/shipments/',
        {
          address_from: from,
          address_to: to,
          parcels: [parcel],
          async: false
        },
        {
          headers: {
            Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (shipmentRes.data && shipmentRes.data.rates) {
        setRates(shipmentRes.data.rates);
      } else {
        setRates([]);
      }
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError('Failed to fetch shipping rates');
    } finally {
      setLoading(false);
    }
  };

  return {
    rates,
    loading,
    error,
    getRates
  };
};

export default useShippingRates;
