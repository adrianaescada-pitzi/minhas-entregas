import { formatLongDate, formatMonthYear, monthFromOffset, monthGrid, parseDate, plural } from "@/lib/dates";
import { byDueTime, isOverdue } from "@/lib/tasks";
import type { Task } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { CARD, PILL_LATE, STATUS_LABEL, STATUS_PILL } from "./styles";

interface Props {
  tasks: Task[];
  today: string;
  monthOffset: number;
  selectedDate: string;
  onMonthChange: (offset: number) => void;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const LEGEND = [
  { label: "Entregue", color: "#8B5CF6" },
  { label: "Aberta", color: "#EC4899" },
  { label: "Atrasada", color: "#EA580C" },
];

function dotColor(t: Task, date: string, today: string): string {
  if (t.status === "DONE") return "#8B5CF6";
  return date < today ? "#EA580C" : "#EC4899";
}

export function CalendarCard({ tasks, today, monthOffset, selectedDate, onMonthChange, onSelectDate }: Props) {
  const base = monthFromOffset(today, monthOffset);
  const month = base.getMonth();
  const cells = monthGrid(base.getFullYear(), month);
  const selected = tasks.filter((t) => t.dueDate === selectedDate).sort(byDueTime);

  return (
    <section id="calendario" aria-labelledby="h-cal" className={`${CARD} flex scroll-mt-5 flex-col gap-3.5`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="h-cal" className="m-0 text-lg font-bold tracking-[-0.01em]">
            Calendário
          </h2>
          <span className="text-[13px] text-ink-2" aria-live="polite">
            {formatMonthYear(base)}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[
            { label: "Mês anterior", delta: -1, Icon: ChevronLeftIcon },
            { label: "Próximo mês", delta: 1, Icon: ChevronRightIcon },
          ].map(({ label, delta, Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => onMonthChange(monthOffset + delta)}
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card text-ink"
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date) => {
          const d = parseDate(date);
          const inMonth = d.getMonth() === month;
          const list = tasks.filter((t) => t.dueDate === date);
          const sel = date === selectedDate;
          const isToday = date === today;
          return (
            <button
              key={date}
              type="button"
              aria-pressed={sel}
              aria-label={`${d.getDate()} de ${MONTHS[d.getMonth()]}${isToday ? " (hoje)" : ""}, ${plural(list.length, "tarefa", "tarefas")}`}
              onClick={() => onSelectDate(date)}
              className={`flex min-h-11 flex-col items-center justify-center gap-[3px] rounded-xl border-[1.5px] px-0 py-1 ${
                sel
                  ? "bg-action-diag border-transparent text-white"
                  : `${isToday ? "border-[#A78BFA] bg-cal-today" : "border-transparent bg-transparent"} ${
                      inMonth ? "text-ink" : "text-muted"
                    }`
              }`}
            >
              <span className={`text-[13px] ${isToday || sel ? "font-extrabold" : inMonth ? "font-semibold" : "font-normal"}`}>
                {d.getDate()}
              </span>
              <span className="flex h-[5px] gap-0.5">
                {list.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className="size-[5px] rounded-full"
                    style={{ background: sel ? "#FFFFFF" : dotColor(t, date, today) }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-ink-2">
        {LEGEND.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-[7px] rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 rounded-2xl bg-panel p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="m-0 text-sm font-bold">
            {selectedDate === today ? "Hoje · " : ""}
            {formatLongDate(selectedDate)}
          </h3>
          <span className="text-xs text-ink-2">{plural(selected.length, "tarefa", "tarefas")}</span>
        </div>
        <ul className="flex flex-col gap-2">
          {selected.map((t) => {
            const overdue = isOverdue(t, today);
            const label = overdue ? "Atrasada" : STATUS_LABEL[t.status];
            return (
              <li key={t.id} className="flex items-center gap-2.5 text-[13px]">
                <span className="w-[42px] font-bold text-ink-2">{t.dueTime ?? "—"}</span>
                <span className={`min-w-0 flex-1 ${t.status === "DONE" ? "text-muted line-through" : "text-ink"}`}>
                  {t.title}
                </span>
                <span
                  className={`inline-flex h-[22px] items-center rounded-[7px] px-2 text-[11px] font-bold whitespace-nowrap ${
                    overdue ? PILL_LATE : STATUS_PILL[t.status]
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        {selected.length === 0 && <p className="m-0 text-[13px] text-ink-2">Nenhuma tarefa neste dia.</p>}
      </div>
    </section>
  );
}
