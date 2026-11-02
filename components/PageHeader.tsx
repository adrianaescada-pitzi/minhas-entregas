import { CalendarIcon, PlusIcon } from "./icons";

interface Props {
  greeting: string;
  todayLabel: string;
  onNewTask: () => void;
}

export function PageHeader({ greeting, todayLabel, onNewTask }: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        {/* a saudação depende da hora; pode diferir entre servidor e navegador na virada da hora */}
        <span suppressHydrationWarning className="text-[15px] font-medium text-ink-2">
          {greeting}
        </span>
        <h1 className="m-0 text-[clamp(32px,3.4vw,46px)] leading-[1.05] font-extrabold tracking-[-0.03em]">
          Minhas tarefas
        </h1>
        <p className="m-0 text-[15px] text-ink-2">
          Acompanhe prazos, entregas e o andamento do time, tudo em um lugar.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex min-h-12 items-center gap-2.5 rounded-field border border-border bg-card px-[18px] font-semibold shadow-soft">
          <CalendarIcon size={18} className="text-accent-text" />
          {todayLabel}
        </span>
        <button
          type="button"
          onClick={onNewTask}
          className="bg-action inline-flex min-h-12 items-center gap-2 rounded-field border-0 px-[22px] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(124,58,237,0.28)]"
        >
          <PlusIcon size={18} />
          Nova tarefa
        </button>
      </div>
    </header>
  );
}
