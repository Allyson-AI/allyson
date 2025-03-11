// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { toast } from "sonner";
import { useUser } from "@allyson/context";


const chartConfig = {
  storageUsed: {
    label: "Storage Used",
    color: "#6F517A",
  },
} satisfies ChartConfig;

export function StorageUsed() {
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

      const transformedData = data.storage.map((item) => ({
        date: item.date,
        storageUsed: item.value,
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
          <CardTitle>Storage Used</CardTitle>
          <CardDescription>
            Showing total storage used for the last {days} days
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
          className="aspect-auto h-[320px] w-full"
        >
          <AreaChart data={stats}>
            <defs>
              <linearGradient id="fillstorageUsed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-storageUsed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-storageUsed)"
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
              formatter={(value, name) => {
                let formattedNumber, unit;
                if (value >= 1e9) {
                  formattedNumber = (value / 1e9).toFixed(2);
                  unit = "GB";
                } else if (value >= 1e6) {
                  formattedNumber = (value / 1e6).toFixed(2);
                  unit = "MB";
                } else if (value >= 1e3) {
                  formattedNumber = (value / 1e3).toFixed(2);
                  unit = "KB";
                } else {
                  formattedNumber = value;
                  unit = "B";
                }

                return (
                  <div className="flex min-w-[140px] items-center text-xs text-muted-foreground">
                    <div className="shrink-0 rounded-[2px] bg-[#6F517A] h-2.5 w-2.5 mr-2" />
                    {chartConfig[name as keyof typeof chartConfig]?.label ||
                      name}
                    <div className="ml-auto flex items-baseline font-mono font-medium tabular-nums text-foreground">
                      <span className="mr-0.5">{formattedNumber}</span>
                      <span>{unit}</span>
                    </div>
                  </div>
                );
              }}
            />

            <Area
              dataKey="storageUsed"
              type="monotone"
              fill="url(#fillstorageUsed)"
              stroke="var(--color-storageUsed)"
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
