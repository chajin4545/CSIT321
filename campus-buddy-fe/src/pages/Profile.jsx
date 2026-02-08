import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Edit, Save, AlertCircle } from 'lucide-react';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'User Name',
    email: user?.email || 'user@university.edu',
    phone: '',
    address: '',
    office_hours: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.full_name || user?.name,
          email: data.email || user?.email,
          phone: data.phone || '',
          address: data.address || '',
          office_hours: data.office_hours || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          full_name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          office_hours: profileData.office_hours,
        }),
      });

      if (response.ok) {
        setSuccess('Profile Updated Successfully!');
        setIsEditing(false);
        // Refresh local data
        fetchProfile();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role || 'Guest';
  const id = user?.userId || 'ID';

  // Permission Logic
  const isStudentOrProf = role === 'student' || role === 'professor';
  const isAdmin = role === 'school_admin' || role === 'sys_admin';

  const canEditName = isAdmin;
  const canEditEmail = isAdmin;
  const canEditPhone = isAdmin || isStudentOrProf; 
  const canEditAddress = isStudentOrProf;
  const canEditOfficeHours = role === 'professor';

  return (
    <div className="flex flex-col h-full">
      <Header title="My Profile" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 w-full md:w-2/5 mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-600" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-700 text-sm">✓ {success}</span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User size={48} className="text-slate-400"/>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{profileData.name}</h2>
                    <p className="text-slate-500 capitalize">{role.replace('_', ' ')}</p>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* User ID (Always Read Only) */}
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">User ID</label>
                    <input 
                        type="text" 
                        value={id} 
                        disabled 
                        className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-sm"
                    />
                    </div>

                    {/* Name */}
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input 
                        type="text" 
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing || !canEditName}
                        className={`w-full p-3 rounded-lg border text-sm transition-colors ${
                        !isEditing || !canEditName 
                            ? 'bg-slate-100 border-slate-200 text-slate-500' 
                            : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                        }`}
                    />
                    </div>

                    {/* Email */}
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing || !canEditEmail}
                        className={`w-full p-3 rounded-lg border text-sm transition-colors ${
                        !isEditing || !canEditEmail 
                            ? 'bg-slate-100 border-slate-200 text-slate-500' 
                            : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                        }`}
                    />
                    </div>

                    {/* Phone Number */}
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input 
                        type="tel" 
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing || !canEditPhone}
                        className={`w-full p-3 rounded-lg border text-sm transition-colors ${
                        !isEditing || !canEditPhone 
                            ? 'bg-slate-100 border-slate-200 text-slate-500' 
                            : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                        }`}
                    />
                    </div>

                    {/* Address - Only visible for Student and Professor */}
                    {isStudentOrProf && (
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Home Address</label>
                        <textarea 
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing || !canEditAddress}
                        rows={2}
                        className={`w-full p-3 rounded-lg border text-sm transition-colors resize-none ${
                            !isEditing || !canEditAddress 
                            ? 'bg-slate-100 border-slate-200 text-slate-500' 
                            : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                        }`}
                        />
                    </div>
                    )}

                    {/* Office Hours - Only for Professor */}
                    {canEditOfficeHours && (
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Office Hours</label>
                        <input 
                            type="text" 
                            name="office_hours"
                            placeholder="e.g., Mon 2-4PM, Wed 3-5PM"
                            value={profileData.office_hours}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border text-sm transition-colors ${
                            !isEditing 
                                ? 'bg-slate-100 border-slate-200 text-slate-500' 
                                : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                            }`}
                        />
                    </div>
                    )}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                    {isEditing ? (
                    <div className="flex gap-3">
                        <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                        Cancel
                        </button>
                        <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                        <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                    ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={18} /> Edit Profile
                    </button>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
