// "use client";

// import React from "react";
// import { FiEye } from "react-icons/fi";
// import {
//   Radar,
//   RadarChart,
//   PolarGrid,
//   Legend,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";

// const data = [
//   {
//     feature: "Tracking",
//     mobile: 15,
//     desktop: 110,
//     max: 150,
//   },
//   {
//     feature: "Builder",
//     mobile: 130,
//     desktop: 90,
//     max: 150,
//   },
//   {
//     feature: "Schedule",
//     mobile: 86,
//     desktop: 130,
//     max: 150,
//   },
//   {
//     feature: "AI Train",
//     mobile: 125,
//     desktop: 40,
//     max: 150,
//   },
//   {
//     feature: "Interval",
//     mobile: 148,
//     desktop: 90,
//     max: 150,
//   },
// ];

// export const UsageRadar = () => {
//   return (
//     <div className="col-span-4 overflow-hidden rounded border border-stone-300">
//       <div className="p-4">
//         <h3 className="flex items-center gap-1.5 font-medium">
//           <FiEye /> Usage
//         </h3>
//       </div>

//       <div className="h-64 px-4">
//         <ResponsiveContainer width="100%" height="100%">
//           <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
//             <PolarGrid />
//             <PolarAngleAxis className="text-xs font-bold" dataKey="feature" />
//             <PolarRadiusAxis angle={30} domain={[0, 150]} />
//             <Radar
//               name="Mobile"
//               dataKey="mobile"
//               stroke="#18181b"
//               fill="#18181b"
//               fillOpacity={0.2}
//             />
//             <Radar
//               name="Desktop"
//               dataKey="desktop"
//               stroke="#5b21b6"
//               fill="#5b21b6"
//               fillOpacity={0.2}
//             />
//             <Tooltip
//               wrapperClassName="text-sm rounded"
//               labelClassName="text-xs text-stone-500"
//             />
//             <Legend />
//           </RadarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };
// "use client";

// import React, { useState, useEffect } from "react";
// import { FiPieChart } from "react-icons/fi";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// export const UsageRadar = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://adaptfl-server.onrender.com/get_data");
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }

//         const text = await response.text();
//         let result;
//         try {
//           result = JSON.parse(text);
//         } catch (e) {
//           throw new Error("Invalid JSON response");
//         }

//         const clientData = result.clients.map((client: any) => ({
//           name: client.csn,
//           value: client.contribution_count,
//         }));

//         setData(clientData);
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="col-span-4 overflow-hidden rounded border border-stone-300 bg-white shadow-md">
//       <div className="p-4">
//         <h3 className="flex items-center gap-1.5 font-medium text-lg text-stone-700">
//           <FiPieChart /> Client Contributions
//         </h3>
//       </div>

//       <div className="h-64 px-4">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

"use client";

import React, { useState, useEffect } from "react";
import { FiPieChart } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Updated colors: shades of purple, blue, and dark grey
const COLORS = [
  "#5F4B8B", // Dark Purple
  "#4C6A92", // Blue
  "#2E3A47", // Dark Grey
  "#3F497F", // Medium Blue
];

export const UsageRadar = () => {
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

        const clientData = result.clients.map((client: any) => ({
          name: client.csn,
          value: client.contribution_count,
        }));

        setData(clientData);
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

  const totalContributionCount = data.reduce((total, client) => total + client.value, 0);

  return (
    <div className="col-span-4 overflow-hidden rounded border border-stone-300 bg-white shadow-md">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium text-lg text-stone-700">
          <FiPieChart /> Client Contributions
        </h3>
        <h5 className="mt-2 text-sm text-gray-600">Total Contribution Count: {totalContributionCount}</h5>
      </div>

      <div className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({value }) => `${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
