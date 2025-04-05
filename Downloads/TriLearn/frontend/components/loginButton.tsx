import { signIn } from "next-auth/react";
import Image from "next/image";

interface LoginButtonProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const GoogleLoginButton = ({ isLoading, setIsLoading }: LoginButtonProps) => {
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/mainpage" });
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
      disabled={isLoading}
    >
      <Image
        src="/icons/google.svg"
        alt="Google"
        width={20}
        height={20}
        className="w-5 h-5"
      />
      <span className="text-gray-700 font-medium">
        Continue with Google
      </span>
    </button>
  );
};

export const GitHubLoginButton = ({ isLoading, setIsLoading }: LoginButtonProps) => {
  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("github", { callbackUrl: "/mainpage" });
    } catch (error) {
      console.error("GitHub login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGithubLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 relative"
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <Image
            src="/icons/github.svg"
            alt="GitHub"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">
            Continue with GitHub
          </span>
        </>
      )}
    </button>
  );
};