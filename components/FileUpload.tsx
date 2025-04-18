import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface FileWithProgress extends File {
  progress?: number;
  status?: 'uploading' | 'done' | 'error';
}

export default function FileUpload() {
  const router = useRouter();
  const { data: session } = useSession();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userPlanInfo, setUserPlanInfo] = useState(null);

  const handleClose = () => {
    router.push('/mainpage');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    const newFiles = acceptedFiles.map(file => ({
      ...file,
      progress: 0,
      status: 'uploading' as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/svg+xml': ['.svg'],
      'image/webp': ['.webp']
    },
    multiple: true,
  });

  useEffect(() => {
    // Fetch user's plan info when component mounts
    const fetchUserPlan = async () => {
      try {
        const response = await fetch('/api/user/plan-info');
        if (response.ok) {
          const data = await response.json();
          setUserPlanInfo(data);
        }
      } catch (error) {
        console.error('Error fetching plan info:', error);
      }
    };
    
    if (session) {
      fetchUserPlan();
    }
  }, [session]);

  const handleUpload = async () => {
    if (!files.length) return;
    
    // Check if uploading these files would exceed the user's limit
    if (userPlanInfo && userPlanInfo.filesUploaded + files.length > userPlanInfo.maxFiles) {
      setShowUpgradeModal(true);
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      // Create FormData to send files
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });
      
      // Add description if needed
      formData.append('description', 'Uploaded via dashboard');
      
      // Create XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          
          // Update all files with the same progress for simplicity
          // For multiple files, you'd need to track each file's progress separately
          setFiles(prevFiles => 
            prevFiles.map(file => ({
              ...file,
              progress: percentComplete,
              status: percentComplete === 100 ? 'done' : 'uploading'
            }))
          );
        }
      });
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          const response = JSON.parse(xhr.responseText);
          console.log('Upload successful:', response);
          
          setFiles(files.map(file => ({
            ...file,
            progress: 100,
            status: 'done'
          })));
          
          // Redirect after successful upload
          setTimeout(() => {
            router.push('/files');
          }, 1500);
        } else {
          // Handle server errors
          const errorData = JSON.parse(xhr.responseText);
          throw new Error(errorData.message || 'Failed to upload files');
        }
      });
      
      // Handle network errors
      xhr.addEventListener('error', () => {
        throw new Error('Network error occurred during upload');
      });
      
      // Open and send the request
      xhr.open('POST', '/api/upload', true);
      xhr.send(formData);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading files');
      
      // Update file statuses to error
      setFiles(files.map(file => ({
        ...file,
        status: 'error'
      })));
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg shadow-lg border border-[#333333] text-white">
      {/* Header with Close Button - adjusted size */}
      <div className="flex items-center justify-between p-3">
        <h2 className="text-xl font-semibold">Upload Files</h2>
        <button
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-full hover:bg-[#333333] ml-auto"
          aria-label="Close and return to dashboard"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              d="M18 6L6 18M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Drag Zone */}
        <div
          {...getRootProps()}
          className={`
            relative
            border-2 border-dashed
            rounded-lg
            p-16
            transition-all duration-200 ease-in-out
            cursor-pointer
            ${isDragActive && isDragAccept && 'border-[#c8a2d6] bg-[#2d2535]'}
            ${isDragActive && isDragReject && 'border-red-500 bg-[#3d2529]'}
            ${!isDragActive && 'border-gray-600 hover:border-gray-500'}
            flex flex-col items-center justify-center
            min-h-[300px]
            w-full
          `}
        >
          <input {...getInputProps()} />

          {/* Background Image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <Image
              src="/file_user.png"
              alt="Upload background"
              width={350}
              height={350}
              className="object-contain"
            />
          </div>

          {/* Upload Icon and Text */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6">
              <div className="p-5 rounded-full">
                <svg 
                  className="w-10 h-10 text-gray-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>

            {isDragActive ? (
              <div className="text-center">
                {isDragAccept ? (
                  <p className="text-xl font-medium text-gray-300">Drop files to upload</p>
                ) : (
                  <p className="text-xl font-medium text-red-400">Some files are not supported</p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl font-medium text-gray-300 mb-2">
                  Drop your files here
                </p>
                <p className="text-base text-gray-400">
                  or <span className="text-[#c8a2d6] hover:text-[#b48ac4]">browse</span> to choose files
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  Supported formats: Images (JPG, PNG, GIF), Documents (PDF, DOCX), Videos (MP4, MOV), and Text files
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="p-3 bg-[#252525] rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {file.type?.includes('pdf') ? '📄' : 
                       file.type?.includes('doc') ? '📝' : 
                       file.type?.includes('video') ? '🎥' : 
                       file.type?.includes('image') ? '🖼️' : 
                       '📁'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-300">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size && !isNaN(file.size)) 
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
                          : 'Size unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {file.status === 'done' && (
                      <span className="text-green-500 mr-2">✓</span>
                    )}
                    {file.status === 'error' && (
                      <span className="text-red-500 mr-2">✗</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles(files.filter((_, i) => i !== index));
                      }}
                      disabled={uploading}
                      className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeWidth={2}
                          stroke="currentColor"
                          fill="none"
                          d="M18 6L6 18M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      file.status === 'error' ? 'bg-red-500' : 'bg-[#c8a2d6]'
                    }`}
                    style={{ width: `${file.progress || 0}%` }}
                  ></div>
                </div>
                
                {/* Progress Text */}
                {(file.status === 'uploading' || file.status === 'done') && (
                  <div className="mt-1 text-xs text-gray-400 text-right">
                    {file.progress}% {file.status === 'uploading' ? 'uploading...' : 'completed'}
                  </div>
                )}
                {file.status === 'error' && (
                  <div className="mt-1 text-xs text-red-400 text-right">
                    Upload failed
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`
                mt-4 w-full py-2 px-4 rounded-lg transition-colors
                ${uploading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-[#c8a2d6] hover:bg-[#b48ac4]'
                }
                text-white
              `}
            >
              {uploading 
                ? `Uploading... ${Math.round(files.reduce((acc, file) => acc + (file.progress || 0), 0) / files.length)}%` 
                : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`
              }
            </button>
          </div>
        )}
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">File Upload Limit Reached</h2>
            <p className="text-gray-300 mb-4">
              Your current {userPlanInfo.planType} plan allows up to {userPlanInfo.maxFiles} files. 
              You've already uploaded {userPlanInfo.filesUploaded} files.
            </p>
            <p className="text-gray-300 mb-6">
              Upgrade your plan to upload more files.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <Link
                href="/pricing"
                className="px-4 py-2 bg-[#c8a2d6] hover:bg-[#b48ac4] text-black rounded font-medium"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 