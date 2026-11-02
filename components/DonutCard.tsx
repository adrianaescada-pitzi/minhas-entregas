import { CARD } from "./styles";
import { DONUT_RADIUS, donutSegments, pctOf, type PeriodStats } from "@/lib/progress";

interface Props {
  title: string;
  subtitle: string;
  stats: PeriodStats;
  /** cores de: entregues, em andamento, a fazer */
  colors: [string, string, string];
}

/** Rosca em SVG próprio: centro com o % entregue, legenda com contagens e total. */
export function DonutCard({ title, subtitle, stats, colors }: Props) {
  const segments = donutSegments(stats, colors);
  const legend = [
    { label: "Entregues", value: stats.done, color: colors[0] },
    { label: "Em andamento", value: stats.doing, color: colors[1] },
    { label: "A fazer", value: stats.todo, color: colors[2] },
  ];

  return (
    <section aria-label={title} className={`${CARD} flex flex-col gap-[18px]`}>
      <div className="flex flex-col gap-0.5">
        <h2 className="m-0 text-lg font-bold tracking-[-0.01em]">{title}</h2>
        <span className="text-[13px] text-ink-2">{subtitle}</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-7">
        <div className="relative size-[190px]">
          <svg
            width="190"
            height="190"
            viewBox="0 0 190 190"
            role="img"
            aria-label={`${title}: ${stats.pct}% entregue, ${stats.done} de ${stats.total} tarefas`}
          >
            <circle cx="95" cy="95" r={DONUT_RADIUS} fill="none" strokeWidth="28" style={{ stroke: "var(--donut-track)" }} />
            {segments.map((s) => (
              <circle
                key={s.color}
                cx="95"
                cy="95"
                r={DONUT_RADIUS}
                fill="none"
                strokeWidth="28"
                transform="rotate(-90 95 95)"
                style={{ stroke: s.color, strokeDasharray: s.dashArray, strokeDashoffset: s.dashOffset }}
              />
            ))}
          </svg>
          <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[30px] leading-none font-extrabold tracking-[-0.02em]">{stats.pct}%</span>
            <span className="text-xs text-ink-2">entregue</span>
          </div>
        </div>
        <ul className="flex flex-[1_1_170px] flex-col gap-3">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2.5 text-[13px]">
              <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: l.color }} />
              <span className="flex-1 text-ink-2">{l.label}</span>
              <span className="font-bold">{l.value}</span>
              <span className="w-10 text-right font-bold">{pctOf(l.value, stats.total)}%</span>
            </li>
          ))}
          <li className="flex items-center gap-2.5 border-t border-line pt-3 text-[13px]">
            <span className="flex-1 text-ink-2">Total</span>
            <span className="font-extrabold">{stats.total}</span>
            <span className="w-10" />
          </li>
        </ul>
      </div>
    </section>
  );
}
