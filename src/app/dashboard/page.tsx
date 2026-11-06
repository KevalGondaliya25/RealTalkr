"use client";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Label,
  LabelList,
  Pie,
  PieChart,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { STATUS, STATUS_COLOR, USER_TYPE } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CircleX, Pause, Play } from "lucide-react";

import Loading from "@/components/component/Loading";
import { CallStatisticsCostType, CallStatisticsType } from "@/types/call";
import { useGetCallStatisticsQuery } from "@/redux/query/call";
import LineCharts from "@/components/component/charts/lineCharts";
import {
  selectCurrentOrganizationId,
  selectCurrentUser,
  selectCurrentUserId,
  setOrganization,
} from "@/redux/slice/user";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetOrganizationQuery } from "@/redux/query/organization";
import { useLazyGetAllAssistantWithOutPaginationQuery } from "@/redux/query/assistant";
import { AssistantSelectType } from "@/types/assistant";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrganizationType } from "@/types/organization";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { string } from "zod";

const chartConfig = {
  value: {
    label: "value",
  },
  hot: {
    label: "Hot",
    color: "var(--chart-red-400)",
  },
  warm: {
    label: "Warm",
    color: "var(--chart-amber-400)",
  },
  poor: {
    label: "Poor",
    color: "var(--chart-emerald-400)",
  },
  cold: {
    label: "Cold",
    color: "var(--chart-cyan-400)",
  },
} satisfies ChartConfig;

const qualifiedChartConfig = {
  value: {
    label: "value",
  },
  high: {
    label: "High",
    color: "var(--chart-emerald-400)",
  },
  moderate: {
    label: "Moderate",
    color: "var(--chart-green-300)",
  },
  low: {
    label: "Low",
    color: "var(--chart-amber-400)",
  },
  poor: {
    label: "Poor",
    color: "var(--chart-red-400)",
  },
} satisfies ChartConfig;

