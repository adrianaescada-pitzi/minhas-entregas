"use client";

import { useSyncExternalStore } from "react";
import { getStatus, getTasks, subscribe, type StorageStatus } from "@/lib/taskStore";
import type { Task } from "@/lib/types";

const EMPTY: Task[] = [];
const noopSubscribe = () => () => {};

/** false no servidor (e na primeira renderização do navegador), true depois da hidratação. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Tarefas salvas no navegador, sempre atualizadas (inclusive quando outra aba muda). */
export function useTaskStore(): { tasks: Task[]; status: StorageStatus } {
  const tasks = useSyncExternalStore(subscribe, getTasks, () => EMPTY);
  const status = useSyncExternalStore(subscribe, getStatus, () => "ok" as StorageStatus);
  return { tasks, status };
}
