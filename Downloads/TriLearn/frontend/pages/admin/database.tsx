import { useSession } from "next-auth/react";
import Head from 'next/head';
import VerticalNavbar from '../../components/v_navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

export default function DatabaseDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/files/stats');
        const data = await response.json();
        setStats(data.stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Process data for charts
  const chartData = {
    labels: stats.map(item => item._id),
    datasets: [
      {
        label: 'File Count by Type',
        data: stats.map(item => item.count),
        backgroundColor: 'rgba(200, 162, 214, 0.6)',
        borderColor: 'rgba(200, 162, 214, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Database Dashboard - TriLearn</title>
      </Head>
      <div className="flex min-h-screen bg-black">
        <VerticalNavbar />
        
        <main className="flex-1 p-8 text-white">
          <h1 className="text-3xl font-bold mb-6">MongoDB Dashboard</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c8a2d6]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333333]">
                <h2 className="text-xl font-semibold mb-4">File Storage by Type</h2>
                <div className="h-80">
                  <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              
              <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333333]">
                <h2 className="text-xl font-semibold mb-4">Storage Usage Details</h2>
                <table className="w-full">
                  <thead className="bg-[#252525] text-gray-300 text-left">
                    <tr>
                      <th className="p-3">File Type</th>
                      <th className="p-3">Count</th>
                      <th className="p-3">Total Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333333]">
                    {stats.map((item, index) => (
                      <tr key={index} className="hover:bg-[#252525]">
                        <td className="p-3">{item._id}</td>
                        <td className="p-3">{item.count}</td>
                        <td className="p-3">{formatSize(item.totalSize)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
} 