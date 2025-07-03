// components/ServicesSection.tsx

import { FaArrowRight } from 'react-icons/fa';
import Img1 from '../../assets/images/landing/plane1.jpg'
import Img2 from '../../assets/images/landing/plane2.jpg'
import Img3 from '../../assets/images/landing/plane3.jpg'

const services = [
  {
    title: 'On the Road to Reliability, Unleashing the Power of Road Freight Solutions',
    description:
      'Experience the reliability of our Road Freight services, ensuring your goods reach their destination with precision.',
    image: Img1, 
    ctas: ['International Freight', 'Domestic Freight'],
  },
  {
    title: 'Seamlessly Across the Seas with Ocean Freight Services',
    description:
      'Expand your global reach with dependable and secure Ocean Freight logistics.',
    image: Img2,
    ctas: [],
  },
  {
    title: 'Elevate Your Shipments with Plane Cargo Services',
    description:
      'Accelerate deliveries with our Air Freight solutions for high-priority shipments.',
    image: Img3,
    ctas: [],
  },
];

export default function Services() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="text-center mb-12">
        <span className="text-sm uppercase tracking-wide text-gray-500">Services</span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Comprehensive Logistics Solutions
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative rounded-3xl overflow-hidden shadow-md group h-[450px]"
          >
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-sm md:text-base mb-4">{service.description}</p>

              <div className="flex gap-4 flex-wrap">
                {service.ctas.map((cta, i) => (
                  <button
                    key={i}
                    className="bg-white text-black text-sm px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-100 transition"
                  >
                    {cta} <FaArrowRight className="text-xs" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
