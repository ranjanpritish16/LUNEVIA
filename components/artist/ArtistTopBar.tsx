"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function ArtistTopBar() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ? { id: user.id, email: user.email } : null);
      setReady(true);
    });

    // Keep in sync with auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/artist/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gold/15 bg-cream px-5 md:px-8">
      {/* Left — wordmark */}
      {user ? (
        <Link
          href="/artist/dashboard"
          className="font-cormorant text-xl font-semibold tracking-wide text-gold transition-opacity hover:opacity-80"
        >
          LUNÉVIA
        </Link>
      ) : (
        <span className="font-cormorant text-xl font-semibold tracking-wide text-gold">
          LUNÉVIA
        </span>
      )}

      {/* Right */}
      {ready && (
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Artist portal pill */}
              <span className={cn(
                "hidden rounded-full border border-gold/25 bg-blush px-3 py-1 sm:inline-flex",
                "font-dm-sans text-[10px] font-semibold uppercase tracking-widest text-gold"
              )}>
                Artist Portal
              </span>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="font-dm-sans text-sm text-charcoal/50 transition-colors hover:text-rose"
              >
                Sign Out
              </button>
            </>
          ) : (
            /* Not authenticated — shown on /artist/login */
            <Link
              href="/login/customer"
              className="font-dm-sans text-sm text-charcoal/50 transition-colors hover:text-gold"
            >
              Looking to book an artist?{" "}
              <span className="font-medium text-gold">Go to LUNÉVIA →</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
