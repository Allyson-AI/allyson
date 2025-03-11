// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@allyson/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@allyson/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@allyson/ui/select";
import { useUser } from "@allyson/context";

import { toast } from "sonner";

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "#4A849E",
  },
} satisfies ChartConfig;

export function SessionsStarted() {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const { makeAuthenticatedRequest } = useUser();
  const [stats, setStats] = useState([]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/user/stats?days=${days}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      const transformedData = data.sessions.map((item) => ({
        date: item.date,
        sessions: item.value,
      }));
      setStats(transformedData);
    } catch (error) {
      toast.error("Failed to fetch stats");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest, days]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Sessions Started</CardTitle>
          <CardDescription>
            Showing total sessions started for the last {days} days
          </CardDescription>
        </div>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 7 Days" value={days} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={7} className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value={30} className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value={90} className="rounded-lg">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={stats}>
            <defs>
              <linearGradient id="fillsessions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
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
            />
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

            <Area
              dataKey="sessions"
              type="monotone"
              fill="url(#fillsessions)"
              stroke="var(--color-sessions)"
              stackId="a"
              connectNulls={true}
              baseValue={0}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
