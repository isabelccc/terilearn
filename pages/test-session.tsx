import { useSession } from "next-auth/react";

export default function TestSession() {
  const { data: session, status } = useSession();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Session Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        Status: {status}
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
} 