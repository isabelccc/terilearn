import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlanUsageWidget() {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await fetch('/api/user/plan-usage');
        if (response.ok) {
          const data = await response.json();
          setPlanData(data);
        } else {
          console.error('Failed to fetch plan data');
        }
      } catch (error) {
        console.error('Error fetching plan data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlanData();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
        <p className="text-gray-400">Loading plan information...</p>
      </div>
    );
  }
  
  if (!planData) {
    return (
      <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
        <p className="text-gray-400">Unable to load plan information</p>
      </div>
    );
  }
  
  // Format date properly
  const subscriptionEnd = planData.subscriptionEnd 
    ? new Date(planData.subscriptionEnd).toLocaleDateString() 
    : 'N/A';
  
  return (
    <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333333]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">Your Plan</h3>
        <span className="text-sm px-2 py-1 bg-[#333333] rounded-full text-white capitalize">
          {planData.planType}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Storage usage ({planData.filesUploaded} / {planData.maxFiles} files)</span>
          <span>{planData.percentUsed}%</span>
        </div>
        <div className="w-full bg-[#333333] rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              planData.percentUsed > 90 ? 'bg-red-500' : 'bg-[#c8a2d6]'
            }`}
            style={{ width: `${planData.percentUsed}%` }}
          ></div>
        </div>
      </div>
      
      {planData.subscriptionEnd && (
        <p className="text-sm text-gray-400 mb-4">
          Subscription renewal: {subscriptionEnd}
        </p>
      )}
      
      {planData.percentUsed > 80 && (
        <Link 
          href="/plans" 
          className="block w-full text-center bg-[#c8a2d6] hover:bg-[#b48ac4] text-black font-medium py-2 px-4 rounded-md transition-colors"
        >
          Upgrade Plan
        </Link>
      )}
    </div>
  );
} 