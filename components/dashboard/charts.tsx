"use client"

import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ink, line } from "./tokens"

export interface SeriesSpec {
  key: string
  name: string
  color: string
}

const axisStyle = { fontSize: 11, fill: "#898781" }

function TooltipCard({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string; dataKey?: string | number }[]
  label?: string | number
  suffix: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[rgba(55,50,47,0.14)] bg-white px-3 py-2 shadow-[0px_4px_12px_rgba(55,50,47,0.12)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">{label}</div>
      <ul className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center gap-2 text-[12px] text-[#37322F]">
            <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: entry.color }} aria-hidden />
            <span className="text-[#605A57]">{entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums">
              {entry.value}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Legend that doubles as a direct label: each series shows its latest value,
 * so identity never depends on colour alone.
 */
function ValueLegend({
  specs,
  data,
  suffix,
}: {
  specs: SeriesSpec[]
  data: Record<string, any>[]
  suffix: string
}) {
  const last = data[data.length - 1]
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {specs.map((spec) => (
        <li key={spec.key} className="flex items-center gap-2">
          <span className="h-[3px] w-5 rounded-full" style={{ backgroundColor: spec.color }} aria-hidden />
          <span className="text-[12px] text-[#605A57]">{spec.name}</span>
          <span className="text-[12px] font-semibold tabular-nums text-[#37322F]">
            {last?.[spec.key] as number}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function TrendLines({
  data,
  specs,
  height = 240,
  suffix = "",
  domain = [0, 100],
  xKey = "month",
}: {
  data: Record<string, any>[]
  specs: SeriesSpec[]
  height?: number
  suffix?: string
  domain?: [number, number]
  xKey?: string
}) {
  return (
    <div>
      <ValueLegend specs={specs} data={data} suffix={suffix} />
      <div style={{ height }} className="mt-3 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...data]} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={line.grid} strokeDasharray="0" vertical={false} />
            <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={{ stroke: "#DAD7D2" }} />
            <YAxis
              tick={axisStyle}
              tickLine={false}
              axisLine={false}
              domain={domain}
              width={46}
              tickFormatter={(v: number) => `${v}${suffix}`}
            />
            <Tooltip
              content={<TooltipCard suffix={suffix} />}
              cursor={{ stroke: "#C3C2B7", strokeWidth: 1 }}
            />
            {specs.map((spec) => (
              <Line
                key={spec.key}
                type="monotone"
                dataKey={spec.key}
                name={spec.name}
                stroke={spec.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "#FFFFFF" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function GrowthArea({
  data,
  specs,
  height = 220,
  suffix = "",
  xKey = "month",
}: {
  data: Record<string, any>[]
  specs: SeriesSpec[]
  height?: number
  suffix?: string
  xKey?: string
}) {
  return (
    <div>
      <ValueLegend specs={specs} data={data} suffix={suffix} />
      <div style={{ height }} className="mt-3 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[...data]} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
            <defs>
              {specs.map((spec) => (
                <linearGradient key={spec.key} id={`fill-${spec.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={spec.color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={spec.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={line.grid} vertical={false} />
            <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={{ stroke: "#DAD7D2" }} />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={46} />
            <Tooltip content={<TooltipCard suffix={suffix} />} cursor={{ stroke: "#C3C2B7", strokeWidth: 1 }} />
            {specs.map((spec) => (
              <Area
                key={spec.key}
                type="monotone"
                dataKey={spec.key}
                name={spec.name}
                stroke={spec.color}
                strokeWidth={2}
                fill={`url(#fill-${spec.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/** Compact single-series line for tiles and table rows. */
export function Sparkline({
  data,
  dataKey,
  color,
  height = 40,
}: {
  data: Record<string, any>[]
  dataKey: string
  color: string
  height?: number
}) {
  return (
    <div style={{ height }} className="w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={[...data]} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const chartInk = ink
