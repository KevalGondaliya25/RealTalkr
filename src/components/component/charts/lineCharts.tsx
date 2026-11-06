"use client";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  LabelList,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface LineChartsProps {
  title: string;
  subtitle: string;
  count: number | undefined;
  dataKeyDate: string;
  dataKeys: string;
  dataKeyLabel: string;
  chartData: any[];
  color: string;
}

const LineCharts = ({
  title,
  subtitle,
  count,
  dataKeyDate,
  dataKeys,
  dataKeyLabel,
  chartData,
  color,
}: LineChartsProps) => {
  const chartConfig2 = {
    visitors: {
      label: dataKeyLabel,
    },
    [dataKeys]: {
      label: dataKeyLabel,
      color: color,
    },
  } satisfies ChartConfig;

  const formateMinute = (minute: number) => {
    const seconds = Number(minute.toFixed(0)) || 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full bg-sidebar hover:bg-white">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-charcoal text-[22px]">{title}</CardTitle>
          <CardDescription className="text-charcoal">
            {subtitle}
          </CardDescription>
        </div>
        <div className="font-semibold text-xl text-charcoal">
          {dataKeys === "durationMs"
            ? `${formateMinute(Number(count))} min`
            : `$ ${count}`}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig2}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={dataKeys} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id={dataKeys} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal={false} // Explicitly turn off horizontal grid lines
            />
            <XAxis
              dataKey={dataKeyDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              className="text-charcoal"
            />
            <YAxis domain={[0, "auto"]} axisLine={false} tickLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Desktop Area Chart with Labels */}
            <Area
              dataKey={dataKeys}
              type="monotone" // Use monotone to smooth out the curve
              fill={`url(#${dataKeys})`}
              stroke={`var(--color-${dataKeys})`}
              stackId="a"
              dot={{ fill: `var(--color-${dataKeys})`, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              className="text-charcoal"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LineCharts;
