"use client";

import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";

interface Client {
  created_at: string;
  contribution_count: number;
}

interface GlobalModel {
  created_at: string;
  version: number;
}

export const ActivityGraph = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.allorigins.win/raw?url=https://adaptfl-server.onrender.com/get_data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();

        // Process client data for the graph (contributions over time)
        const contributionsByMinute: { [key: string]: number } = {};
        result.clients.forEach((client: Client) => {
          const minute = new Date(client.created_at).toLocaleString("default", { hour: "2-digit", minute: "2-digit" });
          contributionsByMinute[minute] = (contributionsByMinute[minute] || 0) + client.contribution_count;
        });

        // Process global model data for the graph (model version over time)
        const modelsByMinute: { [key: string]: number } = {};
        result.global_models.forEach((model: GlobalModel) => {
          const minute = new Date(model.created_at).toLocaleString("default", { hour: "2-digit", minute: "2-digit" });
          modelsByMinute[minute] = Math.max(modelsByMinute[minute] || 0, model.version); // Latest version for each minute
        });

        // Format data for the chart
        const formattedData = Object.keys(contributionsByMinute).map((minute) => ({
          name: minute, // Hour:Minute format
          Contributions: contributionsByMinute[minute],
          Version: modelsByMinute[minute] || 0, // If no model was created that minute, set version to 0
        }));

        setData(formattedData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="col-span-8 overflow-hidden rounded-lg border border-stone-300 shadow-lg">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 text-xl font-medium">
          <FiUser /> Global Aggregation Over Time
        </h3>
      </div>

      <div className="h-80 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: -30,
              left: -30,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              className="text-xs font-bold"
              padding={{ right: 4 }}
            />
            <YAxis
              className="text-xs font-bold"
              axisLine={false}
              tickLine={false}
              yAxisId="left" // For client contributions
            />
            <YAxis
              className="text-xs font-bold"
              axisLine={false}
              tickLine={false}
              yAxisId="right" // For model versions
              orientation="right"
            />
            <Tooltip
              wrapperClassName="text-sm rounded bg-white shadow-lg"
              labelClassName="text-xs text-stone-500"
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="Contributions"
              stroke="#6a4cfc" // Purple line for contributions
              fill="#6a4cfc"
              strokeWidth={2}
              dot={{ stroke: "#6a4cfc", strokeWidth: 2, r: 4 }} // Dots on line
              activeDot={{ r: 6 }}
              yAxisId="left"
              isAnimationActive={true}
              animationDuration={10}
            />
            <Line
              type="monotone"
              dataKey="Version"
              stroke="#2196f3" // Blue line for version
              fill="#2196f3"
              strokeWidth={2}
              dot={{ stroke: "#2196f3", strokeWidth: 2, r: 4 }} // Dots on line
              activeDot={{ r: 6 }}
              yAxisId="right"
              isAnimationActive={true}
              animationDuration={10}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
