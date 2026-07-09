"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { generateGuestId } from "@/lib/generateGuest";
import { User } from "@/interface/userData";

type UserContextType = {
  user: User | null;
  loading: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const u = data.session.user;

        setUser({
          id: u.id,
          name:
            u.user_metadata?.full_name ||
            u.email ||
            "User",
          isGuest: false,
        });

        setLoading(false);
        return;
      }

      // Recovery guest from localStorage
      const storedGuest = await localStorage.getItem("guest");


      if (storedGuest) {
        setUser(JSON.parse(storedGuest));
        setLoading(false);
        return;
      }

      // create a new guest
      const guestId = generateGuestId();

      const guestUser: User = {
        id: guestId,
        name: guestId,
        isGuest: true,
      };

      localStorage.setItem("guest", JSON.stringify(guestUser));
      setUser(guestUser);
      setLoading(false);
    };

    initUser();

    //  listener 
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          const u = session.user;

          const realUser: User = {
            id: u.id,
            name:
              u.user_metadata?.full_name ||
              u.email ||
              "User",
            isGuest: false,
          };

          setUser(realUser);

          // delete guest from localStorage
          localStorage.removeItem("guest");
        } else {
          // Generate a new guest user on sign out
          const storedGuest = localStorage.getItem("guest");

          if (storedGuest) {
            setUser(JSON.parse(storedGuest));
            return;
          }

          const guestId = generateGuestId();

          const guestUser = {
            id: guestId,
            name: guestId,
            isGuest: true,
          };

          localStorage.setItem("guest", JSON.stringify(guestUser));
          setUser(guestUser);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}