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
  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(8, 10);
    const minute = timestamp.substring(10, 12);
    const second = timestamp.substring(12, 14);

    // Create a new Date object from the parts
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

    return date.toLocaleString(); // Returns the formatted date
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.allorigins.win/raw?url=https://adaptfl-server.onrender.com/get_data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        const active_clients_count = result.clients.filter((client: any) => client.status === "active");

        // Transform API data into the required CardData structure
        const cards: CardData[] = [
          {
            title: "Active Clients",
            value: `${active_clients_count.length}`,
            pillText: `${(active_clients_count/result.clients.length)*100}`+"%",
            trend: "up",
            period: "Total Clients: " + `${result.clients.length}`,
          },
          {
            title: "Global Model Version",
            value: `v${Math.max(
              ...result.global_models.map((model: any) => model.version)
            )}`,
            pillText: "+1 version",
            trend: "up",
            period: "Latest Model Version",
          },
          {
            title: "Last Processed Timestamp",
            value: `${formatTimestamp(result.global_vars[0].value)}`,
            pillText: "On Time",
            trend: "up",
            period: "Latest Processing Time",
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
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
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