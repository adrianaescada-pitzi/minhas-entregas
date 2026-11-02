"use client";

import { useRef, useState } from "react";
import { buildBackup, parseBackup } from "@/lib/schema";
import { buildSampleTasks, isSample } from "@/lib/samples";
import { nowInSaoPaulo, plural } from "@/lib/dates";
import { replaceTasks, updateTasks, type StorageStatus } from "@/lib/taskStore";
import type { Task } from "@/lib/types";
import { DownloadIcon } from "./icons";
import { CARD } from "./styles";

interface Props {
  tasks: Task[];
  today: string;
  status: StorageStatus;
}

const BTN =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-field-border bg-card px-4 text-[13px] font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50";

/** Carrega as tarefas de exemplo (substitui as que já eram exemplo, sem duplicar). */
export function loadSamples(today: string) {
  updateTasks((prev) => [...prev.filter((t) => !isSample(t)), ...buildSampleTasks(today)]);
}

/** Exportar, importar, exemplos e apagar: tudo sobre os dados salvos neste navegador. */
export function DataCard({ tasks, today, status }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const samples = tasks.filter(isSample).length;

  function exportBackup() {
    const text = buildBackup(tasks, nowInSaoPaulo().stamp);
    const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `minhas-entregas-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage(`Backup baixado com ${plural(tasks.length, "tarefa", "tarefas")}.`);
  }

  async function importBackup(file: File | undefined) {
    if (!file) return;
    const result = parseBackup(await file.text());
    if (fileRef.current) fileRef.current.value = "";
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    const extra = result.ignored ? ` (${plural(result.ignored, "item inválido ignorado", "itens inválidos ignorados")})` : "";
    const ok = window.confirm(
      `Importar ${plural(result.tasks.length, "tarefa", "tarefas")} de "${file.name}"?\n\nIsso substitui as ${plural(tasks.length, "tarefa", "tarefas")} que estão salvas neste navegador.`,
    );
    if (!ok) return;
    replaceTasks(result.tasks);
    setMessage(`Backup importado: ${plural(result.tasks.length, "tarefa", "tarefas")}${extra}.`);
  }

  function addSamples() {
    loadSamples(today);
    setMessage("Tarefas de exemplo carregadas. Você pode removê-las quando quiser.");
  }

  function removeSamples() {
    updateTasks((prev) => prev.filter((t) => !isSample(t)));
    setMessage("Tarefas de exemplo removidas.");
  }

  function clearAll() {
    if (!window.confirm(`Apagar as ${plural(tasks.length, "tarefa", "tarefas")} salvas neste navegador? Isso não pode ser desfeito (a menos que você tenha um backup).`)) return;
    replaceTasks([]);
    setMessage("Todas as tarefas foram apagadas.");
  }

  return (
    <section id="dados" aria-labelledby="h-dados" className={`${CARD} flex scroll-mt-5 flex-col gap-4`}>
      <div className="flex flex-col gap-0.5">
        <h2 id="h-dados" className="m-0 text-lg font-bold tracking-[-0.01em]">
          Seus dados
        </h2>
        <span className="text-[13px] text-ink-2">
          Salvos só neste navegador e neste aparelho. Para levar para outro lugar, exporte um backup e importe lá.
        </span>
      </div>

      {status === "unavailable" && (
        <p role="alert" className="m-0 rounded-xl bg-late-bg px-4 py-3 text-[13px] font-semibold text-late-fg">
          O navegador bloqueou o armazenamento (aba anônima ou sem espaço). O que você fizer agora vale só até fechar a
          página; exporte um backup para não perder.
        </p>
      )}
      {status === "recovered" && (
        <p role="status" className="m-0 rounded-xl bg-late-bg px-4 py-3 text-[13px] font-semibold text-late-fg">
          Os dados que estavam salvos não puderam ser lidos. Uma cópia do texto original foi guardada no navegador e o
          painel recomeçou vazio.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={exportBackup} disabled={tasks.length === 0} className={BTN}>
          <DownloadIcon size={16} />
          Exportar backup (.json)
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={BTN}>
          Importar backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          aria-label="Escolher arquivo de backup"
          onChange={(e) => void importBackup(e.target.files?.[0])}
        />
        <button type="button" onClick={addSamples} className={BTN}>
          Carregar exemplos
        </button>
        {samples > 0 && (
          <button type="button" onClick={removeSamples} className={BTN}>
            Remover exemplos ({samples})
          </button>
        )}
        <button
          type="button"
          onClick={clearAll}
          disabled={tasks.length === 0}
          className={`${BTN} border-late-item-border text-late-fg`}
        >
          Apagar tudo
        </button>
      </div>

      <p aria-live="polite" className="m-0 min-h-5 text-[13px] text-ink-2">
        {message || `${plural(tasks.length, "tarefa salva", "tarefas salvas")} neste navegador.`}
      </p>
    </section>
  );
}
