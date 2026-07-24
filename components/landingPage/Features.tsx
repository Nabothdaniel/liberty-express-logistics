import {  FaBox } from 'react-icons/fa';
import { GiAirplaneDeparture } from "react-icons/gi";
import { CgFileDocument } from "react-icons/cg";
import { CiShoppingCart } from "react-icons/ci";

const steps = [
  {
    title: 'Book Air Freight',
    description: 'Schedule your cargo shipment online with our global air logistics network ensuring efficiency and reliability.',
    icon: <GiAirplaneDeparture  className='w-5 h-5' />,
    number: '01',
  },
  {
    title: 'Upload Freight Documents',
    description: 'Easily submit airway bills, invoices, and compliance documents to streamline customs and flight processing.',
    icon: <CgFileDocument  className='w-5 h-5' />,
    number: '02',
  },
  {
    title: 'Receive Cargo',
    description: 'Track and receive your goods at the destination with real-time updates and priority air handling.',
    icon:  <CiShoppingCart  className='w-5 h-5' />,
    number: '03',
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 text-center bg-white">
      <h2 className="text-3xl md:text-6xl font-bold mb-4">Smart Air Route Optimization</h2>
      <p className="text-gray-600 max-w-xl mx-auto mb-12">
        We optimize flight paths and schedules using AI-driven logistics to ensure the fastest, most reliable air cargo delivery.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6  mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="relative cursor-pointer hover:border-blue-200 hover:duration-250 bg-white border rounded-xl p-6 shadow-sm text-left group hover:shadow-lg transition-all">
            <div className="text-blue-800 mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{step.description}</p>
            <a href="/login" className="text-sm text-blue-600 font-medium hover:underline flex items-center">
              Get Started <span className="ml-1">→</span>
            </a>
            <span className="absolute top-4 right-4 text-gray-500 text-4xl font-bold opacity-20 select-none">{step.number}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
