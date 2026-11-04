"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { reminderHint, REMINDER_OPTIONS } from "@/lib/reminders";
import { TIME_OPTIONS } from "@/lib/tasks";
import type { NewTaskInput, Priority, ReminderOffset } from "@/lib/types";
import { CloseIcon, PlusIcon } from "./icons";
import { PRIORITY_LABEL, PRIORITY_SELECTED } from "./styles";

interface Props {
  today: string;
  projectNames: readonly string[];
  onClose: () => void;
  onSave: (input: NewTaskInput) => void;
}

const PRIORITIES: Priority[] = ["HIGH", "MEDIUM", "LOW"];

const FIELD =
  "h-[50px] rounded-field border border-field-border bg-field px-3.5 text-sm text-ink";

/** Modal "Nova tarefa". Fica montado só enquanto aberto; <dialog> nativo dá foco preso, Esc e backdrop. */
export function NewTaskModal({ today, projectNames, onClose, onSave }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [dueTime, setDueTime] = useState("18:00");
  const [reminder, setReminder] = useState<ReminderOffset>("MIN_30");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [project, setProject] = useState("");
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    nameRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const hint = reminderHint(dueTime || null, reminder);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Dê um nome para a tarefa.");
      nameRef.current?.focus();
      return;
    }
    onSave({
      title,
      dueDate: dueDate || today,
      dueTime: dueTime || null,
      priority,
      reminderOffset: reminder,
      projectName: project.trim() || null,
      weeklyReport,
    });
  }

  const label = "text-[13px] font-bold";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100%-40px)] w-[calc(100%-40px)] max-w-[520px] overflow-auto rounded-3xl border border-border bg-card p-0 text-ink shadow-[0_30px_60px_rgba(20,8,50,0.30)]"
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-[18px] p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex size-11 items-center justify-center rounded-[14px] bg-(image:--modal-tile-bg) text-purple-soft-fg"
            >
              <PlusIcon size={20} />
            </span>
            <div className="flex flex-col">
              <h2 id={`${id}-title`} className="m-0 text-xl font-extrabold tracking-[-0.02em]">
                Nova tarefa
              </h2>
              <span className="text-[13px] text-ink-2">Defina prazo, lembrete e prioridade</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-nome`} className={label}>
            Nome da tarefa
          </label>
          <input
            ref={nameRef}
            id={`${id}-nome`}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            placeholder="Ex.: Revisar proposta do cliente"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-erro` : undefined}
            className={`${FIELD} px-4`}
          />
          {error && (
            <span id={`${id}-erro`} role="alert" className="text-xs font-bold text-pink-soft-fg">
              {error}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={`${id}-data`} className={label}>
              Prazo
            </label>
            <input
              id={`${id}-data`}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={FIELD}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={`${id}-hora`} className={label}>
              Horário
            </label>
            <select id={`${id}-hora`} value={dueTime} onChange={(e) => setDueTime(e.target.value)} className={FIELD}>
              <option value="">Sem horário definido</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-lembrete`} className={label}>
            Lembrete
          </label>
          <select
            id={`${id}-lembrete`}
            value={reminder}
            onChange={(e) => setReminder(e.target.value as ReminderOffset)}
            aria-describedby={hint ? `${id}-dica` : undefined}
            className={FIELD}
          >
            {REMINDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {hint && (
            <span id={`${id}-dica`} className="text-xs text-ink-2">
              {hint}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span id={`${id}-prio`} className={label}>
            Prioridade
          </span>
          <div role="group" aria-labelledby={`${id}-prio`} className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => {
              const on = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPriority(p)}
                  className={`min-h-[46px] rounded-field border-[1.5px] text-sm font-bold ${
                    on ? PRIORITY_SELECTED[p] : "border-field-border bg-card text-ink-2"
                  }`}
                >
                  {PRIORITY_LABEL[p]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-proj`} className={label}>
            Projeto (opcional)
          </label>
          <input
            id={`${id}-proj`}
            type="text"
            list={`${id}-projetos`}
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Sem projeto"
            autoComplete="off"
            className={`${FIELD} px-4`}
          />
          <datalist id={`${id}-projetos`}>
            {projectNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <label
          htmlFor={`${id}-reporte`}
          className="flex min-h-11 cursor-pointer items-start gap-3 rounded-field border border-field-border bg-field px-3.5 py-3"
        >
          <input
            id={`${id}-reporte`}
            type="checkbox"
            checked={weeklyReport}
            onChange={(e) => setWeeklyReport(e.target.checked)}
            className="mt-0.5 size-5 flex-none accent-[#7C3AED]"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-[13px] font-bold">Usar no reporte semanal</span>
            <span className="text-xs text-ink-2">
              A tarefa fica com o selo &ldquo;Reporte semanal&rdquo; para você montar o reporte da semana depois.
            </span>
          </span>
        </label>

        <div className="flex flex-wrap justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-field border border-field-border bg-card px-[22px] text-sm font-bold text-ink"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-action min-h-12 rounded-field border-0 px-6 text-sm font-bold text-white shadow-[0_10px_22px_rgba(124,58,237,0.28)]"
          >
            Salvar tarefa
          </button>
        </div>
      </form>
    </dialog>
  );
}
