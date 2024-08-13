"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUserContext } from "@/types";
import { getUser } from "./utils";
import { MAIN_LINK } from "@/constants";

export const AuthContext = createContext<AuthUserContext>(
  {} as AuthUserContext
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const toggleUser = (user: boolean) => {
    if (user) {
      document.cookie = "user=; Max-Age=0";
      router.replace(MAIN_LINK);
    } else {
      document.cookie = "user=";
    }
    setUser(!user);
  };

  return (
    <AuthContext.Provider value={{ user, toggleUser }}>
      {children}
    </AuthContext.Provider>
  );
};
