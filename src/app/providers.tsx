"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import SessionManager from "@/utils/SessionManager";
import { SocketProvider } from "@/components/component/tools/socketContext";
import Loading from "@/components/component/Loading";

export interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate
          loading={
            <div className="flex h-screen w-full justify-center items-center text-theme">
              <Loading />
            </div>
          }
          persistor={persistor}
        >
          <SessionManager />
          <SocketProvider>{children}</SocketProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
