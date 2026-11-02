import type { ComponentType } from "react";
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  DownloadIcon,
  HistoryIcon,
  HomeIcon,
  ListChecksIcon,
} from "./icons";

const NAV: { href: string; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { href: "#visao", label: "Visão geral", Icon: HomeIcon },
  { href: "#hoje", label: "Tarefas de hoje", Icon: ListChecksIcon },
  { href: "#atrasadas", label: "Atrasadas", Icon: ClockIcon },
  { href: "#calendario", label: "Calendário", Icon: CalendarIcon },
  { href: "#lembretes", label: "Lembretes", Icon: BellIcon },
  { href: "#entregas", label: "Registro de entregas", Icon: HistoryIcon },
  { href: "#dados", label: "Seus dados", Icon: DownloadIcon },
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

      <span className="mt-auto hidden whitespace-pre-line px-2.5 text-xs text-muted lg:block">
        {"Organize o dia.\nEntregue no prazo."}
      </span>
    </nav>
  );
}
