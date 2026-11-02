import { diffDays, dueStamp, workWeek } from "./dates";
import { computeReminderAt } from "./reminders";
import type { NewTaskInput, Task, TaskStatus } from "./types";

/** Ordena por horário; tarefas sem horário vão para o fim. */
export const byDueTime = (a: Task, b: Task): number => (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99");

/** Só as tarefas com prazo hoje, por ordem de horário. */
export const todayTasks = (tasks: Task[], today: string): Task[] =>
  tasks.filter((t) => t.dueDate === today).sort(byDueTime);

/** Prazo anterior a hoje e status diferente de concluída. */
export const isOverdue = (t: Task, today: string): boolean => t.dueDate < today && t.status !== "DONE";

/** Atrasadas, da mais antiga para a mais recente. */
export const overdueTasks = (tasks: Task[], today: string): Task[] =>
  tasks.filter((t) => isOverdue(t, today)).sort((a, b) => a.dueDate.localeCompare(b.dueDate) || byDueTime(a, b));

/** Tarefas de segunda a sexta da semana corrente. */
export function weekTasks(tasks: Task[], today: string): Task[] {
  const { start, end } = workWeek(today);
  return tasks.filter((t) => t.dueDate >= start && t.dueDate <= end);
}

/** Dias de atraso de uma tarefa em relação a hoje. */
export const daysLate = (t: Task, today: string): number => diffDays(t.dueDate, today);

/** Entregue com atraso: deliveredAt > prazo (prazo sem horário vale até 23:59). */
export const isDeliveredLate = (t: Task): boolean =>
  t.status === "DONE" && !!t.deliveredAt && t.deliveredAt > dueStamp(t.dueDate, t.dueTime);

/** Entregas mais recentes primeiro. */
export const deliveries = (tasks: Task[], limit = 7): Task[] =>
  tasks
    .filter((t) => t.status === "DONE" && t.deliveredAt)
    .sort((a, b) => (b.deliveredAt as string).localeCompare(a.deliveredAt as string))
    .slice(0, limit);

/**
 * Muda o status. Ao concluir grava deliveredAt (mantém o existente se já estava
 * concluída); ao reabrir, limpa deliveredAt.
 */
export function setTaskStatus(task: Task, status: TaskStatus, nowStamp: string): Task {
  if (task.status === status) return task;
  const deliveredAt = status === "DONE" ? nowStamp : null;
  return { ...task, status, deliveredAt };
}

export function createTask(input: NewTaskInput): Task {
  return {
    id: `task-${crypto.randomUUID()}`,
    title: input.title.trim(),
    dueDate: input.dueDate,
    dueTime: input.dueTime,
    priority: input.priority,
    reminderOffset: input.reminderOffset,
    reminderAt: computeReminderAt(input.dueDate, input.dueTime, input.reminderOffset),
    reminderState: "SCHEDULED",
    status: "TODO",
    deliveredAt: null,
    projectName: input.projectName,
  };
}

/** Horários do modal: 30 em 30 min, das 07:00 às 22:00. */
export const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 7; h <= 22; h++) {
    for (const m of ["00", "30"]) {
      if (h === 22 && m === "30") continue;
      out.push(`${String(h).padStart(2, "0")}:${m}`);
    }
  }
  return out;
})();

/** Texto livre → busca por nome ou projeto (sem diferenciar maiúsculas). */
export function matchesQuery(t: Task, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return t.title.toLowerCase().includes(q) || (t.projectName ?? "").toLowerCase().includes(q);
}
