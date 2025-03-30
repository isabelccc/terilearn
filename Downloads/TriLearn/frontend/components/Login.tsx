import { signIn } from "next-auth/react";

// components/GoogleLoginButton.tsx (for example)




const GoogleLoginButton = () => {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
      className="flex items-center gap-3 px-4 py-2 bg-gray-100 border-2 border-black rounded hover:bg-gray-200"
    >
      <img src="icons/google.svg" alt="Google" className="w-5 h-5" />
      <span className="text-sm font-medium">Continue with Google</span>
    </button>
  );
};

const GitHubLoginButton = () => {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/onboarding" })}
      className="flex items-center gap-3 px-4 py-2 bg-gray-100 border-2 border-black rounded hover:bg-gray-200"
    >
      <img src="icons/github.svg" alt="GitHub" className="w-5 h-5" />
      <span className="text-sm font-medium">Continue with GitHub</span>
    </button>
  );
};

export { GoogleLoginButton, GitHubLoginButton };