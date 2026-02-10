import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect, useCallback } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { ErrorBoundary, RecoverableErrorBoundary } from "@/components/ErrorBoundary";
import { ClerkAvailableContext } from "@/lib/clerk-context";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

function Root() {
  const [clerkEnabled, setClerkEnabled] = useState(!!PUBLISHABLE_KEY);

  const disableClerk = useCallback(() => {
    console.warn("Clerk failed to initialize. Running without authentication.");
    setClerkEnabled(false);
  }, []);

  useEffect(() => {
    if (!clerkEnabled) return;

    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = String(e.reason?.message || e.reason || "");
      if (
        msg.includes("Clerk") ||
        msg.includes("clerk") ||
        msg.includes("Production Keys") ||
        msg.includes("HTTP Origin header")
      ) {
        e.preventDefault();
        disableClerk();
      }
    };

    const handleError = (e: ErrorEvent) => {
      const msg = String(e.message || "");
      if (
        msg.includes("Clerk") ||
        msg.includes("clerk") ||
        msg.includes("Production Keys")
      ) {
        e.preventDefault();
        disableClerk();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, [clerkEnabled, disableClerk]);

  if (clerkEnabled && PUBLISHABLE_KEY) {
    return (
      <ClerkAvailableContext.Provider value={true}>
        <RecoverableErrorBoundary onRecover={disableClerk}>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
          </ClerkProvider>
        </RecoverableErrorBoundary>
      </ClerkAvailableContext.Provider>
    );
  }

  return (
    <ClerkAvailableContext.Provider value={false}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ClerkAvailableContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
