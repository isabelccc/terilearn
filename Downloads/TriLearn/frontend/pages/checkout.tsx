import { useSession } from "next-auth/react";
import Head from 'next/head';
import VerticalNavbar from '../components/v_navbar';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getPlanByName, Plan } from '../lib/plans';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { plan: planName, billing } = router.query;
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  
  useEffect(() => {
    if (planName && typeof planName === 'string') {
      setSelectedPlan(getPlanByName(planName as any));
    }
    
    if (billing === 'yearly') {
      setIsYearly(true);
    }
  }, [planName, billing]);
  
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }
  }, [status, router]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here you would integrate with a payment processor like Stripe
    alert('This is where payment processing would happen');
    
    // After successful payment, update the user's plan in the database
    try {
      const response = await fetch('/api/user/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: selectedPlan?.name,
          isYearly,
        }),
      });
      
      if (response.ok) {
        router.push('/mainpage?upgrade=success&plan=' + selectedPlan?.name);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('An error occurred');
    }
  };
  
  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your plan details...</p>
        </div>
      </div>
    );
  }
  
  const price = isYearly 
    ? (selectedPlan.price * 12 * 0.8).toFixed(2) 
    : selectedPlan.price.toFixed(2);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {session && <VerticalNavbar />}
      
      <div className={`mx-auto max-w-3xl px-4 py-16 ${session ? 'ml-72' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete Your Subscription</h1>
          <p className="text-gray-400 mt-2">You're just one step away from upgrading to {selectedPlan.title}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#121212] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="border-t border-gray-800 py-4">
              <div className="flex justify-between mb-2">
                <span>{selectedPlan.title} Plan ({isYearly ? 'Yearly' : 'Monthly'})</span>
                <span>${price}</span>
              </div>
              
              <div className="flex justify-between text-gray-500 text-sm mb-2">
                <span>File limit</span>
                <span>Up to {selectedPlan.maxFiles.toLocaleString()} files</span>
              </div>
              
              {isYearly && (
                <div className="flex justify-between text-green-500 text-sm">
                  <span>Yearly discount (20%)</span>
                  <span>-${(selectedPlan.price * 12 * 0.2).toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-800 py-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${price}</span>
              </div>
              <div className="text-gray-500 text-sm">
                {isYearly ? 'Billed annually' : 'Billed monthly'}
              </div>
            </div>
          </div>
          
          <div className="bg-[#121212] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Card Number</label>
                <input type="text" className="w-full bg-[#1d1d1d] border border-gray-800 rounded p-2" placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 mb-2">Expiry Date</label>
                  <input type="text" className="w-full bg-[#1d1d1d] border border-gray-800 rounded p-2" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">CVC</label>
                  <input type="text" className="w-full bg-[#1d1d1d] border border-gray-800 rounded p-2" placeholder="123" />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-[#c8a2d6] hover:bg-[#b48ac4] text-black font-semibold py-3 rounded mt-4">
                Complete Payment
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Your card will be charged ${price} {isYearly ? 'yearly' : 'monthly'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 