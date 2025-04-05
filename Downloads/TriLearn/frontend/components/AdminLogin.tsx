import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    const autoLogin = async () => {
      const result = await signIn("admin-login", {
        redirect: false,
      });
      
      if (result?.ok) {
        router.push("/study-guide");
      }
    };

    autoLogin();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 