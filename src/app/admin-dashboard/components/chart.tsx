"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// ✅ Generic helper preserves props of each chart component
const dyn = <T extends ComponentType<any>>(importer: () => Promise<{ default: T }>): T =>
  dynamic(importer, { ssr: false }) as unknown as T;

// Core charts
export const ResponsiveContainer = dyn(
  () => import("recharts").then(m => ({ default: m.ResponsiveContainer }))
);
export const LineChart = dyn(
  () => import("recharts").then(m => ({ default: m.LineChart }))
);
export const Line = dyn(
  () => import("recharts").then(m => ({ default: m.Line }))
);
export const XAxis = dyn(
  () => import("recharts").then(m => ({ default: m.XAxis }))
);
export const YAxis = dyn(
  () => import("recharts").then(m => ({ default: m.YAxis }))
);
export const Tooltip = dyn(
  () => import("recharts").then(m => ({ default: m.Tooltip }))
);
export const PieChart = dyn(
  () => import("recharts").then(m => ({ default: m.PieChart }))
);
export const Cell = dyn(
  () => import("recharts").then(m => ({ default: m.Cell }))
);
export const BarChart = dyn(
  () => import("recharts").then(m => ({ default: m.BarChart }))
);
export const CartesianGrid = dyn(
  () => import("recharts").then(m => ({ default: m.CartesianGrid }))
);
export const Legend = dyn(
  () => import("recharts").then(m => ({ default: m.Legend }))
);
export const AreaChart = dyn(
  () => import("recharts").then(m => ({ default: m.AreaChart }))
);

// // Components with required props
// export const Bar = dyn(
//   () => import("recharts").then(m => ({ default: m.Bar }))
// );
// export const Pie = dyn(
//   () => import("recharts").then(m => ({ default: m.Pie }))
// );
// export const Area = dyn(
//   () => import("recharts").then(m => ({ default: m.Area }))
// );
