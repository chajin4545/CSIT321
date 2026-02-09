import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Activity, MessageCircle, Clock, BarChart } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    dailyActiveUsers: 0,
    totalConversations: 0,
    avgResponseTime: '0s'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/sys-admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.token]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Usage Analytics" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
                { label: 'Total Users', value: loading ? '...' : stats.totalUsers, icon: Users, color: 'bg-blue-500' },
                { label: 'Daily Active Users (Today)', value: loading ? '...' : stats.dailyActiveUsers, icon: Activity, color: 'bg-green-500' },
                { label: 'Total Conversations (Today)', value: loading ? '...' : stats.totalConversations, icon: MessageCircle, color: 'bg-purple-500' },
                { label: 'AVG Response Time', value: loading ? '...' : stats.avgResponseTime, icon: Clock, color: 'bg-orange-500' },
            ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                    <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-${stat.color.replace('bg-', '')}`}>
                    <stat.icon size={24} className={`text-${stat.color.replace('bg-', 'text-')}`} /> 
                    </div>
                </div>
                </div>
            ))}
            </div>
            
            {/* Placeholder for chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex flex-col items-center justify-center text-slate-400">
            <BarChart size={48} className="mb-4 opacity-50" />
            <p>Usage Analytics Chart Placeholder</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
