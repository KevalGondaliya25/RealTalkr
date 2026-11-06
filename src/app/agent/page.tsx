"use client";

import React, { useEffect, useState } from "react";
import { CirclePause, CirclePlay } from "lucide-react";
import { useGetAllAssistantWithOutPaginationQuery } from "@/redux/query/assistant";
import Loading from "@/components/component/Loading";
import { AssistantSelectType } from "@/types/assistant";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { ASSISTANT_TYPE } from "@/utils/constant";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC!);

export default function Page() {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isCallStarted, setIsCallStarted] = useState<boolean>(false);
  const [agent, setAgent] = useState<Array<AssistantSelectType>>([]);
  const [search, setSearch] = useState<string | null>(null);
  const [gender, setGender] = useState<string>();
  const [accent, setAccent] = useState<string>();

  const { data: agentData, isLoading } =
    useGetAllAssistantWithOutPaginationQuery({
      assistantType: ASSISTANT_TYPE.DEMO,
    });

  useEffect(() => {
    if (agentData && agentData.data) {
      setAgent(agentData.data);
    }
  }, [agentData]);

  const handlePlayPause = (id: string) => {
    if (isPlaying && isPlaying !== id) {
      vapi.stop();
      setIsPlaying(id);
      return;
    }
    if (!isCallStarted) {
      setIsCallStarted(true);
      setIsPlaying(id);
    } else {
      vapi.stop();
      setIsCallStarted(false);
      setIsPlaying(null);
    }
  };

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("call started..");
    });
    vapi.on("speech-start", () => {
      console.log("speech started..");
    });
  }, []);

  useEffect(() => {
    if (isCallStarted && isPlaying) {
      vapi.start(isPlaying);
    }
  }, [isCallStarted, isPlaying]);

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 max-md:overflow-x-auto max-md:max-w-full max-md:w-screen">
        <div className="mb-[5px]">
          <h2 className="text-[30px] text-start  font-bold leading-none mb-[15px] text-charcoal">
            Meet Your AI Agents
          </h2>
          <p className="text-start text-[18px] leading-[1.44] text-charcoal">
            Listen to how your AI Agent sounds. This will help you decide which
            agent works best for your leads.
          </p>
        </div>
        <div className="flex flex-col max-md:flex-wrap p-4 bg-sidebar gap-4 rounded-md overflow-x-auto border shadow-sm">
          <p className="text-start text-[18px] leading-[1.44] text-charcoal">
            Explore all voices
          </p>
          <div className="flex flex-row gap-4 flex-wrap md:flex-nowrap">
            <Input
              type="text"
              placeholder="Search"
              className="min-w-20 text-charcoal bg-sidebar"
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select value={gender} onValueChange={(value) => setGender(value)}>
              <SelectTrigger className="max-w-64 text-charcoal">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    key="1"
                    className="capitalize text-charcoal"
                    value="All"
                  >
                    All
                  </SelectItem>
                  <SelectItem
                    key="2"
                    value={"male"}
                    className="capitalize text-charcoal"
                  >
                    Male
                  </SelectItem>
                  <SelectItem
                    key="3"
                    value={"Female"}
                    className="capitalize text-charcoal"
                  >
                    Female
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={accent} onValueChange={(value) => setAccent(value)}>
              <SelectTrigger className="max-w-64 text-charcoal">
                <SelectValue placeholder="Select Accent" />
              </SelectTrigger>
              <SelectContent className="text-charcoal">
                <SelectGroup>
                  <SelectItem
                    key="1"
                    value={"All"}
                    className="capitalize text-charcoal"
                  >
                    All
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="font-medium text-center text-btn-bg-main">
            <div className="w-full flex items-center justify-center">
              <Loading />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {agent.map((agent: AssistantSelectType, index: number) => (
              <div
                key={index}
                className="flex justify-center rounded-md bg-sidebar min-h-[250px] px-4 py-4 border shadow-sm"
              >
                <div
                  className="relative flex border-0 rounded-md p-4 bg-cover bg-center h-full w-full"
                  key={agent.id}
                  style={{
                    backgroundImage: `url(${
                      agent?.assistantImg ||
                      "/assets/images/assistant/assistant.png"
                    })`,
                  }}
                >
                  <div className="absolute inset-0 bg-charcoal opacity-70 rounded-md"></div>

                  <div className="relative z-10 flex flex-col items-start justify-end">
                    <h2 className="gap-2 text-white font-bold text-2xl">
                      {agent.name}
                    </h2>
                    <Button
                      onClick={() => handlePlayPause(agent.VapiAssistantId)}
                      className="!p-0"
                    >
                      {isPlaying === agent.VapiAssistantId && isCallStarted ? (
                        <CirclePause className="h-10 w-10 text-white" />
                      ) : (
                        <CirclePlay className="h-10 w-10 text-white" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
