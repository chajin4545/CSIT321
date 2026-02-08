import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Folder, ArrowLeft, FileText, Upload, Trash2, AlertCircle, X } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Modules = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInput, setFileInput] = useState({ title: '', category: '' });
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchMaterials(selectedModule);
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/professor/classes', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      
      // Read as text first to avoid JSON parse errors on empty/non-JSON responses
      const text = await response.text();
      if (!text) {
        console.error('Empty response body from /api/professor/classes', response.status);
        setError(`Failed to load modules: empty response (status ${response.status})`);
        return;
      }

      try {
        const data = JSON.parse(text);
        setModules(data);
        if (Array.isArray(data) && data.length > 0 && !selectedModule) {
          setSelectedModule(data[0].module_code);
        }
      } catch (parseErr) {
        setError(`Failed to load modules: invalid JSON response`);
      }
    } catch (err) {
      setError(`Error fetching modules: ${err.message}`);
    }
  };

  const fetchMaterials = async (moduleCode) => {
    try {
      const response = await fetch(`/api/professor/classes`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        const text = await response.text();
        if (!text) return;
        let data;
        try {
          data = JSON.parse(text);
        } catch (pErr) {
          return;
        }
        const module = data.find((m) => m.module_code === moduleCode);
        if (module) {
          setMaterials((prev) => ({
            ...prev,
            [moduleCode]: module.materials || [],
          }));
        }
      }
    } catch (err) {
      // Silently fail on material fetch
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('File size exceeds 50MB limit');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError('');

    if (!fileInput.title.trim()) {
      setUploadError('Please enter a file title');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select a file');
      return;
    }

    if (!fileInput.category) {
      setUploadError('Category is required');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Validate moduleCode
      if (!selectedModule) {
        setUploadError('Please select a module');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', fileInput.title);
      formData.append('moduleCode', selectedModule);
      formData.append('category', fileInput.category);

      // Simulate upload progress (in real app, track XMLHttpRequest progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 200);

      const response = await fetch('/api/professor/materials', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        // Simulate file URL from response or generate one
        const fileUrl = URL.createObjectURL(selectedFile);
        
        fetchMaterials(selectedModule);
        resetUploadForm();
        setShowUploadModal(false);
        
        setTimeout(() => setUploadProgress(0), 500);
      } else {
        const data = await response.json();
        setUploadError(data.message || 'Failed to upload file');
      }
    } catch (err) {
      setUploadError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setFileInput({ title: '', category: '' });
    setUploadError('');
    setUploadProgress(0);
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/professor/materials/${selectedModule}/${materialId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.ok) {
        fetchMaterials(selectedModule);
      } else {
        setError('Failed to delete material');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryFolders = [
    { key: 'Lecture Notes', label: 'Lessons', icon: '📚', color: 'blue' },
    { key: 'Labs', label: 'Labs', icon: '🔬', color: 'yellow' },
    { key: 'Assignments', label: 'Assignments', icon: '📋', color: 'green' },
  ];

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderRoot = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categoryFolders.map((folder) => (
        <div
          key={folder.key}
          onClick={() => setCurrentFolder(folder.key)}
          className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-${folder.color}-50 hover:border-${folder.color}-200 transition-all group`}
        >
          <Folder size={64} className={`text-${folder.color}-400 group-hover:text-${folder.color}-600 mb-4`} />
          <h3 className="font-bold text-lg text-slate-800">{folder.label}</h3>
          <p className="text-sm text-slate-500">{materials[selectedModule]?.filter((m) => m.category === folder.key).length || 0} files</p>
        </div>
      ))}
    </div>
  );

  const getCurrentMaterials = () => {
    return materials[selectedModule]?.filter((m) => m.category === currentFolder) || [];
  };

  const renderFiles = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col relative">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => setCurrentFolder(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <span className="text-slate-400">/</span>
        <span className="font-bold text-slate-800">{currentFolder}</span>
      </div>

      {error && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} className="text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="p-4 space-y-2 flex-1">
        {getCurrentMaterials().map((file) => (
          <div key={file._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors group">
            <div className="flex items-center gap-3 flex-1">
              <FileText size={20} className="text-slate-400 group-hover:text-slate-600" />
              <div className="flex-1">
                <a
                  href={file.file_url || file.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 font-medium hover:underline"
                >
                  {file.title}
                </a>
                <p className="text-xs text-slate-500">
                  {file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : 'Unknown date'}
                  {file.file_size && ` • ${formatFileSize(file.file_size)}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => setPreviewFile(file)}
                className="p-2 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(file._id)}
                className="p-2 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                disabled={loading}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {getCurrentMaterials().length === 0 && (
          <p className="text-slate-500 text-center py-8">No materials uploaded yet</p>
        )}
      </div>

      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => {
            if (!selectedModule) {
              setUploadError('Please select a module first');
              return;
            }
            setFileInput({ ...fileInput, category: currentFolder });
            setShowUploadModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-transform hover:scale-105"
        >
          <Upload size={20} />
          <span>Upload File</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Upload Material</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="p-1 hover:bg-slate-100 rounded text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-red-700 text-sm">{uploadError}</span>
                </div>
              )}

              {/* Category Display */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                <div className="p-3 bg-slate-100 rounded-lg text-slate-700 font-medium">
                  {fileInput.category}
                </div>
              </div>

              {/* File Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">File Title</label>
                <input
                  type="text"
                  placeholder="e.g., Week 1 Lecture Notes"
                  value={fileInput.title}
                  onChange={(e) => setFileInput({ ...fileInput, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* File Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select File</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {selectedFile ? (
                      <>
                        <FileText size={32} className="text-green-500 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
                      </>
                    ) : (
                      <>
                        <Upload size={32} className="text-slate-400 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">Click to select file</p>
                        <p className="text-xs text-slate-500">or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">Max 50MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.zip"
                  />
                </label>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">Uploading...</span>
                    <span className="text-xs text-slate-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="flex-1 border border-slate-300 text-slate-700 p-2 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedFile}
                  className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Preview: {previewFile.title}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.file_url || previewFile.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-sm text-blue-600 hover:underline mr-2"
                >
                  Download
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-4">
              {(() => {
                const mime = previewFile.mime_type || previewFile.mimeType || '';
                const url = previewFile.file_url || previewFile.fileUrl || '';
                const isImage = mime.startsWith('image/') || /\.(png|jpe?g|gif)$/i.test(url);
                const isPdf = mime === 'application/pdf' || /\.pdf$/i.test(url);

                if (isImage) {
                  return (
                    <img src={url} alt={previewFile.title} className="w-full h-auto max-h-[70vh] object-contain" />
                  );
                }

                if (isPdf) {
                  return (
                    <iframe src={url} title={previewFile.title} className="w-full h-[80vh]" />
                  );
                }

                return (
                  <div className="p-6 text-center text-slate-600">
                    <p>Preview not available for this file type.</p>
                    <p className="mt-2">You can download it using the Download link.</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header title="Module Management" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          <div className="flex justify-end items-center">
            {modules.length === 0 ? (
              <div className="text-slate-500 text-sm">
                {error ? 'Failed to load modules' : 'Loading modules...'}
              </div>
            ) : (
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="bg-white border border-slate-300 text-sm font-medium rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option value="">-- Select a Module --</option>
                {modules.map((mod) => (
                  <option key={mod.module_code} value={mod.module_code}>
                    {mod.module_code}: {mod.module_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {selectedModule && (currentFolder === null ? renderRoot() : renderFiles())}
        </div>
      </main>
    </div>
  );
};

export default Modules;
