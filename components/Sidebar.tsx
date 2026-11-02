import type { ComponentType } from "react";
import {
  BarChartIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HistoryIcon,
  HomeIcon,
  LinkIcon,
  ListChecksIcon,
} from "./icons";

const NAV: { href: string; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { href: "#visao", label: "Visão geral", Icon: HomeIcon },
  { href: "#hoje", label: "Tarefas de hoje", Icon: ListChecksIcon },
  { href: "#atrasadas", label: "Atrasadas", Icon: ClockIcon },
  { href: "#calendario", label: "Calendário", Icon: CalendarIcon },
  { href: "#lembretes", label: "Lembretes", Icon: BellIcon },
  { href: "#projetos", label: "Projetos do time", Icon: BarChartIcon },
  { href: "#entregas", label: "Registro de entregas", Icon: HistoryIcon },
];

export function Sidebar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="flex flex-col gap-4 rounded-3xl border border-border bg-nav p-4 shadow-card lg:sticky lg:top-5 lg:h-[calc(100vh-40px)] lg:w-60 lg:shrink-0 lg:gap-7 lg:px-4 lg:py-6"
    >
      <div className="flex items-center gap-2.5 px-2.5">
        <span
          aria-hidden="true"
          className="inline-flex size-8 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#EC4899,#8B5CF6)] text-white"
        >
          <CheckIcon size={18} />
        </span>
        <span className="text-xl font-extrabold tracking-[-0.02em]">Entregas</span>
      </div>

      {/* Em telas estreitas a lista vira uma faixa rolável na horizontal. */}
      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {NAV.map(({ href, label, Icon }, i) => (
          <li key={href} className="shrink-0 lg:shrink">
            <a
              href={href}
              aria-current={i === 0 ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 whitespace-nowrap rounded-field px-3.5 no-underline lg:whitespace-normal ${
                i === 0
                  ? "bg-(image:--nav-active-bg) font-semibold text-nav-active-fg"
                  : "font-medium text-ink-2 hover:bg-subtle"
              }`}
            >
              <Icon size={18} />
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-auto hidden flex-col gap-5 lg:flex">
        <div className="flex flex-col gap-2.5 rounded-card border border-(--promo-border) bg-(image:--promo-bg) p-5">
          <span
            aria-hidden="true"
            className="inline-flex size-10 items-center justify-center rounded-xl bg-pink-soft-bg text-pink-soft-fg"
          >
            <LinkIcon size={20} />
          </span>
          <span className="text-[17px] font-extrabold leading-tight tracking-[-0.01em]">Conectar ao Linear</span>
          <span className="text-[13px] text-ink-2">Traga o progresso real dos projetos do seu time para cá.</span>
          {/* Etapa 4: passa a abrir a configuração da chave do Linear. Por ora leva à tabela de exemplo. */}
          <a
            href="#projetos"
            className="inline-flex min-h-11 items-center justify-center rounded-field bg-[linear-gradient(90deg,#F9A8D4,#F472B6)] font-bold text-[#3B0764] no-underline shadow-[0_8px_18px_rgba(236,72,153,0.25)]"
          >
            Conectar
          </a>
        </div>
        <span className="whitespace-pre-line px-2.5 text-xs text-muted">{"Organize o dia.\nEntregue no prazo."}</span>
      </div>
    </nav>
  );
}
