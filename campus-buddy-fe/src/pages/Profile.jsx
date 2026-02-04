import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Edit, Save } from 'lucide-react';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Default values or from user context
  const [profileData, setProfileData] = useState({
    name: user?.name || 'User Name',
    email: user?.email || 'user@university.edu',
    phone: '8941-1234',
    address: '123 University Ave, Campus'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Logic to save data would go here
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  const role = user?.role || 'Guest';
  const id = user?.id || 'ID';

  // Permission Logic
  const isStudentOrProf = role === 'student' || role === 'professor';
  const isAdmin = role === 'school_admin' || role === 'sys_admin';

  const canEditName = isAdmin;
  const canEditEmail = isAdmin;
  const canEditPhone = isAdmin || isStudentOrProf; 
  const canEditAddress = isStudentOrProf;

  return (
    <div className="flex flex-col h-full">
      <Header title="My Profile" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 w-full md:w-2/5 mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User size={48} className="text-slate-400"/>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{profileData.name}</h2>
                    <p className="text-slate-500 capitalize">{role.replace('_', ' ')}</p>
                </div>
                
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
                </div>

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
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                        <Save size={18} /> Save Changes
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
