// "use client";

// import React, { useState, useEffect } from "react";
// import { FiUser } from "react-icons/fi";
// import {
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Line,
//   LineChart,
// } from "recharts";

// interface Client {
//   created_at: string;
//   contribution_count: number;
// }

// interface GlobalModel {
//   created_at: string;
//   version: number;
// }

// export const ActivityGraph = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://api.allorigins.win/raw?url=https://adaptfl-server.onrender.com/get_data");
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }

//         const result = await response.json();

//         // Create a map of all timestamps to ensure we have all time points
//         const timeMap = new Map();
        
//         // Process both clients and models to get all unique timestamps
//         [...result.clients, ...result.global_models].forEach((item: Client | GlobalModel) => {
//           const timestamp = new Date(item.created_at);
//           const timeKey = timestamp.toISOString();
//           if (!timeMap.has(timeKey)) {
//             timeMap.set(timeKey, {
//               timestamp,
//               contributions: 0,
//               version: null
//             });
//           }
//         });

//         // Process client contributions
//         result.clients.forEach((client: Client) => {
//           const timeKey = new Date(client.created_at).toISOString();
//           const existing = timeMap.get(timeKey);
//           existing.contributions += client.contribution_count;
//         });

//         // Process global model versions
//         result.global_models.forEach((model: GlobalModel) => {
//           const timeKey = new Date(model.created_at).toISOString();
//           const existing = timeMap.get(timeKey);
//           existing.version = model.version;
//         });

//         // Convert map to array and sort by timestamp
//         const formattedData = Array.from(timeMap.values())
//           .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
//           .map((item, index, array) => {
//             // Carry forward the last known version if current version is null
//             if (item.version === null && index > 0) {
//               item.version = array[index - 1].version;
//             }
            
//             return {
//               name: item.timestamp.toLocaleString("default", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: false
//               }),
//               Contributions: item.contributions,
//               Version: item.version || 0,
//               timestamp: item.timestamp // Keep for sorting
//             };
//           });

//         setData(formattedData);
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <div className="flex justify-center items-center h-80">Loading...</div>;
//   if (error) return <div className="flex justify-center items-center h-80 text-red-500">Error: {error}</div>;
//   if (data.length === 0) return <div className="flex justify-center items-center h-80">No data available</div>;

//   return (
//     <div className="col-span-8 overflow-hidden rounded-lg border border-stone-300 shadow-lg bg-white">
//       <div className="p-4 border-stone-300">
//         <h3 className="flex items-center gap-1.5 text-xl font-medium">
//           <FiUser className="text-stone-600" /> Global Aggregation Over Time
//         </h3>
//       </div>

//       <div className="h-80 px-4 py-2">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={data}
//             margin={{
//               top: 20,
//               right: 30,
//               left: 20,
//               bottom: 20,
//             }}
//         >
//             <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
//             <XAxis
//               dataKey="name"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fontSize: 12 }}
//               interval="preserveStartEnd"
//               padding={{ left: 10, right: 10 }}
//             />
//             <YAxis
//               yAxisId="left"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fontSize: 12 }}
//               label={{ 
//                 value: 'Contributions', 
//                 angle: -90, 
//                 position: 'insideLeft',
//                 style: { fontSize: 12 }
//               }}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fontSize: 12 }}
//               label={{ 
//                 value: 'Version', 
//                 angle: 90, 
//                 position: 'insideRight',
//                 style: { fontSize: 12 }
//               }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "rgba(255, 255, 255, 0.95)",
//                 borderRadius: "6px",
//                 border: "1px solid #e4e4e7",
//                 padding: "8px 12px",
//               }}
//               labelStyle={{ fontSize: 12, marginBottom: 4 }}
//               itemStyle={{ fontSize: 12, padding: "2px 0" }}
//             />
//             <Line
//               yAxisId="left"
//               type="monotone"
//               dataKey="Contributions"
//               stroke="#6366f1"
//               strokeWidth={2}
//               dot={false}
//               activeDot={{ r: 6 }}
//               name="Contributions"
//             />
//             <Line
//               yAxisId="right"
//               type="stepAfter"
//               dataKey="Version"
//               stroke="#2563eb"
//               strokeWidth={2}
//               dot={false}
//               activeDot={{ r: 6 }}
//               name="Version"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

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
        const response = await fetch("https://adaptfl-server.onrender.com/get_data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          throw new Error("Invalid JSON response");
        }

        // Create a map of all timestamps to ensure we have all time points
        const timeMap = new Map();
        
        // Process both clients and models to get all unique timestamps
        [...result.clients, ...result.global_models].forEach((item: Client | GlobalModel) => {
          const timestamp = new Date(item.created_at);
          const timeKey = timestamp.toISOString();
          if (!timeMap.has(timeKey)) {
            timeMap.set(timeKey, {
              timestamp,
              contributions: 0,
              version: null
            });
          }
        });

        // Process client contributions
        result.clients.forEach((client: Client) => {
          const timeKey = new Date(client.created_at).toISOString();
          const existing = timeMap.get(timeKey);
          existing.contributions += client.contribution_count;
        });

        // Process global model versions
        result.global_models.forEach((model: GlobalModel) => {
          const timeKey = new Date(model.created_at).toISOString();
          const existing = timeMap.get(timeKey);
          existing.version = model.version;
        });

        // Convert map to array and sort by timestamp
        const formattedData = Array.from(timeMap.values())
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          .map((item, index, array) => {
            // Carry forward the last known version if current version is null
            if (item.version === null && index > 0) {
              item.version = array[index - 1].version;
            }
            
            return {
              name: item.timestamp.toLocaleString("default", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              }),
              Contributions: item.contributions,
              Version: item.version || 0,
              timestamp: item.timestamp // Keep for sorting
            };
          });

        setData(formattedData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-80">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-80 text-red-500">Error: {error}</div>;
  if (data.length === 0) return <div className="flex justify-center items-center h-80">No data available</div>;

  return (
    <div className="col-span-8 overflow-hidden rounded-lg border border-stone-300 shadow-lg bg-white">
      <div className="p-4 border-stone-300">
        <h3 className="flex items-center gap-1.5 text-xl font-medium">
          <FiUser className="text-stone-600" /> Global Aggregation Over Time
        </h3>
      </div>

      <div className="h-80 px-4 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Contributions', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12 }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Version', 
                angle: 90, 
                position: 'insideRight',
                style: { fontSize: 12 }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "6px",
                border: "1px solid #e4e4e7",
                padding: "8px 12px",
              }}
              labelStyle={{ fontSize: 12, marginBottom: 4 }}
              itemStyle={{ fontSize: 12, padding: "2px 0" }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Contributions"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name="Contributions"
            />
            <Line
              yAxisId="right"
              type="stepAfter"
              dataKey="Version"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name="Version"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};