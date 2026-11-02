import { addMinutesISO, addDaysISO, dueStamp } from "./dates";
import type { ReminderOffset, ReminderState, Task } from "./types";

/** Horário em que o lembrete toca quando a tarefa não tem horário definido. */
export const DEFAULT_REMINDER_TIME = "09:00";

/** Adiar sempre soma 15 minutos ao lembrete. */
export const SNOOZE_MINUTES = 15;

const OFFSET_MINUTES: Record<Exclude<ReminderOffset, "NONE" | "DAY_1">, number> = {
  MIN_15: 15,
  MIN_30: 30,
  HOUR_1: 60,
};

export const REMINDER_OPTIONS: { value: ReminderOffset; label: string }[] = [
  { value: "NONE", label: "Sem lembrete" },
  { value: "MIN_15", label: "15 minutos antes" },
  { value: "MIN_30", label: "30 minutos antes" },
  { value: "HOUR_1", label: "1 hora antes" },
  { value: "DAY_1", label: "1 dia antes" },
];

/**
 * reminderAt = prazo − offset.
 *  - sem lembrete: null
 *  - sem horário: 09:00 do dia do prazo (offset em minutos/hora não se aplica)
 *  - 1 dia antes: mesmo horário do dia anterior (09:00 se não há horário)
 */
export function computeReminderAt(dueDate: string, dueTime: string | null, offset: ReminderOffset): string | null {
  if (offset === "NONE") return null;
  if (offset === "DAY_1") {
    return `${addDaysISO(dueDate, -1)}T${dueTime ?? DEFAULT_REMINDER_TIME}`;
  }
  if (!dueTime) return `${dueDate}T${DEFAULT_REMINDER_TIME}`;
  return addMinutesISO(dueStamp(dueDate, dueTime), -OFFSET_MINUTES[offset]);
}

/** Explica ao usuário quando o lembrete não segue o "X antes" literal. */
export function reminderHint(dueTime: string | null, offset: ReminderOffset): string | null {
  if (dueTime || offset === "NONE") return null;
  if (offset === "DAY_1") return `Sem horário definido, o lembrete toca às ${DEFAULT_REMINDER_TIME} do dia anterior.`;
  return `Sem horário definido, o lembrete toca às ${DEFAULT_REMINDER_TIME} do dia do prazo.`;
}

export const reminderDate = (t: Task): string | null => (t.reminderAt ? t.reminderAt.slice(0, 10) : null);
export const reminderTime = (t: Task): string | null => (t.reminderAt ? t.reminderAt.slice(11, 16) : null);

/** Lembretes que tocam no dia, por ordem de horário. */
export function remindersOfDay(tasks: Task[], day: string): Task[] {
  return tasks
    .filter((t) => t.reminderAt && reminderDate(t) === day)
    .sort((a, b) => (a.reminderAt as string).localeCompare(b.reminderAt as string));
}

/** Pendente = tarefa não concluída e lembrete ainda não dispensado nem enviado. */
export const isReminderPending = (t: Task): boolean =>
  !!t.reminderAt && t.status !== "DONE" && (t.reminderState === "SCHEDULED" || t.reminderState === "SNOOZED");

export function reminderStateLabel(t: Task): string {
  if (t.status === "DONE") return "Entregue";
  const labels: Record<ReminderState, string> = {
    SCHEDULED: "Agendado",
    SNOOZED: "Adiado",
    DISMISSED: "Dispensado",
    SENT: "Enviado",
  };
  return labels[t.reminderState];
}

/** Adia o lembrete em 15 minutos. */
export function snoozeReminder(t: Task): Task {
  if (!t.reminderAt) return t;
  return { ...t, reminderAt: addMinutesISO(t.reminderAt, SNOOZE_MINUTES), reminderState: "SNOOZED" };
}

export const dismissReminder = (t: Task): Task => ({ ...t, reminderState: "DISMISSED" });
