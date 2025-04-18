import ProtectedRoute from '../components/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>
        This content is only visible to logged-in users
      </div>
    </ProtectedRoute>
  );
} 