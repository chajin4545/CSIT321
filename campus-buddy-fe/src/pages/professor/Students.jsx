import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Students = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchModules();
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchStudentsByModule(selectedModule);
    } else {
      fetchAllStudents();
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/professor/classes', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  };

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/professor/students', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByModule = async (moduleCode) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/professor/students/${moduleCode}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="flex flex-col h-full">
      <Header title="Class/Student View" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex gap-3 w-full md:w-auto flex-1">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={selectedModule}
                    onChange={(e) => {
                      setSelectedModule(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Classes</option>
                    {modules.map((mod) => (
                      <option key={mod.module_code} value={mod.module_code}>
                        {mod.module_code}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        {selectedModule && <th className="p-3">Class</th>}
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Student ID</th>
                        <th className="p-3">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((student, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            {selectedModule && (
                              <td className="p-3">
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">
                                  {student.module_code}
                                </span>
                              </td>
                            )}
                            <td className="p-3 font-medium text-slate-800">{student.full_name}</td>
                            <td className="p-3 text-slate-600">{student.student_id}</td>
                            <td className="p-3 text-slate-500">{student.email}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={selectedModule ? 4 : 3} className="p-3 text-center text-slate-500">
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-slate-600">
                      Page {totalPages > 0 ? currentPage : 0} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Students;
