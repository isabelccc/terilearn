import { useSession } from "next-auth/react";
import Head from 'next/head';
import VerticalNavbar from '../components/v_navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import FileUpload from '../components/FileUpload';

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Upload Files - TriLearn</title>
      </Head>
      <div className="flex min-h-screen bg-black">
        {/* Vertical Navbar on the left */}
        <VerticalNavbar />
        
        {/* Main content area */}
        <main className="flex-1 p-8 text-white">
          <h1 className="text-3xl font-bold mb-6">Upload Files</h1>
          
          <FileUpload />
        </main>
      </div>
    </ProtectedRoute>
  );
} 