// pages/plans.tsx or wherever this is located
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { plans } from '../lib/plans';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Plans() {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const currentPlan = session?.user?.planType || 'free';

  const handleGetStarted = (planName: string) => {
    if (planName === currentPlan) {
      return;
    }
    
    setIsRedirecting(true);
    
    if (session) {
      // User is logged in - redirect to checkout with the selected plan
      router.push(`/checkout?plan=${planName}&billing=${isAnnual ? 'yearly' : 'monthly'}`);
    } else {
      // User is not logged in - redirect to login with return URL to checkout
      router.push(`/login?callbackUrl=${encodeURIComponent(`/checkout?plan=${planName}&billing=${isAnnual ? 'yearly' : 'monthly'}`)}`);
    }
  };

  return (
    <>
      <Head>
        <title>TriLearn | Pricing Plans</title>
      </Head>
      <Navbar />

      <main className="bg-gray-50 min-h-screen text-gray-800">
        {/* Pricing Section */}
        <section className="max-w-7xl mx-auto py-20 px-6 text-center">
          <p className="text-sm font-semibold uppercase text-gray-500 mb-2 tracking-wide">• Our Plans</p>
          <h1 className="text-4xl font-bold mb-4">Choose the Right Plan</h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-10">
            Select the perfect plan for your learning needs. From free access to premium features, we've got you covered.
          </p>

          {/* Toggle */}
          <div className="inline-flex bg-white shadow-inner rounded-full mb-12 overflow-hidden">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 font-medium text-sm ${!isAnnual ? 'bg-black text-white' : 'text-gray-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 font-medium text-sm ${isAnnual ? 'bg-black text-white' : 'text-gray-500'}`}
            >
              Annually <span className="text-xs font-semibold">Save 20%</span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-center md:max-w-5xl mx-auto">
            {plans.map((plan, idx) => {
              // Calculate price based on billing cycle
              const price = plan.name === 'free' 
                ? 0 
                : isAnnual 
                  ? (plan.price * 12 * 0.8) 
                  : plan.price;
              
              const isHighlighted = plan.name === 'business' || plan.name === 'basic';
              
              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-8 shadow-md transition-all flex flex-col ${
                    isHighlighted
                      ? 'bg-black text-white scale-105 shadow-xl'
                      : plan.name === 'free'
                        ? 'bg-white text-gray-800 border border-gray-200'
                        : 'bg-black text-white'
                  }`}
                >
                  {plan.name === currentPlan && (
                    <div className="bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-full absolute top-4 right-4">
                      Current Plan
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold mb-1">{plan.title}</h2>
                    <p className="text-sm mb-6">{plan.description}</p>
                    
                    <p className="text-3xl font-bold mb-2">
                      {plan.name === 'free' ? (
                        'Free'
                      ) : (
                        <>
                          ${price.toFixed(2)}
                          <span className="text-sm font-normal text-white"> / {isAnnual ? 'year' : 'month'}</span>
                        </>
                      )}
                    </p>
                    
                    <ul className="text-left space-y-3 mt-6 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg 
                            className={`h-5 w-5 ${isHighlighted ? 'text-green-400' : 'text-green-500'} flex-shrink-0 mr-2`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`text-sm ${isHighlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => handleGetStarted(plan.name)}
                    disabled={isRedirecting || plan.name === currentPlan}
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      isHighlighted
                        ? 'bg-white text-black hover:bg-gray-200'
                        : plan.name === 'free'
                          ? 'bg-[#26293b] text-white hover:bg-[#313652]'
                          : 'bg-[#26293b] text-white hover:bg-[#313652]'
                    } ${(isRedirecting || plan.name === currentPlan) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isRedirecting 
                      ? 'Redirecting...' 
                      : plan.name === currentPlan 
                        ? 'Current Plan' 
                        : plan.name === 'free' 
                          ? 'Start for Free' 
                          : 'Get Started'}
                  </button>
                </div>
              );
            })}
          </div>
          
          <p className="text-sm text-gray-500 mt-8">
            All plans include our core learning tools. Upgrade anytime as your needs grow.
          </p>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto py-20 px-6 text-center bg-white">
          <h2 className="text-3xl font-bold mb-6">Features You'll Love</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-10">
            Every plan includes access to study guides, quizzes, flashcards, and AI insights to boost your learning.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Unlimited Study Guides</h3>
              <p className="text-gray-600">Create customized study materials from any content.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Generated Quizzes</h3>
              <p className="text-gray-600">Test your knowledge with smart, customized quizzes.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Flashcards</h3>
              <p className="text-gray-600">Review topics with spaced repetition for better retention.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-7xl mx-auto py-20 px-6 text-center bg-gray-100">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto text-left space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">What's the difference between the plans?</h3>
              <p className="text-gray-600">
                Our plans differ in file storage limits, advanced features, and priority support. 
                Free users can upload 3 files, Basic users get 999 files, and Business users can upload up to 9,999 files.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. 
                When downgrading, your new rate will apply at the next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}