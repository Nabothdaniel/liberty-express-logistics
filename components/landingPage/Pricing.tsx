
import { FiTruck, FiPackage, FiGlobe, FiCheckCircle } from 'react-icons/fi';

const Pricing = () => {
  const plans = [
    {
      name: 'Domestic',
      description: 'Perfect for local deliveries',
      icon: FiTruck,
      features: [
        'Same-day and next-day delivery options',
        'Real-time tracking and notifications',
        'Basic insurance coverage included',
        'Standard customer support',
        'Up to 50 lbs per package'
      ]
    },
    {
      name: 'Express',
      description: 'Fast nationwide shipping',
      icon: FiPackage,
      isPopular: true,
      features: [
        'Guaranteed 1-2 day delivery nationwide',
        'Priority handling and processing',
        'Extended insurance coverage',
        '24/7 customer support',
        'Up to 150 lbs per package',
        'Signature confirmation included'
      ]
    },
    {
      name: 'Global',
      description: 'International freight solutions',
      icon: FiGlobe,
     
      features: [
        'Worldwide shipping to 200+ countries',
        'Customs clearance assistance',
        'Air and sea freight options',
        'Dedicated account manager',
        'No weight restrictions',
        'Full cargo insurance',
        'Door-to-door delivery service'
      ]
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="">
        <div className=" py-12 px-0 ">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shipping Solutions<br />
              for Every Need
            </h2>
            <p className="text-gray-600 text-lg  mb-8">
              Reliable and cost-effective logistics services for businesses of all sizes. 
              Choose the perfect plan for your shipping requirements.
            </p>
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button className="px-6 py-2 bg-gray-500 text-white rounded-full text-sm font-medium">
                Standard Rates
              </button>
              
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <div key={index} className="relative">
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gray-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className={`p-8 rounded-2xl border-2 h-full flex flex-col ${
                    plan.isPopular ? 'border-gray-500 bg-gray-50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        index === 0 ? 'bg-blue-100' : 
                        index === 1 ? 'bg-gray-100' : 'bg-green-100'
                      }`}>
                        <IconComponent className={`w-8 h-8 ${
                          index === 0 ? 'text-blue-600' : 
                          index === 1 ? 'text-gray-600' : 'text-green-600'
                        }`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-4">Service includes:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Need a custom solution for your business?</p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Contact Our Logistics Experts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
