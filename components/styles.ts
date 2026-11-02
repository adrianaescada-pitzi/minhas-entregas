import type { Priority, TaskStatus } from "@/lib/types";

/** Classes (todas apontam para tokens de tema) compartilhadas entre os componentes. */

export const PRIORITY_LABEL: Record<Priority, string> = { HIGH: "Alta", MEDIUM: "Média", LOW: "Baixa" };

/** Pílula de prioridade. A cor sempre vem acompanhada do texto. */
export const PRIORITY_BADGE: Record<Priority, string> = {
  HIGH: "bg-prio-high-bg text-prio-high-fg",
  MEDIUM: "bg-prio-med-bg text-prio-med-fg",
  LOW: "bg-prio-low-bg text-prio-low-fg",
};

/** Bloco de ícone da tarefa (mesmo gradiente nos dois temas). */
export const PRIORITY_TILE: Record<Priority, string> = {
  HIGH: "bg-[linear-gradient(135deg,#F9A8D4,#DB2777)]",
  MEDIUM: "bg-[linear-gradient(135deg,#C4B5FD,#7C3AED)]",
  LOW: "bg-[linear-gradient(135deg,#BFDBFE,#3B82F6)]",
};

/** Botão de prioridade selecionado no modal. */
export const PRIORITY_SELECTED: Record<Priority, string> = {
  HIGH: "border-prio-high-bd bg-prio-high-bg text-prio-high-fg",
  MEDIUM: "border-prio-med-bd bg-prio-med-bg text-prio-med-fg",
  LOW: "border-prio-low-bd bg-prio-low-bg text-prio-low-fg",
};

export const STATUS_LABEL: Record<TaskStatus, string> = { TODO: "A fazer", DOING: "Em andamento", DONE: "Concluída" };

export const STATUS_ORDER: TaskStatus[] = ["TODO", "DOING", "DONE"];

/** Opção ativa do seletor segmentado de status. */
export const STATUS_ACTIVE: Record<TaskStatus, string> = {
  TODO: "bg-seg-todo-bg text-ink shadow-seg",
  DOING: "bg-seg-doing-bg text-seg-doing-fg shadow-seg",
  DONE: "bg-seg-done-bg text-seg-done-fg shadow-seg",
};

/** Pílula de status. */
export const STATUS_PILL: Record<TaskStatus, string> = {
  TODO: "bg-pill-todo-bg text-pill-todo-fg",
  DOING: "bg-pill-doing-bg text-pill-doing-fg",
  DONE: "bg-pill-done-bg text-pill-done-fg",
};

export const PILL_LATE = "bg-late-bg text-late-fg";
export const PILL_OK = "bg-pill-done-bg text-pill-done-fg";

export const CARD = "rounded-card border border-border bg-card p-6 shadow-card";
