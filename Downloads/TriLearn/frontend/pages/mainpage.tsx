import { useSession, signOut } from "next-auth/react";
import Head from 'next/head';
import VerticalNavbar from '../components/v_navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../components/Dashboard';
import PlanUsageWidget from '../components/PlanUsageWidget';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function MainPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { upgrade, plan } = router.query;
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState('');

  useEffect(() => {
    if (upgrade === 'success' && plan) {
      setShowUpgradeSuccess(true);
      setUpgradedPlan(typeof plan === 'string' ? plan : '');
      
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('upgrade');
      url.searchParams.delete('plan');
      window.history.replaceState({}, '', url.toString());
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowUpgradeSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [upgrade, plan]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <ProtectedRoute>
      <Head>
        <title className="text-black">Dashboard - TriLearn</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </Head>
      <div className="flex min-h-screen bg-[#121212]">
        {/* Vertical Navbar on the left */}
        <VerticalNavbar />
        
        {/* Main content area */}
        <main className="flex-1 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl text-black font-bold">Welcome, {session?.user?.name || 'Learner'}!</h1>
            
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          {showUpgradeSuccess && (
            <div className="bg-green-900 bg-opacity-20 border border-green-600 text-green-500 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <span className="font-medium">Success!</span> Your subscription has been upgraded to the {upgradedPlan} plan.
              </div>
            </div>
          )}
          
          {/* Your dashboard content here */}
          <Dashboard />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First two grid items */}
            
            {/* Add the plan usage widget */}
            <div>
              <PlanUsageWidget />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}