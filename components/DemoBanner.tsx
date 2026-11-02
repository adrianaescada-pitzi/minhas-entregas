"use client";

import { useState } from "react";
import { CloseIcon } from "./icons";

/** Faixa de apresentação: só aparece na versão de demonstração (GitHub Pages). */
export function DemoBanner() {
  const [open, setOpen] = useState(true);
  if (process.env.NEXT_PUBLIC_DEMO !== "1" || !open) return null;

  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-border bg-(image:--rem-hi) p-4 shadow-soft"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1 text-[13px] text-ink-2">
        <span className="text-sm font-bold text-ink">Versão de demonstração com dados fictícios</span>
        <span>
          Nada aqui é salvo: ao recarregar a página, tudo volta ao início. Experimente mudar o status de uma tarefa
          (a rosca, os números e o registro de entregas acompanham), criar uma tarefa em <b>Nova tarefa</b>, clicar num
          dia do calendário, adiar um lembrete ou trocar o tema.
        </span>
      </div>
      <button
        type="button"
        aria-label="Fechar aviso de demonstração"
        onClick={() => setOpen(false)}
        className="inline-flex size-11 flex-none items-center justify-center rounded-xl border border-border bg-card text-ink"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
