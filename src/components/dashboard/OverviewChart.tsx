"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Oca", total: 1200 },
  { name: "Şub", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Nis", total: 3200 },
  { name: "May", total: 2900 },
  { name: "Haz", total: 4500 },
  { name: "Tem", total: 4200 },
  { name: "Ağu", total: 5100 },
  { name: "Eyl", total: 4800 },
  { name: "Eki", total: 6100 },
  { name: "Kas", total: 5900 },
  { name: "Ara", total: 7200 },
]

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#52525b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          stroke="#52525b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₺${value}`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "8px" }}
          itemStyle={{ color: "#fafafa" }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#fafafa"
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: "#09090b" }}
          activeDot={{ r: 6, stroke: "#fafafa", fill: "#09090b", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