export default function Page() {
  const router = useRouter();
  const userId = useSelector(selectCurrentUserId);
  const [statisticsData, setStatisticsData] =
    useState<CallStatisticsCostType | null>(null);
  const [statistics, setStatistics] = useState<Array<CallStatisticsType>>([]);
  const [pieChart, setPieChart] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [orgSelect, setOrgSelect] = useState<string | undefined>("");
  const [assistantSelect, setAssistantSelect] = useState<string>("");
  const [assistant, setAssistant] = useState<Array<AssistantSelectType>>([]);
  const [organization, setOrganizations] = useState<Array<OrganizationType>>(
    []
  );
  const [isPlaying, setIsPlaying] = useState<number>();
  const audioRefs = useRef<HTMLAudioElement | null>(null);
  const [leadQulityChartData, setLeadQulityChartData] = useState<
    Array<{
      key: string;
      value: number;
      fill: string;
    }>
  >();
  const dispatch = useDispatch();

  const organizationId = useSelector(selectCurrentOrganizationId);
  const user = useSelector(selectCurrentUser);

  const [getOrganization, { isLoading: getOrganationtLoading }] =
    useLazyGetOrganizationQuery({});
  const [getAssistants, { isLoading: getAssistantLoading }] =
    useLazyGetAllAssistantWithOutPaginationQuery();

  const { data, isLoading: statisticsLoading } = useGetCallStatisticsQuery({
    startDate: startDate && startDate !== "" ? startDate : undefined,
    status: status && status !== "All" ? status?.toLowerCase() : undefined,
    organizationId:
      orgSelect && orgSelect !== "All" ? Number(orgSelect) : undefined,
    assistantId:
      assistantSelect && assistantSelect !== "All"
        ? Number(assistantSelect)
        : undefined,
    userId: userId || undefined,
  });

  useEffect(() => {
    if (statisticsData) {
      const scoreRanges = Object.keys(statisticsData.scoreRanges);
      setLeadQulityChartData(
        scoreRanges
          .filter((key) => statisticsData.scoreRanges[key] > 0)
          .map((key) => ({
            key: key,
            value: statisticsData.scoreRanges[key],
            fill: `var(--color-${key})`,
          }))
      );
    }
  }, [statisticsData]);

  const hotLeads =
    statisticsData?.statistics.filter((value) => value.callStatus === "hot")
      .length || 0;

  const handleGetPercentage = (): number => {
    const callRate = statisticsData?.statistics.filter(
      (value) => value.durationMs >= 30000
    );

    const totalCalls = statisticsData?.statistics.length || 0;
    const filteredCalls = callRate?.length || 0;

    const percentage = (filteredCalls / totalCalls) * 100;

    return Number(percentage.toFixed(2));
  };

  const callRate = handleGetPercentage();

  const chartData = [
    { Engage: callRate || 0, NotEngage: 100 - (callRate || 0) },
  ];

  const chartConfig2 = {
    Engage: {
      label: "Engage",
      color: "var(--chart-emerald-400)",
    },
    NotEngage: {
      label: "Not engage",
      color: "var(--chart-red-400)",
    },
  } satisfies ChartConfig;

  const chartConfigQualified = {
    qualified: {
      label: "Qualified",
      color: "var(--chart-emerald-400)",
    },
    unqualified: {
      label: "Unqualified",
      color: "var(--chart-red-400)",
    },
  } satisfies ChartConfig;

  const QualifiedData = [
    {
      qualified: (statisticsData?.engagedLeadRate || 0) * 100,
      unqualified: 100 - (statisticsData?.engagedLeadRate || 0) * 100,
    },
  ];

  useEffect(() => {
    if (user?.role === USER_TYPE.ADMIN) {
      const fetchAllOrganization = async () => {
        const res = await getOrganization({ dataType: "all" });
        if (res && res.data) setOrganizations(res.data.data);
      };

      const fetchAllAssistant = async () => {
        const res = await getAssistants({ organizationId: organizationId });
        if (res && res.data) setAssistant(res.data.data);
      };

      fetchAllOrganization();
      fetchAllAssistant();
    } else {
      const orgId = organizationId?.toString();
      setOrgSelect(orgId);
    }
  }, [getOrganization, getAssistants, user, organizationId]);

  useEffect(() => {
    if (data && data.data) {
      setStatisticsData(data.data);
      setStatistics(
        data.data.statistics
          .map((item) => ({ ...item }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      );
      const statisticsKeys = ["hot", "warm", "poor", "cold"];
      setPieChart(
        statisticsKeys.map((key) => ({
          key: key,
          value: data.data.statusCount[key],
          fill: `var(--color-${key})`,
        }))
      );
    }
  }, [data]);

  const agentLineChart = {
    key: 1,
    title: "Call Duration",
    subtitle: "This is the total duration of calls in minutes",
    keyField: "durationMs",
    keyFieldLabel: "Duration",
    totalKeyField: "totalDurationMs",
    color: "var(--chart-amber-400)",
  };

  const lineChartData = [
    {
      key: 1,
      title: "Cost",
      subtitle: "This is the cost of the call in USD.",
      keyField: "cost",
      keyFieldLabel: "Cost",
      totalKeyField: "totalCost",
      color: "var(--chart-red-400)",
    },
    {
      key: 3,
      title: "Model Cost",
      subtitle: "This is the model cost of the call in USD.",
      keyField: "llmCost",
      keyFieldLabel: "Llm Cost",
      totalKeyField: "totalLlmCost",
      color: "var(--chart-emerald-400)",
    },
    {
      key: 4,
      title: "Transcription Cost",
      subtitle: "This is the transcription cost of the call in USD.",
      keyField: "sttCost",
      keyFieldLabel: "Stt Cost",
      totalKeyField: "totalSttCost",
      color: "var(--chart-sky-400)",
    },
    {
      key: 5,
      title: "Total Cost",
      subtitle: "This is the total cost of the call in USD.",
      keyField: "totalCost",
      keyFieldLabel: "Total Cost",
      totalKeyField: "finalTotalCost",
      color: "var(--chart-violet-400)",
    },
    {
      key: 6,
      title: "Voice Cost",
      subtitle: "This is the voice cost of the call in USD.",
      keyField: "ttsCost",
      keyFieldLabel: "Tts Cost",
      totalKeyField: "totalTtsCost",
      color: "var(--chart-orange-400)",
    },
    {
      key: 7,
      title: "Vapi Cost",
      subtitle: "This is the fix cost of the vapi in USD.",
      keyField: "vapiCost",
      keyFieldLabel: "Vapi Cost",
      totalKeyField: "totalVapiCost",
      color: "var(--chart-rose-400)",
    },
  ];

  const handlePlayPause = (id: number, recUrl: string) => {
    if (audioRefs.current) {
      if (isPlaying === id) {
        setIsPlaying(0);
        audioRefs.current.src = "";
        audioRefs.current.pause();
      } else {
        setIsPlaying(id);
        audioRefs.current.src = recUrl;
        audioRefs.current.load();

        audioRefs.current.oncanplaythrough = () => {
          audioRefs.current?.play().catch((err) => {
            toast.error("Error playing the audio:");
          });
        };
      }
    }
  };

  return (
    <>
      {statisticsLoading ? (
        <div className="size-full flex justify-center items-center text-theme">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 ">
            <div className="flex items-center justify-start  gap-3 hover:bg-white p-2 rounded-md max-w-fit">
              <Avatar className="size-10">
                <AvatarImage
                  className="object-cover"
                  src={user?.profileImg || "/assets/images/user/user.png"}
                />
                <AvatarFallback>RT</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-xl text-charcoal">
                  Hey, {user?.name}!
                </p>
                <p className="text-base text-charcoal tracking-wider">
                  Let&apos;s qualify your leads!
                </p>
              </div>
            </div>
            {/* <div className="flex items-center justify-start gap-3 p-2">
            <Avatar className="size-10">
              <AvatarImage
                className="object-cover"
                src={user?.profileImg || "/assets/images/user/user.png"}
              />
              <AvatarFallback>RT</AvatarFallback>
            </Avatar>
            <div>
              <p>Hey {user?.name}</p>
              <p className="text-xs">Let&apos;s qualify your leads!</p>
            </div>
          </div> */}
            {/* <div className="grid sm:grid-cols-2 items-center sm:justify-between gap-3 w-full">
            <Popover>
              <div className="relative w-full flex justify-center">
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "!p-0 !pl-3 text-secondary bg-white w-full !gap-3 !h-[40px] justify-start !text-center font-light text-sm rounded-md",
                      !date && "text-muted-foreground",
                      "hover:bg-white hover:text-charcoal"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                {Boolean(startDate) && (
                  <div className="absolute right-0 top-0 z-10">
                    <CircleX
                      className="h-4 w-4  m-3"
                      onClick={() => {
                        setStartDate(null);
                        setDate(undefined);
                      }}
                    />
                  </div>
                )}
              </div>
              <PopoverContent className="w-full p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full"
                  initialFocus
                  onDayClick={(day: Date) =>
                    setStartDate(format(day, "yyyy-MM-dd"))
                  }
                />
              </PopoverContent>
            </Popover>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="max-w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    key={STATUS.length}
                    value={"All"}
                    className="capitalize"
                  >
                    All
                  </SelectItem>
                  {STATUS.filter((status) => status !== "new")
                    .map(
                      (value: string) =>
                        value.charAt(0).toUpperCase() + value.slice(1)
                    )
                    .map((value: string, index: number) => (
                      <SelectItem
                        key={index}
                        value={value}
                        className="capitalize"
                      >
                        {value}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {user?.role === USER_TYPE.ADMIN && (
              <>
                <Select
                  value={orgSelect}
                  onValueChange={(value) => {
                    setOrgSelect(value);
                  }}
                >
                  <SelectTrigger
                    className="max-w-full"
                    disabled={getOrganationtLoading}
                  >
                    <SelectValue placeholder="Select Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem key={STATUS.length} value={"All"}>
                        All
                      </SelectItem>
                      {organization.map((value) => (
                        <SelectItem key={value.id} value={value.id.toString()}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={assistantSelect}
                  onValueChange={(value) => setAssistantSelect(value)}
                >
                  <SelectTrigger
                    className="max-w-full"
                    disabled={getAssistantLoading}
                  >
                    <SelectValue placeholder="Select a Assistant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem key={STATUS.length} value={"All"}>
                        All
                      </SelectItem>
                      {assistant.map((value) => (
                        <SelectItem key={value.id} value={value.id.toString()}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          </div> */}
            <div className="grid sm:grid-cols-2 grid-cols-1 items-center justify-between gap-3">
              <div className="grid xl:grid-cols-1 grid-cols-1 col-span-2">
                <div className="grid sm:grid-cols-6 col-span-2 gap-3">
                  <Card className="sm:col-span-2 min-h-32 h-full text-center bg-sidebar hover:bg-white">
                    <CardHeader>
                      <CardTitle className="text-[22px] text-charcoal">
                        Total Calls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[22px] font-bold text-charcoal">
                        {statisticsData?.statistics.length || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="sm:col-span-2 min-h-32 h-full text-center bg-sidebar hover:bg-white">
                    <CardHeader>
                      <CardTitle className="text-[22px] text-charcoal">
                        {" "}
                        Engaged Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[22px] font-bold text-charcoal">
                        {Number(
                          (
                            (statisticsData?.engagedLeadRate || 0) * 100
                          ).toFixed(0)
                        )}
                        %
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="sm:col-span-2 min-h-32 h-full text-center bg-sidebar hover:bg-white">
                    <CardHeader>
                      <CardTitle className="text-[22px] text-charcoal">
                        Hot Leads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[22px] font-bold text-charcoal">
                        {hotLeads}
                      </p>
                    </CardContent>
                  </Card>
                  {/* <Card className="sm:col-span-3 min-h-[346px] h-full bg-sidebar hover:bg-white items-center">
                    <CardHeader className="items-center pb-0">
                      <CardTitle className="text-center text-charcoal">
                        Call Engagement Rate
                      </CardTitle>
                      <CardDescription className="text-center text-charcoal">
                        This chart shows Engagement rate.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center pb-0">
                      <ChartContainer
                        config={chartConfig2}
                        className="mx-auto aspect-square w-full max-w-[250px]"
                      >
                        <RadialBarChart
                          data={chartData}
                          endAngle={180}
                          innerRadius={80}
                          outerRadius={130}
                          cx="50%"
                          cy="60%"
                        >
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <PolarRadiusAxis
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) - 16}
                                        className="fill-foreground text-2xl font-bold"
                                      >
                                        {(callRate || 0) + "%"}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 4}
                                        className="fill-muted-foreground"
                                      >
                                        Engagement Rate
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </PolarRadiusAxis>
                          <RadialBar
                            dataKey="NotEngage"
                            fill="var(--color-NotEngage)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                          />
                          <RadialBar
                            dataKey="Engage"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-Engage)"
                            className="stroke-transparent stroke-2"
                          />
                        </RadialBarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card> */}

                  <Card className="sm:col-span-3 xl:col-span-2 min-h-[346px] h-full bg-sidebar hover:bg-white items-center">
                    <CardHeader className="items-center pb-0 lg:h-[70px] md:h-[114px]">
                      <CardTitle className="text-center text-[22px] text-charcoal">
                        Status Count
                      </CardTitle>
                      <CardDescription className="text-center text-charcoal">
                        This chart displays the status count.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center pb-0">
                      <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-[250px] lg:max-w-[250px] sm:max-w-[200px] min-h-[300px]"
                      >
                        <PieChart cx="50%" cy="60%">
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={pieChart}
                            dataKey="value"
                            nameKey="key"
                            innerRadius={50}
                            fill="#8884d8"
                            outerRadius={80}
                          >
                            <LabelList
                              dataKey="value"
                              position="inside"
                              fill="#fff"
                              fontSize={12}
                            />
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
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
                                        {statisticsData
                                          ? statisticsData?.statistics?.length
                                          : 0}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground text-charcoal"
                                      >
                                        Status
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </Pie>
                          <ChartLegend
                            content={<ChartLegendContent nameKey="key" />}
                            className="flex-wrap gap-4 text-base text-charcoal"
                          />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="sm:col-span-3 xl:col-span-2 min-h-[346px] h-full bg-sidebar hover:bg-white items-center">
                    <CardHeader className="items-center pb-0">
                      <CardTitle className="text-center text-[22px] text-charcoal">
                        Lead Quality Breakdown
                      </CardTitle>
                      <CardDescription className="text-center pb-0 text-charcoal">
                        This chart shows the lead quality breakdown.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center pb-0">
                      <ChartContainer
                        config={qualifiedChartConfig}
                        className="mx-auto aspect-square w-full max-w-[250px] lg:max-w-[250px] sm:max-w-[200px] min-h-[300px]"
                      >
                        <PieChart cx="50%" cy="60%">
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={leadQulityChartData}
                            dataKey="value"
                            nameKey="key"
                            fill="#8884d8"
                            className="w-[60px]"
                            outerRadius={80}
                          >
                            <LabelList
                              dataKey="value"
                              position="inside"
                              fill="#fff"
                              fontSize={12}
                            />
                          </Pie>
                          <ChartLegend
                            content={<ChartLegendContent nameKey="key" />}
                            className="flex-wrap gap-4 text-base text-charcoal"
                          />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="sm:col-span-6 xl:col-span-2 min-h-[346px] h-full bg-sidebar hover:bg-white items-center">
                    <LineCharts
                      key={agentLineChart.key}
                      title={agentLineChart.title}
                      subtitle={agentLineChart.subtitle}
                      count={statisticsData?.totalDurationMs}
                      dataKeyDate="createdAt"
                      dataKeys={agentLineChart.keyField}
                      dataKeyLabel={agentLineChart.keyFieldLabel}
                      chartData={statisticsData?.statistics ?? []}
                      color={agentLineChart.color}
                    />
                  </Card>
                </div>

                <Card className="col-span-1 max-h-full w-full mt-3 bg-sidebar hover:bg-white">
                  <CardHeader className="pt-6 pb-0 px-6">
                    <CardTitle className="text-center text-[22px] text-charcoal">
                      Recent Calls
                    </CardTitle>
                    <div className="grid grid-cols-6  max-sm:grid-cols-4 place-items-center gap-3 pb-2 pt-6 mb-2">
                      <p className="col-span-1 text-sm font-bold text-center text-charcoal">
                        Lead Name
                      </p>
                      <p className="col-span-1 text-sm font-bold text-center text-charcoal">
                        Status
                      </p>
                      <p className="col-span-2 text-sm font-bold text-center max-sm:hidden text-charcoal">
                        Analysis
                      </p>
                      <p className="col-span-1 text-sm font-bold text-center text-charcoal">
                        Recording
                      </p>
                      <p className="col-span-1 text-sm font-bold text-center max-sm:hidden text-charcoal">
                        Created At
                      </p>
                    </div>
                  </CardHeader>
                  <div className="border-b-2" />
                  <CardContent className="max-h-[388px] overflow-y-auto disable-slider">
                    {statistics.length > 0 ? (
                      statistics.map((call, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div
                              key={index}
                              className="grid grid-cols-6 max-sm:grid-cols-4 place-items-center gap-3 cursor-pointer"
                              onClick={() =>
                                router.push(`/call-logs/${call.id}`)
                              }
                            >
                              <p className="col-span-1 text-sm text-center text-charcoal">
                                {call.leadName}
                              </p>
                              <Badge
                                className={`${
                                  STATUS_COLOR[call.callStatus.toLowerCase()]
                                } capitalize text-center w-fit h-fit col-span-1`}
                              >
                                {call.callStatus}
                              </Badge>
                              <p className="col-span-2 text-sm text-center max-sm:hidden text-charcoal">
                                <Tooltip>
                                  <TooltipTrigger
                                    asChild
                                    className="relative max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-charcoal"
                                  >
                                    <span>
                                      {call.summary
                                        ? call.summary &&
                                          call.summary.length > 30
                                          ? `${call.summary.slice(0, 30)}...`
                                          : call.summary
                                        : ""}
                                    </span>
                                  </TooltipTrigger>
                                  {call.summary && (
                                    <TooltipContent
                                      side="bottom"
                                      align="center"
                                      className="rounded-lg shadow-lg max-w-xs text-charcoal"
                                    >
                                      <span>{call.summary}</span>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </p>
                              <p className="col-span-1 text-sm text-center text-charcoal">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayPause(call.id, call.recordingUrl);
                                  }}
                                  className="!p-0 text-charcoal"
                                  disabled={call.durationMs <= 0}
                                >
                                  {isPlaying === call.id ? <Pause /> : <Play />}
                                </Button>
                              </p>
                              <p className="col-span-1 text-sm text-center max-sm:hidden text-charcoal">
                                {format(
                                  new Date(call.createdAt),
                                  "dd MMM, yyyy hh:mm a"
                                )}
                              </p>
                            </div>
                            {index !== statistics.length - 1 && (
                              <Separator className="my-2" />
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div className="col-span-6 text-center pt-5 text-theme">
                        Calls not found.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="lg:grid-cols-2 grid-cols-1 grid items-center justify-between gap-3">
              {user?.role === USER_TYPE.ADMIN &&
                statisticsData &&
                lineChartData.map((item, index) => (
                  <>
                    <LineCharts
                      key={index}
                      title={item.title}
                      subtitle={item.subtitle}
                      count={
                        statisticsData[
                          item.totalKeyField as keyof CallStatisticsCostType
                        ] as number
                      }
                      dataKeyDate="createdAt"
                      dataKeys={item.keyField}
                      dataKeyLabel={item.keyFieldLabel}
                      chartData={statisticsData.statistics ?? []}
                      color={item.color}
                    />
                  </>
                ))}
            </div>
            <audio
              ref={audioRefs}
              src={audioRefs ? audioRefs?.current?.src : ""}
            />
          </div>
        </>
      )}
    </>
  );
}
