import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Star } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Feedback = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { average: 0, total: 0, negative: '0%' },
    feedbacks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/sys-admin/feedback', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (response.ok) {
            const result = await response.json();
            setData(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [user.token]);

  return (
    <div className="flex flex-col h-full">
      <Header title="User Feedback" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                <p className="text-slate-500 text-sm mb-1">Average Rating</p>
                <div className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
                {data.stats.average} <Star className="fill-yellow-400 text-yellow-400" size={28} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                <p className="text-slate-500 text-sm mb-1">Total Submissions</p>
                <div className="text-4xl font-bold text-slate-800">{data.stats.total}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                <p className="text-slate-500 text-sm mb-1">Negative Feedback (1-2 Stars)</p>
                <div className="text-4xl font-bold text-red-600">{data.stats.negative}</div>
            </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Recent User Feedback</h3>
            <div className="overflow-x-auto">
                {loading ? <p className="text-slate-500 p-4">Loading...</p> : (
                <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Conversation ID</th>
                    <th className="p-3 w-1/3">Comment</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.feedbacks.map((fb, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-500">{fb.date}</td>
                        <td className="p-3 font-mono text-xs">{fb.uid}</td>
                        <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{fb.role || 'Unknown'}</span></td>
                        <td className="p-3 flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < fb.rating ? 'fill-current' : 'text-slate-200'} />
                        ))}
                        </td>
                        <td className="p-3 font-mono text-xs text-blue-600">{fb.cid}</td>
                        <td className="p-3 text-slate-700 italic">"{fb.comment}"</td>
                    </tr>
                    ))}
                    {data.feedbacks.length === 0 && (
                        <tr><td colSpan="6" className="p-4 text-center text-slate-400">No feedback found.</td></tr>
                    )}
                </tbody>
                </table>
                )}
            </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
