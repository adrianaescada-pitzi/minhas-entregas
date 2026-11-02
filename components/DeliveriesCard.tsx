import { formatDayMonth, formatShortDate } from "@/lib/dates";
import { deliveries, isDeliveredLate } from "@/lib/tasks";
import type { Task } from "@/lib/types";
import { CheckCircleIcon } from "./icons";
import { CARD, PILL_LATE, PILL_OK } from "./styles";

interface Props {
  tasks: Task[];
  today: string;
}

/** Registro de entregas: quando cada tarefa foi concluída e se foi no prazo. */
export function DeliveriesCard({ tasks, today }: Props) {
  const list = deliveries(tasks);
  return (
    <section
      id="entregas"
      aria-labelledby="h-entregas"
      className={`${CARD} flex min-w-0 flex-[1_1_300px] scroll-mt-5 flex-col gap-3.5`}
    >
      <div className="flex flex-col gap-0.5">
        <h2 id="h-entregas" className="m-0 text-lg font-bold tracking-[-0.01em]">
          Registro de entregas
        </h2>
        <span className="text-[13px] text-ink-2">Quando cada tarefa foi concluída</span>
      </div>
      <ul className="flex flex-col">
        {list.map((t) => {
          const day = (t.deliveredAt as string).slice(0, 10);
          const time = (t.deliveredAt as string).slice(11, 16);
          const late = isDeliveredLate(t);
          return (
            <li key={t.id} className="flex items-center gap-3 border-b border-line py-3">
              <span
                aria-hidden="true"
                className="inline-flex size-9 flex-none items-center justify-center rounded-[11px] bg-purple-soft-bg text-purple-soft-fg"
              >
                <CheckCircleIcon size={18} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[13px] font-bold">{t.title}</span>
                <span className="text-xs text-ink-2">
                  {day === today ? "Hoje" : formatShortDate(day)}, {time} · prazo {formatDayMonth(t.dueDate)}
                  {t.dueTime ? ` ${t.dueTime}` : ""}
                </span>
              </span>
              <span
                className={`inline-flex h-6 items-center rounded-lg px-2 text-[11px] font-bold whitespace-nowrap ${
                  late ? PILL_LATE : PILL_OK
                }`}
              >
                {late ? "Com atraso" : "No prazo"}
              </span>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="m-0 text-[13px] text-ink-2">Nenhuma entrega registrada ainda.</p>}
    </section>
  );
}
