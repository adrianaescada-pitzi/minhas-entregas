import { isValid, parseISO } from "date-fns";
import { z } from "zod";
import type { Task } from "./types";

/** Versão do formato salvo no navegador e nos arquivos de backup. */
export const DATA_VERSION = 1;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => isValid(parseISO(s)), "data inválida");

const isoDateTime = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  .refine((s) => isValid(parseISO(s)), "data e hora inválidas");

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const taskSchema: z.ZodType<Task> = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(300),
  dueDate: isoDate,
  dueTime: hhmm.nullable(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  reminderOffset: z.enum(["NONE", "MIN_15", "MIN_30", "HOUR_1", "DAY_1"]),
  reminderAt: isoDateTime.nullable(),
  reminderState: z.enum(["SCHEDULED", "SNOOZED", "DISMISSED", "SENT"]),
  status: z.enum(["TODO", "DOING", "DONE"]),
  deliveredAt: isoDateTime.nullable(),
  projectName: z.string().max(200).nullable(),
});

export interface ParsedTasks {
  tasks: Task[];
  /** itens inválidos ou repetidos que foram descartados */
  ignored: number;
}

/** Valida uma lista de tarefas item a item: o que for inválido é descartado, não derruba o resto. */
export function parseTaskList(value: unknown): ParsedTasks | null {
  if (!Array.isArray(value)) return null;
  const byId = new Map<string, Task>();
  let ignored = 0;
  for (const item of value) {
    const parsed = taskSchema.safeParse(item);
    if (!parsed.success) {
      ignored++;
      continue;
    }
    if (byId.has(parsed.data.id)) ignored++;
    byId.set(parsed.data.id, parsed.data);
  }
  return { tasks: [...byId.values()], ignored };
}

type Envelope = { version: number; tasks: unknown };

function readEnvelope(text: string): { ok: true; version: number; tasks: unknown } | { ok: false } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false };
  }
  // aceita também uma lista pura de tarefas
  if (Array.isArray(json)) return { ok: true, version: DATA_VERSION, tasks: json };
  if (json && typeof json === "object" && "tasks" in json) {
    const env = json as Envelope;
    const version = typeof env.version === "number" ? env.version : DATA_VERSION;
    return { ok: true, version, tasks: env.tasks };
  }
  return { ok: false };
}

export type StoredResult = ParsedTasks & { corrupt: boolean };

/** Lê o que está salvo no navegador. `corrupt` = havia texto, mas não deu para entender. */
export function parseStored(raw: string | null): StoredResult {
  if (raw === null) return { tasks: [], ignored: 0, corrupt: false };
  const env = readEnvelope(raw);
  const list = env.ok && env.version <= DATA_VERSION ? parseTaskList(env.tasks) : null;
  if (!list) return { tasks: [], ignored: 0, corrupt: true };
  return { ...list, corrupt: false };
}

export const serializeTasks = (tasks: Task[]): string => JSON.stringify({ version: DATA_VERSION, tasks });

/** Conteúdo do arquivo de backup (JSON legível). */
export function buildBackup(tasks: Task[], exportedAt: string): string {
  return JSON.stringify({ app: "minhas-entregas", version: DATA_VERSION, exportedAt, tasks }, null, 2);
}

export type BackupResult = { ok: true; tasks: Task[]; ignored: number } | { ok: false; error: string };

/** Valida o texto de um arquivo de backup antes de importar. */
export function parseBackup(text: string): BackupResult {
  const env = readEnvelope(text);
  if (!env.ok) return { ok: false, error: "Esse arquivo não parece um backup do Minhas Entregas." };
  if (env.version > DATA_VERSION) {
    return { ok: false, error: "Esse backup foi gerado por uma versão mais nova do app e não pode ser lido aqui." };
  }
  const list = parseTaskList(env.tasks);
  if (!list) return { ok: false, error: "Esse arquivo não tem uma lista de tarefas válida." };
  if (list.tasks.length === 0 && list.ignored > 0) {
    return { ok: false, error: "Nenhuma tarefa válida foi encontrada no arquivo." };
  }
  return { ok: true, tasks: list.tasks, ignored: list.ignored };
}
