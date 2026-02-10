import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClerkAvailableContext } from "@/lib/clerk-context";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

function canUseClerk(): boolean {
  if (!PUBLISHABLE_KEY) return false;

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (hostname.includes(".replit.") || hostname.includes(".repl.co") || hostname.includes(".kirk.") || hostname.includes(".picard.")) return true;
  if (hostname === "morse.co.in" || hostname.endsWith(".morse.co.in")) return true;

  return false;
}

const clerkEnabled = canUseClerk();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ClerkAvailableContext.Provider value={clerkEnabled}>
      {clerkEnabled ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY!}>
          <App />
        </ClerkProvider>
      ) : (
        <App />
      )}
    </ClerkAvailableContext.Provider>
  </ErrorBoundary>
);
