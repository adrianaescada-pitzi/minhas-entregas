import {
  addDays,
  addMinutes,
  addMonths,
  differenceInCalendarDays,
  format,
  getDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const TIME_ZONE = "America/Sao_Paulo";

const DOW_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MON_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Data e hora de agora no fuso de São Paulo, independente do fuso da máquina. */
export function nowInSaoPaulo(now: Date = new Date()): { date: string; time: string; stamp: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const time = `${get("hour")}:${get("minute")}`;
  return { date, time, stamp: `${date}T${time}` };
}

export const parseDate = (s: string): Date => parseISO(s);
export const toISODate = (d: Date): string => format(d, "yyyy-MM-dd");
export const toISODateTime = (d: Date): string => format(d, "yyyy-MM-dd'T'HH:mm");

export const addDaysISO = (s: string, n: number): string => toISODate(addDays(parseDate(s), n));

/** Dias de calendário de `a` até `b` (positivo se `b` é depois de `a`). */
export const diffDays = (a: string, b: string): number => differenceInCalendarDays(parseDate(b), parseDate(a));

/** "YYYY-MM-DDTHH:mm" + n minutos (atravessa a meia-noite normalmente). */
export const addMinutesISO = (stamp: string, minutes: number): string =>
  toISODateTime(addMinutes(parseISO(stamp), minutes));

/**
 * Momento limite do prazo. Sem horário, o prazo vale até 23:59 do dia
 * (regra usada para "atraso" e "entregue com atraso").
 */
export const dueStamp = (dueDate: string, dueTime: string | null): string => `${dueDate}T${dueTime ?? "23:59"}`;

/** Segunda a sexta da semana corrente. */
export function workWeek(today: string): { start: string; end: string } {
  const monday = startOfWeek(parseDate(today), { weekStartsOn: 1 });
  return { start: toISODate(monday), end: toISODate(addDays(monday, 4)) };
}

/** Todas as datas ("YYYY-MM-DD") que preenchem as semanas (seg–dom) do mês. */
export function monthGrid(year: number, month: number): string[] {
  const first = new Date(year, month, 1);
  const lead = (getDay(first) + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Math.ceil((lead + daysInMonth) / 7) * 7;
  return Array.from({ length: cells }, (_, i) => toISODate(new Date(year, month, 1 - lead + i)));
}

/** Primeiro dia do mês que fica `offset` meses depois do mês de `today`. */
export function monthFromOffset(today: string, offset: number): Date {
  return addMonths(startOfMonth(parseDate(today)), offset);
}

/** Diferença em meses (mês de `date` menos mês de `today`), para saltar o calendário até uma data. */
export function monthOffsetOf(today: string, date: string): number {
  const t = parseDate(today);
  const d = parseDate(date);
  return (d.getFullYear() - t.getFullYear()) * 12 + (d.getMonth() - t.getMonth());
}

// ---------- formatação (pt-BR) ----------

/** "Segunda-feira, 2 de novembro" */
export const formatLongDate = (s: string): string => cap(format(parseDate(s), "EEEE, d 'de' MMMM", { locale: ptBR }));

/** "Seg, 02/11" */
export const formatShortDate = (s: string): string => {
  const d = parseDate(s);
  return `${DOW_SHORT[d.getDay()]}, ${format(d, "dd/MM")}`;
};

/** "Seg, 2 nov 2026" */
export const formatHeaderDate = (s: string): string => {
  const d = parseDate(s);
  return `${DOW_SHORT[d.getDay()]}, ${d.getDate()} ${MON_SHORT[d.getMonth()]} ${d.getFullYear()}`;
};

/** "novembro de 2026" -> "Novembro de 2026" */
export const formatMonthYear = (d: Date): string => cap(format(d, "MMMM 'de' yyyy", { locale: ptBR }));

/** "02/11/2026" */
export const formatBR = (s: string): string => format(parseDate(s), "dd/MM/yyyy");

/** "02/11" */
export const formatDayMonth = (s: string): string => format(parseDate(s), "dd/MM");

/** "2 de novembro" (para o intervalo da semana) */
export const formatDayMonthLong = (s: string): string => format(parseDate(s), "d 'de' MMMM", { locale: ptBR });

/** "1 dia" / "3 dias" */
export const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
