import { STATUS_ACTIVE, STATUS_LABEL, STATUS_ORDER } from "./styles";
import type { Task, TaskStatus } from "@/lib/types";

interface Props {
  task: Task;
  onChange: (id: string, status: TaskStatus) => void;
  /** "inline" na tabela; "block" ocupa a largura toda (card de atrasadas). */
  variant?: "inline" | "block";
}

/** Seletor segmentado de status (A fazer / Em andamento / Concluída). */
export function StatusSwitch({ task, onChange, variant = "inline" }: Props) {
  const block = variant === "block";
  return (
    <div
      role="group"
      aria-label={`Status de ${task.title}`}
      className={
        block
          ? "flex gap-0.5 rounded-xl border border-late-item-border bg-card p-[3px]"
          : "inline-flex gap-0.5 rounded-xl bg-subtle p-[3px]"
      }
    >
      {STATUS_ORDER.map((status) => {
        const on = task.status === status;
        return (
          <button
            key={status}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(task.id, status)}
            className={`whitespace-nowrap rounded-[9px] border-0 text-xs font-bold ${
              block ? "min-h-11 flex-1 px-2" : "min-h-11 px-3"
            } ${on ? STATUS_ACTIVE[status] : "bg-transparent text-muted"}`}
          >
            {STATUS_LABEL[status]}
          </button>
        );
      })}
    </div>
  );
}
