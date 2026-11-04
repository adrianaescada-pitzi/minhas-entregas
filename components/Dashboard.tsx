"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDayMonthLong, formatHeaderDate, monthOffsetOf, nowInSaoPaulo, parseDate, workWeek } from "@/lib/dates";
import { periodStats } from "@/lib/progress";
import { dismissReminder, snoozeReminder } from "@/lib/reminders";
import { createTask, daysLate, overdueTasks, removeTask, restoreTask, setTaskStatus, todayTasks, weekTasks } from "@/lib/tasks";
import { updateTasks } from "@/lib/taskStore";
import type { NewTaskInput, Task, TaskStatus } from "@/lib/types";
import { CalendarCard } from "./CalendarCard";
import { DataCard, loadSamples } from "./DataCard";
import { DeliveriesCard } from "./DeliveriesCard";
import { DonutCard } from "./DonutCard";
import { KpiCards } from "./KpiCards";
import { NewTaskModal } from "./NewTaskModal";
import { OverdueCard } from "./OverdueCard";
import { PageHeader } from "./PageHeader";
import { RemindersCard } from "./RemindersCard";
import { Sidebar } from "./Sidebar";
import { TodayTable, type StatusFilter } from "./TodayTable";
import { TopBar } from "./TopBar";
import { UndoToast } from "./UndoToast";
import { useHydrated, useTaskStore } from "./useTaskStore";
import { WelcomeCard } from "./WelcomeCard";

function greetingFor(time: string): string {
  const hour = Number(time.slice(0, 2));
  const part = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  return `${part}, bem-vindo de volta`;
}

function weekSubtitle(start: string, end: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  return s.getMonth() === e.getMonth()
    ? `Tarefas de ${s.getDate()} a ${formatDayMonthLong(end)}`
    : `Tarefas de ${formatDayMonthLong(start)} a ${formatDayMonthLong(end)}`;
}

const SHELL = "flex min-h-screen flex-col gap-5 p-4 lg:flex-row lg:items-start lg:gap-6 lg:p-5";

/**
 * As tarefas ficam no localStorage do navegador. O HTML publicado é estático e não
 * conhece nem a data de hoje nem as tarefas, então o conteúdo só aparece depois da
 * hidratação (evita divergência entre o HTML do build e o navegador).
 */
export function Dashboard() {
  const ready = useHydrated();
  if (!ready) {
    return (
      <div className={SHELL}>
        <Sidebar />
        <main id="visao" className="flex min-w-0 flex-1 flex-col gap-6">
          <h1 className="m-0 text-[clamp(32px,3.4vw,46px)] leading-[1.05] font-extrabold tracking-[-0.03em]">
            Minhas tarefas
          </h1>
          <p className="m-0 text-[15px] text-ink-2">Carregando suas tarefas…</p>
        </main>
      </div>
    );
  }
  return <DashboardContent />;
}

function DashboardContent() {
  const [now, setNow] = useState(nowInSaoPaulo);
  const today = now.date;
  const { tasks, status } = useTaskStore();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthOffset, setMonthOffset] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  /** última tarefa excluída, para o Desfazer */
  const [deleted, setDeleted] = useState<Task | null>(null);

  // mantém "hoje" e a hora atualizados (virada do dia, saudação)
  useEffect(() => {
    const id = setInterval(() => setNow(nowInSaoPaulo()), 30_000);
    return () => clearInterval(id);
  }, []);

  const onStatusChange = (id: string, next: TaskStatus) =>
    updateTasks((prev) => prev.map((t) => (t.id === id ? setTaskStatus(t, next, nowInSaoPaulo().stamp) : t)));

  const onSave = (input: NewTaskInput) => {
    updateTasks((prev) => [...prev, createTask(input)]);
    setSelectedDate(input.dueDate);
    setMonthOffset(monthOffsetOf(today, input.dueDate));
    setModalOpen(false);
  };

  const onDelete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTasks((prev) => removeTask(prev, id));
    setDeleted(task);
  };

  const onUndoDelete = () => {
    if (deleted) updateTasks((prev) => restoreTask(prev, deleted));
    setDeleted(null);
  };
  const dismissUndo = useCallback(() => setDeleted(null), []);

  // sugestões do campo Projeto: os nomes já usados nas tarefas
  const projectNames = useMemo(
    () => [...new Set(tasks.map((t) => t.projectName).filter((n): n is string => !!n))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [tasks],
  );

  const todayList = todayTasks(tasks, today);
  const overdue = overdueTasks(tasks, today);
  const week = workWeek(today);

  return (
    <div className={SHELL}>
      <Sidebar />

      <main id="visao" className="flex min-w-0 flex-1 scroll-mt-5 flex-col gap-6">
        <TopBar query={query} onQueryChange={setQuery} />

        <PageHeader
          greeting={greetingFor(now.time)}
          todayLabel={formatHeaderDate(today)}
          onNewTask={() => setModalOpen(true)}
        />

        {tasks.length === 0 && <WelcomeCard onNewTask={() => setModalOpen(true)} onLoadSamples={() => loadSamples(today)} />}

        <KpiCards
          day={periodStats(todayList)}
          overdueCount={overdue.length}
          oldestOverdueDays={overdue[0] ? daysLate(overdue[0], today) : 0}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6">
          <DonutCard
            title="Progresso de hoje"
            subtitle="Percentual das tarefas do dia"
            stats={periodStats(todayList)}
            colors={["#8B5CF6", "#EC4899", "#FDBA74"]}
          />
          <DonutCard
            title="Progresso da semana"
            subtitle={weekSubtitle(week.start, week.end)}
            stats={periodStats(weekTasks(tasks, today))}
            colors={["#4F46E5", "#38BDF8", "var(--donut-week-3)"]}
          />
        </div>

        <TodayTable
          tasks={todayList}
          today={today}
          filter={filter}
          query={query}
          onFilterChange={setFilter}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-6">
          <OverdueCard tasks={overdue} today={today} onStatusChange={onStatusChange} onDelete={onDelete} />
          <CalendarCard
            tasks={tasks}
            today={today}
            monthOffset={monthOffset}
            selectedDate={selectedDate}
            onMonthChange={setMonthOffset}
            onSelectDate={setSelectedDate}
            onDelete={onDelete}
          />
          <RemindersCard
            tasks={tasks}
            today={today}
            onSnooze={(id) => updateTasks((prev) => prev.map((t) => (t.id === id ? snoozeReminder(t) : t)))}
            onDismiss={(id) => updateTasks((prev) => prev.map((t) => (t.id === id ? dismissReminder(t) : t)))}
          />
        </div>

        <DeliveriesCard tasks={tasks} today={today} />

        <DataCard tasks={tasks} today={today} status={status} />
      </main>

      <UndoToast task={deleted} onUndo={onUndoDelete} onDismiss={dismissUndo} />

      {modalOpen && (
        <NewTaskModal today={today} projectNames={projectNames} onClose={() => setModalOpen(false)} onSave={onSave} />
      )}
    </div>
  );
}
