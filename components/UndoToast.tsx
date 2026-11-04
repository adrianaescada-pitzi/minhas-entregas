"use client";

import { useEffect } from "react";
import type { Task } from "@/lib/types";

const VISIBLE_MS = 10_000;

interface Props {
  task: Task | null;
  onUndo: () => void;
  onDismiss: () => void;
}

/** Aviso fixo depois de excluir uma tarefa, com Desfazer por alguns segundos. */
export function UndoToast({ task, onUndo, onDismiss }: Props) {
  useEffect(() => {
    if (!task) return;
    const id = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(id);
  }, [task, onDismiss]);

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center">
      {task && (
        <div className="pointer-events-auto flex max-w-full items-center gap-3 rounded-2xl border border-border bg-card py-2 pr-2 pl-4 shadow-card">
          <span className="min-w-0 truncate text-[13px] text-ink">
            Tarefa excluída: <b>{task.title}</b>
          </span>
          <button
            type="button"
            onClick={onUndo}
            className="bg-action min-h-11 flex-none rounded-xl border-0 px-4 text-[13px] font-bold text-white"
          >
            Desfazer
          </button>
        </div>
      )}
    </div>
  );
}
