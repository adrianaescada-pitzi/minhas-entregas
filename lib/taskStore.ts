import { parseStored, serializeTasks } from "./schema";
import type { Task } from "./types";

/**
 * Armazenamento das tarefas no navegador (localStorage), sem React.
 * Compatível com useSyncExternalStore: getTasks() devolve sempre o mesmo array
 * enquanto nada muda, e subscribe() avisa mudanças feitas aqui ou em outra aba.
 */

export const STORAGE_KEY = "minhas-entregas:tarefas:v1";
const CORRUPT_BACKUP_KEY = `${STORAGE_KEY}:copia-de-dados-corrompidos`;

/** ok = salvando normalmente; unavailable = navegador bloqueou o armazenamento; recovered = dados antigos ilegíveis. */
export type StorageStatus = "ok" | "unavailable" | "recovered";

const EMPTY: Task[] = [];
const listeners = new Set<() => void>();

let cache: { raw: string | null; tasks: Task[] } | null = null;
/** Quando o navegador não deixa gravar, as tarefas ficam só em memória. */
let memoryTasks: Task[] | null = null;
let status: StorageStatus = "ok";
let storageListening = false;

function emit() {
  listeners.forEach((l) => l());
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    status = "unavailable";
    return null;
  }
}

export function getTasks(): Task[] {
  if (typeof window === "undefined") return EMPTY;
  if (memoryTasks) return memoryTasks;

  const raw = readRaw();
  if (cache && cache.raw === raw) return cache.tasks;

  const result = parseStored(raw);
  if (result.corrupt && raw !== null) {
    // guarda o texto original para não perder nada e recomeça vazio
    try {
      window.localStorage.setItem(CORRUPT_BACKUP_KEY, raw);
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // sem espaço ou sem acesso: segue só em memória
    }
    status = "recovered";
  }
  cache = { raw: result.corrupt ? null : raw, tasks: result.tasks };
  return cache.tasks;
}

export const getStatus = (): StorageStatus => {
  getTasks();
  return status;
};

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!storageListening && typeof window !== "undefined") {
    storageListening = true;
    // outra aba mudou os dados: relê e avisa
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY || e.key === null) emit();
    });
  }
  return () => listeners.delete(listener);
}

function persist(next: Task[]) {
  const raw = serializeTasks(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
    memoryTasks = null;
    cache = { raw, tasks: next };
    if (status === "unavailable") status = "ok";
  } catch {
    // modo privado/cota cheia/bloqueado: mantém na memória e avisa
    memoryTasks = next;
    status = "unavailable";
  }
  emit();
}

/** Aplica uma mudança sobre as tarefas atuais e salva. */
export function updateTasks(fn: (prev: Task[]) => Task[]) {
  persist(fn(getTasks()));
}

/** Substitui tudo (importar backup, apagar tudo). */
export function replaceTasks(next: Task[]) {
  persist(next);
}
