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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
        {/* Left: Accordion */}
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            About <span className="text-blue-600">Liberty Express</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We specialize in seamless logistics solutions that ensure your shipments reach their destination safely, efficiently, and on time—every time.
          </p>
          <div className="space-y-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left text-gray-800 font-semibold text-base focus:outline-none"
                >
                  <span>{feature.title}</span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                    {feature.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-full h-[28rem] rounded-2xl overflow-hidden shadow-xl">
          <img
            src={Img}
            alt="Liberty Express operations"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
