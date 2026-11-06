"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookText,
  ChartLine,
  ChartScatter,
  Play,
  ThumbsUp,
  Pause,
  ArchiveRestore,
  ChevronsUpDown,
  NotebookPen,
  ChevronLeft,
} from "lucide-react";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAddNotesMutation, useGetOneCallsQuery } from "@/redux/query/call";
import { CallType, oneCallMessage } from "@/types/call";
import Loading from "@/components/component/Loading";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import WaveSurfer from "wavesurfer.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/response";
import { useRouter } from "next/navigation";
import moment from "moment";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";

const chartConfig = {
  value: {
    label: "value",
  },
  sttCost: {
    label: "stt cost",
    color: "var(--chart-red-400)",
  },
  llmCost: {
    label: "llm cost",
    color: "var(--chart-amber-400)",
  },
  ttsCost: {
    label: "tts cost",
    color: "var(--chart-emerald-400)",
  },
  vapiCost: {
    label: "vapi cost",
    color: "var(--chart-sky-400)",
  },
} satisfies ChartConfig;

export default function Page() {
  const params = useParams<{ id: string }>();

  const { data: oneCallData, isLoading: oneCallDataLoading } =
    useGetOneCallsQuery({
      id: params.id,
    });

  const [transcriptMessage, setTranscriptMessage] = useState<
    Array<oneCallMessage>
  >([]);

  const [data, setData] = useState<CallType | null>(null);
  const [pieChart, setPieChart] = useState<any[]>([]);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (oneCallData && oneCallData.data) {
      setTranscriptMessage(
        oneCallData.data.messages?.filter(
          (message) => message.role !== "system"
        )
      );
    }
    if (oneCallData && oneCallData.data) {
      setData(oneCallData.data);
      setNotes(oneCallData.data.notes);
    }

    const statisticsKeys = ["sttCost", "llmCost", "ttsCost", "vapiCost"];

    if (oneCallData && oneCallData.data) {
      setPieChart(
        statisticsKeys.map((key) => ({
          key: key,
          value: oneCallData.data[key as keyof CallType],
          fill: `var(--color-${key})`,
        }))
      );
    }
  }, [oneCallData]);

  const containerRef = useRef(null);
  const router = useRouter();
  const [wavesurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [currentTime, setCurrentTime] = useState<number>(0);

  const formatTime = (seconds: number) =>
    [seconds / 60, seconds % 60]
      .map((v) => `0${Math.floor(v)}`.slice(-2))
      .join(":");

  const togglePlay = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = (url?: string) => {
    if (!url) return;
    if (url.includes(".mp4") || url.includes(".wav")) {
      fetch(url)
        .then((response) => response.blob()) // Convert to blob
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `recording.${url.includes(".mp4") ? "mp4" : "wav"}`; // Set file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => console.error("Download failed:", error));
    }
  };

  const changeSpeed = (speed: number) => {
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(speed);
      setPlaybackRate(speed);
    }
  };

  useEffect(() => {
    if (data) {
      if (!containerRef.current) return;

      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#e6503a",
        progressColor: "#e6503a30",
        cursorColor: "#a0cfcf",

        height: 100,
        barWidth: 2,
        url: data?.recordingUrl,
        plugins: [
          TimelinePlugin.create({
            style: {
              color: "#072032",
            },
          }),
        ],
      });

      setWaveSurfer(ws);

      ws.on("audioprocess", (time) => {
        setCurrentTime(time);
      });

      return () => ws.destroy();
    }
  }, [data]);

  const [addNotes, { isLoading: addNotesLoading }] = useAddNotesMutation();

  const handleNotes = async () => {
    if (!data) return;
    try {
      const result = await addNotes({
        id: data.id,
        notes,
      }).unwrap();
    } catch (error) {
      toast.error((error as ErrorResponse).data.message);
    }
  };

  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  return (
    <div>
      <Card className="bg-white-900 text-white w-full mb-5 bg-sidebar">
        {oneCallDataLoading ? (
          <div className="size-full flex justify-center items-center  text-theme h-[270px]">
            <Loading />
          </div>
        ) : (
          <>
            {/* Settings Dropdown */}
            <div className="flex items-center justify-between m-4">
              <Button
                type="button"
                className="!h-[40px] !pt-4 !pb-4 !pl-5 !pr-5 m-2 text-charcoal bg-white border shadow-sm"
                onClick={() => router.push("/call-logs")}
              >
                <ChevronLeft className="w-5 h-5" />{" "}
                <span className="mr-1 text-charcoal">Back</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="bg-white shadow-sm border text-charcoal flex items-center justify-center gap-2 h-[40px] w-[130px] rounded-lg focus-visible:outline-none"
                    disabled={oneCallDataLoading}
                  >
                    {playbackRate}
                    <ChevronsUpDown size={18} strokeWidth={1.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-sidebar text-white"
                >
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`px-4 cursor-pointer bg-sidebar text-charcoal hover:!bg-theme hover:!text-white my-1 ${
                        playbackRate === speed ? "bg-theme text-white" : ""
                      }`}
                    >
                      {speed}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Timer */}
            </div>
            <CardHeader className="pt-0">
              <p className="text-lg text-gray-400 mt-2 text-start font-semibold">
                {formatTime(currentTime)}
              </p>
              <CardTitle className="text-lg text-theme">Recording</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {oneCallDataLoading ? (
                <div className="size-full flex justify-center items-center  text-theme h-[270px]">
                  <Loading />
                </div>
              ) : (
                <div ref={containerRef} />
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={togglePlay}
                  className="bg-theme flex items-center gap-2 h-[40px] p-[15px] rounded-xl"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Download Button */}
                <button
                  onClick={() => downloadAudio(data?.recordingUrl)}
                  className="bg-white border shadow-sm text-charcoal flex items-center justify-center gap-2 h-[40px] w-[130px] rounded-lg"
                  disabled={oneCallDataLoading}
                >
                  <ArchiveRestore size={20} strokeWidth={1.5} />
                  Audio
                </button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
      <Card className="bg-sidebar text-charcoal w-full mb-5">
        <CardHeader className="">
          <CardTitle className="text-xl text-theme">Lead Details</CardTitle>
        </CardHeader>
        <CardContent className="h-full text-charcoal">
          {oneCallDataLoading ? (
            <div className="size-full flex justify-center items-center  text-theme h-[270px]">
              <Loading />
            </div>
          ) : (
            <>
              {data && data.lead ? (
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-4">
                  <div>
                    <div className="mb-1.5 text-sm font-medium">Lead Name</div>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {data.lead?.name}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 text-sm font-medium">Lead Email</div>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {data.lead?.email}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 text-sm font-medium">
                      Lead Contact
                    </div>
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="AE"
                      disabled
                      value={data.lead?.contact}
                      className="w-full h-[40px] border-input [&>input]:bg-white"
                      onChange={(value) => console.log(value)}
                      countrySelectProps={{
                        unicodeFlags: true,
                      }}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-sm font-medium">
                      Execution Date
                    </div>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {moment
                        .utc(data.lead?.executionTime)
                        .utcOffset(
                          parseTimezone(data.lead?.timezone).offset || 0 * 60
                        )
                        .format("DD-MM-yyyy HH:mm")}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 text-sm font-medium">Time Zone</div>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {data.lead?.timezone}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 text-sm font-medium">
                      Caller Number
                    </div>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {data.lead?.phoneNumber}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 text-sm font-medium">
                      Assistant Name
                    </div>
                    <div className=" w-full h-10 bg-white flex item-center rounded-sm border border-input p-2 text-sm">
                      {data.assistant?.name || ""}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-charcoal-300">No Data Found</div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Tabs defaultValue="transcript" className="w-full">
        <TabsList className="grid w-full grid-cols-3 xl:pr-[200px] xl:pl-[200px] bg-sidebar">
          {/* <TabsTrigger
            value="logs"
            className="flex items-center justify-center gap-[10px]"
          >
            <TableOfContents className="rotate-180" size={20} /> Logs
          </TabsTrigger> */}

          <TabsTrigger
            value="transcript"
            className="flex items-center justify-center gap-[10px] !text-charcoal"
          >
            <BookText size={20} className="max-lg:hidden" />
            Transcript
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="flex items-center justify-center gap-[10px] !text-charcoal"
          >
            <ChartLine size={20} className="max-lg:hidden" />
            Analysis
          </TabsTrigger>
          {/* <TabsTrigger
            value="callCost"
            className="flex items-center justify-center gap-[10px] !text-charcoal"
          >
            <ChartScatter size={20} className="max-lg:hidden" />
            Call Cost
          </TabsTrigger> */}
          <TabsTrigger
            value="notes"
            className="flex items-center justify-center gap-[10px] !text-charcoal"
          >
            <NotebookPen size={20} className="max-lg:hidden" />
            Notes
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent value="logs">
          <Card>
            {data?.map((item, index) => (
              <>
                <div
                  className="flex items-center justify-start gap-[40px] border-b-2 p-[12px]"
                  key={index}
                >
                  <p className="text-[14px]">{item?.server}</p>
                  {item?.name === "LOG" ? (
                    <p className="text-[14px] text-[#22d3ee]">[{item?.name}]</p>
                  ) : (
                    <p className="text-[14px] text-green-500">[{item?.name}]</p>
                  )}
                  <p className="text-[14px]">{item?.description}</p>
                </div>
              </>
            ))}
          </Card>
        </TabsContent> */}

        {oneCallDataLoading ? (
          <div className="size-full flex justify-center items-center h-[85vh] text-theme">
            <Loading />
          </div>
        ) : (
          <TabsContent value="transcript">
            <Card className="p-[12px] bg-sidebar">
              <div className="flex items-center justify-start text-charcoal gap-[10px] text-[20px] font-semibold pb-5">
                <BookText size={20} />
                Transcript
              </div>
              {transcriptMessage?.map((item, index) => (
                <>
                  <div key={index}>
                    {item?.role === "bot" ? (
                      <p className="text-[#34d399] text-[15px] font-semibold">
                        AI
                      </p>
                    ) : (
                      <p className="text-[#22d3ee] text-[15px] font-semibold">
                        User
                      </p>
                    )}
                    <p className="font-medium text-[13px] pb-[12px] text-charcoal">
                      {item?.message}
                    </p>
                  </div>
                </>
              ))}
            </Card>
          </TabsContent>
        )}

        {oneCallDataLoading ? (
          <div className="size-full flex justify-center items-center h-[85vh] text-theme">
            <Loading />
          </div>
        ) : (
          <TabsContent value="analysis">
            <Card className="p-5 bg-sidebar">
              <div className="pb-5">
                <div className="flex items-center justify-start gap-[5px] pb-[12px]">
                  <p>
                    <ChartLine size={20} />
                  </p>
                  <p className="font-semibold text-charcoal">Analysis</p>
                </div>
                <p className="text-sm font-medium text-justify pl-2 text-charcoal">
                  {data?.summary || "-"}
                </p>
              </div>
              <div className="pb-5">
                <div className="flex items-center justify-start gap-[5px] pb-[12px]">
                  <p>
                    <ThumbsUp size={20} />
                  </p>
                  <p className="font-semibold text-charcoal">
                    Success Evaluation
                  </p>
                </div>
                <p
                  className="text-sm font-medium text-justify pl-2 text-charcoal"
                  dangerouslySetInnerHTML={{
                    __html:
                      data?.evolutionStatus?.replaceAll("\n", "<br />") || "",
                  }}
                />
              </div>
            </Card>
          </TabsContent>
        )}

        {/* {oneCallDataLoading ? (
          <div className="size-full flex justify-center items-center h-[85vh] text-theme">
            <Loading />
          </div>
        ) : (
          <TabsContent value="callCost">
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle className="text-charcoal">Cost Breakdown</CardTitle>
                <CardDescription className="text-charcoal">Call Cost Distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px] text-charcoal"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieChart}
                      dataKey="value"
                      nameKey="key"
                      innerRadius={65}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold text-charcoal"
                                >
                                  $ {data?.totalCost.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground text-charcoal"
                                >
                                  Total Cost
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-4 text-sm ">
                <div className="flex gap-4 max-md:flex-wrap justify-center items-center max-w-screen-lg w-full">
                  <div className="border-2 rounded-lg p-3 max-w-[300px] w-full h-[106px]">
                    <p className="font-semibold text-[14px] text-charcoal">stt</p>
                    <p className="text-[14px] font-semibold text-charcoal">
                      $ {data?.sttCost}
                    </p>
                  </div>
                  <div className="border-2 rounded-lg p-3 max-w-[300px] w-full">
                    <p className="font-semibold text-[14px] text-charcoal">lmm</p>
                    <p className="text-[14px] font-semibold text-charcoal">
                      $ {data?.llmCost}
                    </p>
                    <p className="text-[14px] font-semibold text-charcoal">
                      - {data?.llmPromptTokens} <span className="text-charcoal">prompt tokens</span>
                    </p>
                    <p className="text-[14px] font-semibold text-charcoal">
                      - {data?.llmCompletionTokens}{" "}
                      <span className="text-charcoal">completion tokens</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 max-md:flex-wrap justify-center items-center max-w-screen-lg w-full">
                  <div className="border-2 rounded-lg p-3 max-w-[300px] w-full h-[106px]">
                    <p className="font-semibold text-[14px] text-charcoal">tts</p>
                    <p className="text-[14px] font-semibold text-charcoal">
                      $ {data?.ttsCost}
                    </p>
                    <p className="text-[14px] font-semibold text-charcoal">
                      - {data?.ttsCharacters} <span className="text-charcoal">characters</span>
                    </p>
                  </div>
                  <div className="border-2 rounded-lg p-3 max-w-[300px] w-full h-[106px]">
                    <p className="font-semibold text-[14px] text-charcoal">vapi</p>
                    <p className="text-[14px] font-semibold text-charcoal">
                      $ {data?.vapiCost}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        )} */}

        {oneCallDataLoading ? (
          <div className="size-full flex justify-center items-center h-[85vh] text-theme">
            <Loading />
          </div>
        ) : (
          <TabsContent value="notes">
            <Card className="p-5 pb-[10px] bg-sidebar">
              <div className="py-5">
                <Textarea
                  placeholder="Enter your notes."
                  className="max-h-screen h-60 text-charcoal"
                  value={notes}
                  onChange={(event) => setNotes(event.currentTarget.value)}
                />
                <div className="flex items-center justify-end  mt-[25px]">
                  <Button
                    className="bg-theme text-white !h-4 !py-5"
                    disabled={addNotesLoading}
                    onClick={handleNotes}
                  >
                    {addNotesLoading ? <Loading /> : "Publish"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
