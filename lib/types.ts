/**
 * Datas e horas do domínio são strings no horário de America/Sao_Paulo:
 *  - data:      "YYYY-MM-DD"
 *  - data/hora: "YYYY-MM-DDTHH:mm"  (relógio de parede, sem fuso)
 * Na etapa 2 (banco) a conversão para/de UTC fica na borda do Prisma.
 */

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "TODO" | "DOING" | "DONE";
export type ReminderOffset = "NONE" | "MIN_15" | "MIN_30" | "HOUR_1" | "DAY_1";
export type ReminderState = "SCHEDULED" | "SNOOZED" | "DISMISSED" | "SENT";

export interface Task {
  id: string;
  title: string;
  /** "YYYY-MM-DD" */
  dueDate: string;
  /** "HH:mm" ou null = sem horário definido */
  dueTime: string | null;
  priority: Priority;
  reminderOffset: ReminderOffset;
  /** "YYYY-MM-DDTHH:mm"; null quando reminderOffset = NONE */
  reminderAt: string | null;
  reminderState: ReminderState;
  status: TaskStatus;
  /** "YYYY-MM-DDTHH:mm"; null enquanto não concluída */
  deliveredAt: string | null;
  projectName: string | null;
  /** marcada para entrar no reporte semanal (feito depois) */
  weeklyReport: boolean;
}

export interface NewTaskInput {
  title: string;
  dueDate: string;
  dueTime: string | null;
  priority: Priority;
  reminderOffset: ReminderOffset;
  projectName: string | null;
  weeklyReport: boolean;
}
