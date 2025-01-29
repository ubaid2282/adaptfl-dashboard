"use client";

import React, { useState, useEffect } from "react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

interface CardData {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
}

export const StatCards = () => {
  const [data, setData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(8, 10);
    const minute = timestamp.substring(10, 12);
    const second = timestamp.substring(12, 14);

    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://adaptfl-server.onrender.com/get_data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();

        if (!result.clients || !result.global_models || !result.global_aggregation) {
          throw new Error("Incomplete data received from API");
        }
        if (result.clients.length === 0 || result.global_models.length === 0) {
          throw new Error("No data available");
        }

        const active_clients_count = result.clients.filter((client: any) => client.status === "active");

        const cards: CardData[] = [
          {
            title: "Active Clients",
            value: `${active_clients_count.length}`,
            pillText: `${(active_clients_count.length / result.clients.length) * 100}%`,
            trend: "up",
            period: "Total Clients: " + `${result.clients.length}`,
          },
          {
            title: "Global Model Version",
            value: `${Math.max(...result.global_models.map((model: any) => model.version))}`,
            pillText: "+1 version",
            trend: "up",
            period: "Aggregated On: " + `${new Date(result.global_models[result.global_models.length - 1].created_at).toLocaleString()}`,
          },
          {
            title: "Last Checked At",
            value: `${(result.last_checked_timestamp).toLocaleString()}`,
            pillText: "On Time",
            trend: "up",
            period: "",
          }
        ];

        setData(cards);
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
    <>
      {data.map((item, index) => (
        <Card
          key={index}
          title={item.title}
          value={item.value}
          pillText={item.pillText}
          trend={item.trend}
          period={item.period}
        />
      ))}
    </>
  );
};

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
}) => {
  return (
    <div className="col-span-4 p-4 rounded border border-stone-300">
      <div className="flex mb-6 items-start justify-between">
        <div>
          <h1 className="text-stone-500 mb-2 text-sm">{title}</h1>
          <p className="text-3xl font-semibold">{value}</p>
        </div>

        <span
          className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} {pillText}
        </span>
      </div>

      <p className="text-xs text-stone-500">{period}</p>
    </div>
  );
};