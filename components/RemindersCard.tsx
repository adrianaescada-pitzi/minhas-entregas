import { formatShortDate, plural } from "@/lib/dates";
import { isReminderPending, reminderStateLabel, reminderTime, remindersOfDay } from "@/lib/reminders";
import type { Task } from "@/lib/types";
import { BellFilledIcon } from "./icons";
import { CARD } from "./styles";

interface Props {
  tasks: Task[];
  today: string;
  onSnooze: (id: string) => void;
  onDismiss: (id: string) => void;
}

function dueLabel(t: Task, today: string): string {
  const when = t.dueDate === today ? "hoje" : formatShortDate(t.dueDate);
  return t.dueTime ? `Prazo ${when} às ${t.dueTime}` : `Prazo ${when}, sem horário definido`;
}

export function RemindersCard({ tasks, today, onSnooze, onDismiss }: Props) {
  const ofDay = remindersOfDay(tasks, today);
  const pending = ofDay.filter(isReminderPending);
  const next = pending[0];

  return (
    <section id="lembretes" aria-labelledby="h-lembretes" className={`${CARD} flex scroll-mt-5 flex-col gap-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="h-lembretes" className="m-0 text-lg font-bold tracking-[-0.01em]">
            Lembretes
          </h2>
          <span className="text-[13px] text-ink-2">Avisos antes do prazo de cada tarefa</span>
        </div>
        <span className="inline-flex h-7 items-center rounded-full bg-pink-soft-bg px-3 text-xs font-bold whitespace-nowrap text-pink-soft-fg">
          {plural(pending.length, "pendente", "pendentes")}
        </span>
      </div>

      {next && (
        <div className="flex flex-col gap-3 rounded-2xl bg-(image:--rem-hi) p-[18px]">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-card text-[#DB2777]"
            >
              <BellFilledIcon size={20} />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs font-bold text-pink-soft-fg">Próximo · {reminderTime(next)}</span>
              <span className="font-bold">{next.title}</span>
              <span className="text-xs text-ink-2">{dueLabel(next, today)}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSnooze(next.id)}
              className="min-h-11 flex-1 rounded-xl border-0 bg-card text-[13px] font-bold text-ink"
            >
              Adiar 15 min
            </button>
            <button
              type="button"
              onClick={() => onDismiss(next.id)}
              className="bg-action min-h-11 flex-1 rounded-xl border-0 text-[13px] font-bold text-white"
            >
              Dispensar
            </button>
          </div>
        </div>
      )}

      <ul className="flex flex-col">
        {ofDay.map((t) => {
          const off = t.status === "DONE" || !isReminderPending(t);
          return (
            <li key={t.id} className="flex items-center gap-3 border-b border-line py-3">
              <span
                className={`inline-flex h-[30px] w-14 flex-none items-center justify-center rounded-[9px] text-xs font-bold ${
                  off ? "bg-pill-todo-bg text-pill-todo-fg" : "bg-pink-soft-bg text-pink-soft-fg"
                }`}
              >
                {reminderTime(t)}
              </span>
              <span className={`min-w-0 flex-1 text-[13px] font-semibold ${off ? "text-muted line-through" : "text-ink"}`}>
                {t.title}
              </span>
              <span className="text-xs whitespace-nowrap text-ink-2">{reminderStateLabel(t)}</span>
            </li>
          );
        })}
      </ul>
      {ofDay.length === 0 && <p className="m-0 text-[13px] text-ink-2">Nenhum lembrete para hoje.</p>}
    </section>
  );
}
