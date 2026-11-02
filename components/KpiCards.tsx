import type { PeriodStats } from "@/lib/progress";
import { plural } from "@/lib/dates";
import { AlertIcon, BarsIcon, CheckCircleIcon, PlayIcon } from "./icons";

interface Props {
  day: PeriodStats;
  overdueCount: number;
  /** dias de atraso da tarefa atrasada mais antiga */
  oldestOverdueDays: number;
}

export function KpiCards({ day, overdueCount, oldestOverdueDays }: Props) {
  const kpis = [
    {
      label: "Tarefas de hoje",
      value: day.total,
      strong: plural(day.total - day.done, "aberta", "abertas"),
      note: "até o fim do dia",
      strongClass: "text-ink",
      tile: "bg-(image:--kpi-1-bg) text-kpi-1-fg",
      Icon: BarsIcon,
    },
    {
      label: "Entregues hoje",
      value: day.done,
      strong: `↑ ${day.pct}%`,
      note: "do dia concluído",
      strongClass: "text-pill-done-fg",
      tile: "bg-(image:--kpi-2-bg) text-kpi-2-fg",
      Icon: CheckCircleIcon,
    },
    {
      label: "Em andamento",
      value: day.doing,
      strong: plural(day.todo, "tarefa", "tarefas"),
      note: "ainda a começar",
      strongClass: "text-ink",
      tile: "bg-(image:--kpi-3-bg) text-kpi-3-fg",
      Icon: PlayIcon,
    },
    {
      label: "Atrasadas",
      value: overdueCount,
      strong: overdueCount ? `há ${plural(oldestOverdueDays, "dia", "dias")}` : "nenhuma",
      note: overdueCount ? "a mais antiga" : "pendente",
      strongClass: "text-late-fg",
      tile: "bg-(image:--kpi-4-bg) text-kpi-4-fg",
      Icon: AlertIcon,
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-5">
      {kpis.map(({ label, value, strong, note, strongClass, tile, Icon }) => (
        <section
          key={label}
          className="flex items-start gap-4 rounded-card border border-border bg-card p-[22px] shadow-card"
        >
          <span
            aria-hidden="true"
            className={`inline-flex size-[52px] flex-none items-center justify-center rounded-2xl ${tile}`}
          >
            <Icon size={24} />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="m-0 text-sm font-semibold text-ink-2">{label}</h2>
            <span className="text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em]">{value}</span>
            <span className="text-xs text-muted">
              <span className={`font-bold ${strongClass}`}>{strong}</span> {note}
            </span>
          </div>
        </section>
      ))}
    </div>
  );
}
