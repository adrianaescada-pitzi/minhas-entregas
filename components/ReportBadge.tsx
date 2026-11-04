import { FileTextIcon } from "./icons";

/** Selo das tarefas marcadas para o reporte semanal. O texto acompanha o ícone (nada depende só de cor). */
export function ReportBadge({ short = false, className = "" }: { short?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex h-5 items-center gap-1 rounded-md bg-purple-soft-bg px-1.5 text-[11px] font-bold whitespace-nowrap text-purple-soft-fg ${className}`}
    >
      <FileTextIcon size={12} />
      {short ? "Reporte" : "Reporte semanal"}
    </span>
  );
}
