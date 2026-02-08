import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Schedule = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/professor/schedule', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Teaching Schedule" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="animate-spin text-blue-600" />
              </div>
            ) : schedule.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No classes scheduled</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">Venue</th>
                      <th className="p-3">Group</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedule.map((cls, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-700">{formatDate(cls.specific_date)}</td>
                        <td className="p-3 text-slate-500">
                          {cls.start_time} - {cls.end_time}
                        </td>
                        <td className="p-3 font-medium text-blue-600">{cls.module_code}</td>
                        <td className="p-3 text-slate-700">{cls.venue}</td>
                        <td className="p-3 text-slate-700">{cls.group_id || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
