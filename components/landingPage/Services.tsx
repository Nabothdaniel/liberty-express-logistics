// components/ServicesSection.tsx

import { FaArrowRight } from 'react-icons/fa';
import Img1 from '../../assets/images/landing/plane1.jpg'
import Img2 from '../../assets/images/landing/plane2.jpg'
import Img3 from '../../assets/images/landing/plane3.jpg'

const services = [
  {
    title: 'Global Service',
    description:
      'We always provide people a complete solution focused moving Flight, plane.',
    image: Img1, 
    ctas: ['International Flights', 'Worldwide Booking'],
  },
  {
    title: 'Local Service',
    description:
      'We knowledge of the local terrain which enables us to provide unmatched secondary distribution service.',
    image: Img2,
    ctas: [],
  }
];

export default function Services() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="text-center mb-12">
        <span className="text-sm uppercase tracking-wide text-gray-500">Services</span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Fly to Your Dream & Destinations
        </h2>
        <p className="mt-2 text-gray-600">At FlyWay, We have a deep commitment to always delivering first-class service</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative rounded-3xl overflow-hidden shadow-md group h-[450px]"
          >
            <img
              src={service.image.src}
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
