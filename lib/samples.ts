/**
 * Tarefas de exemplo ("Carregar exemplos"). Os prazos são relativos a "hoje",
 * então a tela fica coerente em qualquer dia. Todos os ids começam com
 * SAMPLE_PREFIX, o que permite carregar e remover só os exemplos.
 */
import { addDaysISO } from "./dates";
import { computeReminderAt } from "./reminders";
import type { Priority, ReminderOffset, Task, TaskStatus } from "./types";

const P: Record<string, Priority> = { alta: "HIGH", media: "MEDIUM", baixa: "LOW" };
const R: Record<string, ReminderOffset> = { "": "NONE", "15": "MIN_15", "30": "MIN_30", "60": "HOUR_1", "1d": "DAY_1" };
const S: Record<string, TaskStatus> = { todo: "TODO", doing: "DOING", done: "DONE" };

const AVA = "App de avaliação v2";
const LOJ = "Painel do lojista";
const API = "Integração de parceiros via API";
const PAG = "Migração de pagamentos";

export const SAMPLE_PREFIX = "exemplo-";

export const isSample = (t: Task): boolean => t.id.startsWith(SAMPLE_PREFIX);

export function buildSampleTasks(today: string): Task[] {
  // dayOffset: dias a partir de hoje; delivered: dia (relativo a hoje) e horário da entrega
  const mk = (
    id: string,
    title: string,
    dayOffset: number,
    dueTime: string,
    prio: keyof typeof P,
    reminder: keyof typeof R = "",
    status: keyof typeof S = "todo",
    delivered: { dayOffset: number; time: string } | null = null,
    projectName: string | null = null,
  ): Task => {
    const dueDate = addDaysISO(today, dayOffset);
    const time = dueTime || null;
    const offset = R[reminder];
    return {
      id,
      title,
      dueDate,
      dueTime: time,
      priority: P[prio],
      reminderOffset: offset,
      reminderAt: computeReminderAt(dueDate, time, offset),
      reminderState: "SCHEDULED",
      status: S[status],
      deliveredAt: delivered ? `${addDaysISO(today, delivered.dayOffset)}T${delivered.time}` : null,
      projectName,
    };
  };

  const tasks: Task[] = [
    // hoje
    mk("t1", "Revisar PR do fluxo de checkout", 0, "10:00", "alta", "30", "done", { dayOffset: 0, time: "09:52" }, AVA),
    mk("t2", "Daily com o time de produto", 0, "09:30", "media", "", "done", { dayOffset: 0, time: "09:41" }),
    mk("t3", "Escrever specs da tela de avaliação", 0, "12:00", "alta", "30", "doing", null, AVA),
    mk("t4", "Responder feedback do design review", 0, "15:00", "media", "30", "todo", null, LOJ),
    mk("t5", "Validar métricas do experimento A/B", 0, "16:00", "alta", "30", "doing", null, LOJ),
    mk("t6", "Atualizar roadmap do trimestre", 0, "", "baixa"),
    mk("t7", "Enviar resumo semanal ao gestor", 0, "18:00", "media", "30"),
    // atrasadas
    mk("o1", "Documentar regras de negócio do Boost", -4, "18:00", "alta", "", "doing", null, API),
    mk("o2", "Revisar contrato do fornecedor de logística", -3, "17:00", "media"),
    // entregues antes (registro de entregas)
    mk("p1", "Fechar escopo da sprint 23", -3, "18:00", "alta", "", "done", { dayOffset: -3, time: "17:40" }),
    mk("p2", "Revisar métricas de conversão", -3, "16:00", "media", "", "done", { dayOffset: -3, time: "15:12" }, LOJ),
    mk("p3", "Publicar changelog da versão 2.4", -4, "18:00", "baixa", "", "done", { dayOffset: -4, time: "18:05" }),
    mk("p4", "Alinhar handoff com o design", -5, "17:00", "media", "", "done", { dayOffset: -4, time: "10:20" }, AVA),
    mk("p5", "Priorizar bugs do painel", -6, "12:00", "alta", "", "done", { dayOffset: -6, time: "11:48" }, LOJ),
    // próximos dias
    mk("f1", "Planejamento da sprint 24", 1, "10:00", "alta", "30"),
    mk("f2", "Revisar wireframes do onboarding", 1, "14:00", "media", "30", "todo", null, AVA),
    mk("f3", "1:1 com a liderança", 1, "16:00", "media", "1d"),
    mk("f4", "Atualizar documentação da API", 1, "", "baixa", "", "todo", null, API),
    mk("f5", "Apresentar resultados do A/B", 2, "10:00", "alta", "30", "todo", null, LOJ),
    mk("f6", "Refinar backlog com o time", 2, "11:00", "media"),
    mk("f7", "Responder chamados do suporte", 2, "", "baixa"),
    mk("f8", "Alinhar escopo com o jurídico", 2, "15:30", "media", "", "todo", null, PAG),
    mk("f9", "Testar build de homologação", 2, "17:00", "alta", "30", "todo", null, AVA),
    mk("f10", "Workshop de discovery", 3, "10:00", "alta", "30"),
    mk("f11", "Revisar OKRs do trimestre", 3, "15:00", "media"),
    mk("f12", "Preparar feedbacks de 1:1", 3, "17:00", "baixa"),
    mk("f13", "Retrospectiva da sprint", 4, "10:00", "media"),
    mk("f14", "Enviar relatório mensal", 4, "12:00", "alta", "60"),
    mk("f15", "Organizar pendências da semana", 4, "", "baixa"),
    mk("f16", "Demo para stakeholders", 4, "17:00", "alta", "60", "todo", null, AVA),
    mk("f17", "Revisar plano de testes", 8, "11:00", "media", "", "todo", null, PAG),
    mk("f18", "Kickoff com parceiro de integração", 8, "15:00", "alta", "", "todo", null, API),
    mk("f19", "Validar entrega do painel", 11, "10:00", "alta", "1d", "todo", null, LOJ),
    mk("f20", "Revisar métricas mensais", 15, "14:00", "media"),
    mk("f21", "Entrega final do app v2", 18, "18:00", "alta", "60", "todo", null, AVA),
    mk("f22", "Planejamento de dezembro", 22, "10:00", "media"),
    mk("f23", "Revisão de orçamento", 24, "15:00", "alta"),
  ];
  return tasks.map((t) => ({ ...t, id: `${SAMPLE_PREFIX}${t.id}` }));
}
