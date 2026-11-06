"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import Vapi from "@vapi-ai/web";

// import { useLazyGetRandomAssistantQuery } from "@/redux/query/assistant";

const vapi = new Vapi(process.env.NEXT_PUBLIC_LANDING_VAPI_PUBLIC!);

const VapiContext = createContext<any>(null);

export const useVapiContext = () => useContext(VapiContext);

export const VapiProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCallStarted, setIsCallStarted] = useState<boolean>(false);
  const [vapiBtnText, setVapiBtnText] = useState<string | null>(null);

  // const [trigger, { data }] = useLazyGetRandomAssistantQuery();

  const vapiCallHandler = () => {
    if (!isCallStarted) {
      // trigger();
      setVapiBtnText("Connecting");
      setIsCallStarted(true);
    } else {
      vapi.stop();
      setVapiBtnText(null);
      setIsCallStarted(false);
    }
  };

  useEffect(() => {
    if (isCallStarted) {
      vapi.start(process.env.NEXT_PUBLIC_LANDING_VAPI_ASSISTANT!);
    }
  }, [isCallStarted]);

  useEffect(() => {
    vapi.on("call-start", () => {
      setVapiBtnText("Connected");
    });
    vapi.on("speech-start", () => {
      setVapiBtnText("Hang Up");
    });
  }, [vapi]);

  return (
    <VapiContext.Provider value={{ vapiBtnText, vapiCallHandler }}>
      {children}
    </VapiContext.Provider>
  );
};
