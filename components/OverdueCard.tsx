import { formatShortDate, plural } from "@/lib/dates";
import { daysLate } from "@/lib/tasks";
import type { Task, TaskStatus } from "@/lib/types";
import { AlertIcon } from "./icons";
import { StatusSwitch } from "./StatusSwitch";
import { CARD, PRIORITY_BADGE, PRIORITY_LABEL } from "./styles";

interface Props {
  tasks: Task[];
  today: string;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function OverdueCard({ tasks, today, onStatusChange }: Props) {
  return (
    <section id="atrasadas" aria-labelledby="h-atrasadas" className={`${CARD} flex scroll-mt-5 flex-col gap-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="h-atrasadas" className="m-0 text-lg font-bold tracking-[-0.01em]">
            Atrasadas
          </h2>
          <span className="text-[13px] text-ink-2">Prazo vencido, fora da lista do dia</span>
        </div>
        <span className="inline-flex h-7 items-center rounded-full bg-late-bg px-3 text-xs font-bold whitespace-nowrap text-late-fg">
          {plural(tasks.length, "tarefa", "tarefas")}
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {tasks.map((t) => (
          <li key={t.id} className="flex flex-col gap-3 rounded-2xl border border-late-item-border bg-late-item-bg p-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-late-bg text-late-icon"
              >
                <AlertIcon size={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-bold">{t.title}</span>
                <span className="text-xs font-semibold text-late-fg">
                  Venceu {formatShortDate(t.dueDate)} · {plural(daysLate(t, today), "dia", "dias")} de atraso
                </span>
              </span>
              <span
                className={`inline-flex h-6 items-center rounded-lg px-2 text-[11px] font-bold ${PRIORITY_BADGE[t.priority]}`}
              >
                {PRIORITY_LABEL[t.priority]}
              </span>
            </div>
            <StatusSwitch task={t} onChange={onStatusChange} variant="block" />
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p className="m-0 text-[13px] text-ink-2">Nenhuma tarefa atrasada.</p>}
    </section>
  );
}
