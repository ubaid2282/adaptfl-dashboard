"use client";

import React, { useState, useEffect } from "react";
import { FiArrowUpRight, FiMoreHorizontal } from "react-icons/fi";

interface Client {
  client_id: string;
  created_at: string;
  status: string;
  contribution_count: number;
}

export const RecentTransactions = () => {
  const [clients, setClients] = useState<Client[]>([]);
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

        // Extract the relevant client data
        const clientData = result.clients.map((client: any) => ({
          client_id: client.client_id,
          created_at: client.created_at,
          status: client.status,
          contribution_count: client.contribution_count,
        }));

        setClients(clientData);
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
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          Recent Client Activity
        </h3>
        
      </div>
      <table className="w-full table-auto">
        <TableHead />
        <tbody>
          {clients.map((client, index) => (
            <TableRow
              key={index}
              cusId={client.client_id}
              status={client.status}
              date={new Date(client.created_at).toLocaleString()}
              contributionCount={client.contribution_count}
              order={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Client ID</th>
        <th className="text-start p-1.5">Status</th>
        <th className="text-start p-1.5">Date</th>
        <th className="text-start p-1.5">Contribution Count</th>
        <th className="w-8"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  cusId,
  status,
  date,
  contributionCount,
  order,
}: {
  cusId: string;
  status: string;
  date: string;
  contributionCount: number;
  order: number;
}) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">{cusId}</td>
      <td className="p-1.5">{status}</td>
      <td className="p-1.5">{date}</td>
      <td className="p-1.5">{contributionCount}</td>
    </tr>
  );
};
