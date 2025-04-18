import { useSession } from "next-auth/react";
import Head from 'next/head';
import VerticalNavbar from '../components/v_navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type File = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  path: string;
};

export default function FilesPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFiles(data.files);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Error loading files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePreview = (file: File) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setFiles(files.filter(file => file.id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file. Please try again.');
    }
  };

  const isImageFile = (type: string) => {
    return type.startsWith('image/');
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>My Files - TriLearn</title>
      </Head>
      <div className="flex min-h-screen bg-black">
        <VerticalNavbar />
        
        <main className="flex-1 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Files</h1>
            
            <Link href="/upload" className="bg-[#c8a2d6] hover:bg-[#b48ac4] text-white font-medium py-2 px-4 rounded-md transition-colors">
              Upload New Files
            </Link>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-lg border border-[#333333] overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c8a2d6]"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">{error}</div>
            ) : files.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>You haven't uploaded any files yet.</p>
                <Link href="/upload" className="text-[#c8a2d6] hover:text-[#b48ac4] mt-2 inline-block">
                  Upload your first file
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#252525] text-gray-300 text-left">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Uploaded</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-[#252525]">
                      <td className="p-4 flex items-center">
                        <span className="text-2xl mr-2">
                          {file.type?.includes('pdf') ? '📄' : 
                           file.type?.includes('doc') ? '📝' : 
                           file.type?.includes('video') ? '🎥' : 
                           file.type?.includes('image') ? '🖼️' : 
                           '📁'}
                        </span>
                        <span className="text-gray-300">{file.name}</span>
                      </td>
                      <td className="p-4 text-gray-400">{formatFileSize(file.size)}</td>
                      <td className="p-4 text-gray-400">{file.type.split('/')[1]}</td>
                      <td className="p-4 text-gray-400">{formatDate(file.uploadedAt)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {isImageFile(file.type) ? (
                            <button 
                              onClick={() => handlePreview(file)} 
                              className="text-[#c8a2d6] hover:text-[#b48ac4]"
                            >
                              Preview
                            </button>
                          ) : (
                            <a 
                              href={`/api/files/download/${file.id}`} 
                              className="text-[#c8a2d6] hover:text-[#b48ac4]"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </a>
                          )}
                          <button 
                            onClick={() => handleDelete(file.id)} 
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Image Preview Modal */}
      {showPreview && previewFile && isImageFile(previewFile.type) && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-[#333333]">
              <h2 className="text-xl font-semibold text-white">{previewFile.name}</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center">
              <img 
                src={`/api/files/download/${previewFile.id}`} 
                alt={previewFile.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-4 border-t border-[#333333] flex justify-between">
              <div className="text-gray-400">
                {formatFileSize(previewFile.size)} • {previewFile.type}
              </div>
              <a 
                href={`/api/files/download/${previewFile.id}`}
                download={previewFile.name}
                className="bg-[#c8a2d6] hover:bg-[#b48ac4] text-white px-4 py-2 rounded"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 