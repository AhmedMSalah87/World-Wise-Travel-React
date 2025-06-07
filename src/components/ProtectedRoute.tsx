import { SignedIn, SignedOut } from "@clerk/clerk-react";
import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToLogin />
      </SignedOut>
    </>
  );
}

// This small component only runs if user is signed out
function RedirectToLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login"); // now this only runs if user is logged out
  }, [navigate]);
  return null; // this component doesn't render anything on the screen
}

export default ProtectedRoute;
