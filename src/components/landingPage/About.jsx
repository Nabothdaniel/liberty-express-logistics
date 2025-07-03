import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Img from '../../assets/images/landing/about.jpg';

const features = [
  {
    title: 'AI-Powered Tracking',
    content:
      'We use cutting-edge artificial intelligence to track your cargo in real-time, ensuring full visibility from origin to destination.',
  },
  {
    title: 'Cost-Effective Solutions',
    content:
      'Our logistics strategies are designed to minimize cost while maintaining speed and reliability, tailored to your budget.',
  },
  {
    title: '24/7 Customer Support',
    content:
      'Our dedicated support team is available around the clock to assist with your inquiries and shipment status updates.',
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Accordion */}
        <div>
            <h1 className='text-4xl md:text-6xl text-center font-bold mb-5'>About Us</h1>
          <p className="text-gray-500 mb-6 max-w-7xl">
            With advanced logistics planning and real-time tracking, we ensure your cargo reach their destination on schedule—every time.
          </p>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="border rounded-lg ">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex cursor-pointer justify-between items-center px-4 py-3 text-left text-gray-800 font-medium focus:outline-none"
                >
                  <span>{feature.title}</span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-sm text-gray-600 cursor-pointer">
                    {feature.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-full rounded-lg overflow-hidden">
          <img
            src={Img}
            alt="liberty express logo"
            className="w-full h-auto object-cover rounded-lg shadow"
          />
        </div>
      </div>
    </section>
  );
}
