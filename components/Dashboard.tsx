"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatDayMonthLong,
  formatHeaderDate,
  monthOffsetOf,
  nowInSaoPaulo,
  parseDate,
  workWeek,
} from "@/lib/dates";
import { buildMockProjects, buildMockTasks, MOCK_PROJECT_NAMES } from "@/lib/mock";
import { periodStats } from "@/lib/progress";
import { dismissReminder, snoozeReminder } from "@/lib/reminders";
import { createTask, daysLate, overdueTasks, setTaskStatus, todayTasks, weekTasks } from "@/lib/tasks";
import type { NewTaskInput, Task, TaskStatus } from "@/lib/types";
import { CalendarCard } from "./CalendarCard";
import { DeliveriesCard } from "./DeliveriesCard";
import { DonutCard } from "./DonutCard";
import { KpiCards } from "./KpiCards";
import { NewTaskModal } from "./NewTaskModal";
import { OverdueCard } from "./OverdueCard";
import { PageHeader } from "./PageHeader";
import { ProjectsCard } from "./ProjectsCard";
import { RemindersCard } from "./RemindersCard";
import { Sidebar } from "./Sidebar";
import { TodayTable, type StatusFilter } from "./TodayTable";
import { TopBar } from "./TopBar";

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

/**
 * Etapa 1: tudo em memória, com dados de exemplo. A etapa 2 troca o estado local
 * por leitura/escrita no banco, mantendo estes mesmos componentes.
 */
export function Dashboard() {
  const [now, setNow] = useState(nowInSaoPaulo);
  const today = now.date;

  const [tasks, setTasks] = useState<Task[]>(() => buildMockTasks(now.date));
  const projects = useMemo(() => buildMockProjects(today), [today]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthOffset, setMonthOffset] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // mantém "hoje" e a hora atualizados (virada do dia, saudação)
  useEffect(() => {
    const id = setInterval(() => setNow(nowInSaoPaulo()), 30_000);
    return () => clearInterval(id);
  }, []);

  const updateTask = (id: string, fn: (t: Task) => Task) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? fn(t) : t)));

  const onStatusChange = (id: string, status: TaskStatus) =>
    updateTask(id, (t) => setTaskStatus(t, status, nowInSaoPaulo().stamp));

  const onSave = (input: NewTaskInput) => {
    setTasks((prev) => [...prev, createTask(input)]);
    setSelectedDate(input.dueDate);
    setMonthOffset(monthOffsetOf(today, input.dueDate));
    setModalOpen(false);
  };

  const todayList = todayTasks(tasks, today);
  const overdue = overdueTasks(tasks, today);
  const week = workWeek(today);

  return (
    <div className="flex min-h-screen flex-col gap-5 p-4 lg:flex-row lg:items-start lg:gap-6 lg:p-5">
      <Sidebar />

      <main id="visao" className="flex min-w-0 flex-1 scroll-mt-5 flex-col gap-6">
        <TopBar query={query} onQueryChange={setQuery} />

        <PageHeader
          greeting={greetingFor(now.time)}
          todayLabel={formatHeaderDate(today)}
          onNewTask={() => setModalOpen(true)}
        />

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
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-6">
          <OverdueCard tasks={overdue} today={today} onStatusChange={onStatusChange} />
          <CalendarCard
            tasks={tasks}
            today={today}
            monthOffset={monthOffset}
            selectedDate={selectedDate}
            onMonthChange={setMonthOffset}
            onSelectDate={setSelectedDate}
          />
          <RemindersCard
            tasks={tasks}
            today={today}
            onSnooze={(id) => updateTask(id, snoozeReminder)}
            onDismiss={(id) => updateTask(id, dismissReminder)}
          />
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <ProjectsCard projects={projects} today={today} isSample />
          <DeliveriesCard tasks={tasks} today={today} />
        </div>
      </main>

      {modalOpen && (
        <NewTaskModal
          today={today}
          projectNames={MOCK_PROJECT_NAMES}
          onClose={() => setModalOpen(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
