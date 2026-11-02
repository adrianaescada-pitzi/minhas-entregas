import type { Task } from "./types";

export const pctOf = (part: number, total: number): number => (total ? Math.round((part / total) * 100) : 0);

export interface PeriodStats {
  total: number;
  done: number;
  doing: number;
  todo: number;
  /** concluídas ÷ total, arredondado; total zero = 0 */
  pct: number;
}

export function periodStats(tasks: Task[]): PeriodStats {
  const done = tasks.filter((t) => t.status === "DONE").length;
  const doing = tasks.filter((t) => t.status === "DOING").length;
  return { total: tasks.length, done, doing, todo: tasks.length - done - doing, pct: pctOf(done, tasks.length) };
}

// ---------- rosca ----------

export const DONUT_RADIUS = 72;
export const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const SEGMENT_GAP = 4;

export interface DonutSegment {
  color: string;
  dashArray: string;
  dashOffset: string;
}

/** Segmentos (entregues, em andamento, a fazer) como stroke-dasharray/offset de círculos sobrepostos. */
export function donutSegments(stats: PeriodStats, colors: [string, string, string]): DonutSegment[] {
  const parts: [number, string][] = [
    [stats.done, colors[0]],
    [stats.doing, colors[1]],
    [stats.todo, colors[2]],
  ];
  const segments: DonutSegment[] = [];
  let offset = 0;
  for (const [count, color] of parts) {
    if (!stats.total || !count) continue;
    const length = (count / stats.total) * DONUT_CIRCUMFERENCE;
    const gap = count === stats.total ? 0 : SEGMENT_GAP;
    segments.push({
      color,
      dashArray: `${Math.max(0, length - gap).toFixed(1)} ${DONUT_CIRCUMFERENCE.toFixed(1)}`,
      dashOffset: (-offset).toFixed(1),
    });
    offset += length;
  }
  return segments;
}
