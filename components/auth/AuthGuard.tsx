"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps any page that requires authentication.
 * If the user is not logged in, redirects to /login with a `next` param
 * so after login they return to the page they were trying to visit.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    }
    checkSession();
  }, [router, pathname]);

  if (checking) {
    // Show a minimal branded loading state while checking session
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <span className="font-cormorant text-2xl font-semibold text-gold">LUNÉVIA</span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-gold/20">
            <div className="h-full animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gold/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
