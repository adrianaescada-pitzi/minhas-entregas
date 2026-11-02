import { formatDayMonth, formatShortDate } from "@/lib/dates";
import { periodStats } from "@/lib/progress";
import { matchesQuery, isDeliveredLate } from "@/lib/tasks";
import type { Task, TaskStatus } from "@/lib/types";
import { DocIcon } from "./icons";
import { StatusSwitch } from "./StatusSwitch";
import { CARD, PILL_LATE, PILL_OK, PRIORITY_BADGE, PRIORITY_LABEL, PRIORITY_TILE, STATUS_PILL } from "./styles";

export type StatusFilter = "ALL" | TaskStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "TODO", label: "A fazer" },
  { value: "DOING", label: "Em andamento" },
  { value: "DONE", label: "Concluídas" },
];

interface Props {
  /** todas as tarefas com prazo hoje, já ordenadas por horário */
  tasks: Task[];
  today: string;
  filter: StatusFilter;
  query: string;
  onFilterChange: (filter: StatusFilter) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TH = "bg-thead px-3.5 py-3 font-semibold";

function reminderLabel(t: Task): string {
  if (!t.reminderAt) return "—";
  const time = t.reminderAt.slice(11, 16);
  const date = t.reminderAt.slice(0, 10);
  return date === t.dueDate ? time : `${formatDayMonth(date)} ${time}`;
}

function deliveredLabel(t: Task, today: string): { text: string; className: string } {
  if (t.status !== "DONE" || !t.deliveredAt) return { text: "Pendente", className: STATUS_PILL.TODO };
  const day = t.deliveredAt.slice(0, 10);
  const time = t.deliveredAt.slice(11, 16);
  const late = isDeliveredLate(t);
  const when = day === today ? `Hoje, ${time}` : `${formatShortDate(day)}, ${time}`;
  return { text: `${when}${late ? " · atraso" : ""}`, className: late ? PILL_LATE : PILL_OK };
}

export function TodayTable({ tasks, today, filter, query, onFilterChange, onStatusChange }: Props) {
  const stats = periodStats(tasks);
  const counts: Record<StatusFilter, number> = { ALL: stats.total, TODO: stats.todo, DOING: stats.doing, DONE: stats.done };
  const rows = tasks.filter((t) => (filter === "ALL" || t.status === filter) && matchesQuery(t, query));

  return (
    <section id="hoje" aria-labelledby="h-hoje" className={`${CARD} flex scroll-mt-5 flex-col gap-[18px]`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="h-hoje" className="m-0 text-lg font-bold tracking-[-0.01em]">
            Tarefas de hoje
          </h2>
          <span className="text-[13px] text-ink-2">Só o que vence hoje, por ordem de prazo</span>
        </div>
        <div role="group" aria-label="Filtrar por status" className="inline-flex flex-wrap gap-1 rounded-field bg-subtle p-1">
          {FILTERS.map(({ value, label }) => {
            const on = filter === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={on}
                onClick={() => onFilterChange(value)}
                className={`min-h-11 whitespace-nowrap rounded-[10px] border-0 px-3.5 text-[13px] font-bold ${
                  on ? "bg-tab-active text-pink-soft-fg shadow-seg" : "bg-transparent text-ink-2"
                }`}
              >
                {label} <span className="font-semibold opacity-80">{counts[value]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela de tarefas de hoje">
        <table className="w-full min-w-[900px] text-[13px]">
          <thead>
            <tr className="text-left text-xs text-ink-2">
              <th scope="col" className={`${TH} w-11 rounded-l-xl`}>
                #
              </th>
              <th scope="col" className={TH}>Tarefa</th>
              <th scope="col" className={TH}>Prioridade</th>
              <th scope="col" className={TH}>Prazo</th>
              <th scope="col" className={TH}>Lembrete</th>
              <th scope="col" className={TH}>Status</th>
              <th scope="col" className={`${TH} rounded-r-xl`}>Entrega</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => {
              const done = t.status === "DONE";
              const delivered = deliveredLabel(t, today);
              return (
                <tr key={t.id}>
                  <td className="border-b border-line px-3.5 py-3 text-ink-2">{i + 1}</td>
                  <td className="border-b border-line px-3.5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`inline-flex size-10 flex-none items-center justify-center rounded-xl text-white ${PRIORITY_TILE[t.priority]}`}
                      >
                        <DocIcon size={18} />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className={`font-bold ${done ? "text-muted line-through" : "text-ink"}`}>{t.title}</span>
                        <span className="text-xs text-muted">{t.projectName ?? "Pessoal"}</span>
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-line px-3.5 py-3">
                    <span
                      className={`inline-flex h-[26px] items-center rounded-lg px-2.5 text-xs font-bold ${PRIORITY_BADGE[t.priority]}`}
                    >
                      {PRIORITY_LABEL[t.priority]}
                    </span>
                  </td>
                  <td className="border-b border-line px-3.5 py-3 font-semibold whitespace-nowrap">
                    {t.dueTime ?? "Sem horário"}
                  </td>
                  <td className="border-b border-line px-3.5 py-3 whitespace-nowrap text-ink-2">{reminderLabel(t)}</td>
                  <td className="border-b border-line px-3.5 py-3">
                    <StatusSwitch task={t} onChange={onStatusChange} />
                  </td>
                  <td className="border-b border-line px-3.5 py-3">
                    <span
                      className={`inline-flex h-[26px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold whitespace-nowrap ${delivered.className}`}
                    >
                      {delivered.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="m-0 px-3.5 py-5 text-ink-2">Nenhuma tarefa encontrada com esse filtro.</p>}
      </div>
    </section>
  );
}
