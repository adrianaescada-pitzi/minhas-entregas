import { diffDays, formatBR, plural } from "@/lib/dates";
import { projectProgress } from "@/lib/progress";
import type { LinearProject } from "@/lib/types";
import { CARD, PILL_LATE, PILL_OK } from "./styles";

interface Props {
  projects: LinearProject[];
  today: string;
  /** true enquanto os dados são de exemplo (sem LINEAR_API_KEY) */
  isSample: boolean;
}

const TH = "bg-thead px-3.5 py-3 font-semibold";

function daysLabel(target: string | null, today: string): string {
  if (!target) return "";
  const n = diffDays(today, target);
  if (n === 0) return "hoje";
  return n > 0 ? `em ${plural(n, "dia", "dias")}` : `há ${plural(-n, "dia", "dias")}`;
}

export function ProjectsCard({ projects, today, isSample }: Props) {
  return (
    <section
      id="projetos"
      aria-labelledby="h-proj"
      className={`${CARD} flex min-w-0 flex-[3_1_600px] scroll-mt-5 flex-col gap-[18px]`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="h-proj" className="m-0 text-lg font-bold tracking-[-0.01em]">
            Projetos do time em andamento
          </h2>
          <span className="text-[13px] text-ink-2">
            Entregue e restante até a última tarefa · Linear
            {isSample && (
              <>
                {" "}
                <span className="rounded-md bg-late-bg px-1.5 py-0.5 text-xs font-bold text-late-fg">dados de exemplo</span>
              </>
            )}
          </span>
        </div>
        <a
          href="https://linear.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-xl border border-field-border bg-card px-4 text-[13px] font-bold text-ink no-underline"
        >
          Ver no Linear
        </a>
      </div>

      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela de projetos do time">
        <table className="w-full min-w-[680px] text-[13px]">
          <thead>
            <tr className="text-left text-xs text-ink-2">
              <th scope="col" className={`${TH} rounded-l-xl`}>Projeto</th>
              <th scope="col" className={`${TH} w-[26%]`}>Entregue</th>
              <th scope="col" className={TH}>Falta</th>
              <th scope="col" className={TH}>Issues</th>
              <th scope="col" className={TH}>Última entrega</th>
              <th scope="col" className={`${TH} rounded-r-xl`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const prog = projectProgress(p, today);
              return (
                <tr key={p.id}>
                  <td className="border-b border-line p-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="inline-flex size-10 flex-none items-center justify-center rounded-xl text-[11px] font-extrabold text-white"
                        style={{ background: p.tile }}
                      >
                        {p.key}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="font-bold">{p.name}</span>
                        <span className="mt-1 flex pl-[5px]" aria-label={`Membros: ${p.members.join(", ")}`}>
                          {p.members.map((m) => (
                            <span
                              key={m}
                              aria-hidden="true"
                              className="-ml-[5px] inline-flex size-[22px] items-center justify-center rounded-full border-2 border-card bg-avatar-bg text-[9px] font-bold text-avatar-fg"
                            >
                              {m}
                            </span>
                          ))}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-line p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        role="progressbar"
                        aria-label={`Progresso de ${p.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={prog.pct}
                        className="h-2 flex-1 overflow-hidden rounded-full bg-track"
                      >
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#F472B6,#8B5CF6)]"
                          style={{ width: `${prog.pct}%` }}
                        />
                      </div>
                      <span className="w-10 font-extrabold">{prog.pct}%</span>
                    </div>
                  </td>
                  <td className="border-b border-line p-3.5 font-semibold text-ink-2">{prog.remaining}%</td>
                  <td className="border-b border-line p-3.5">
                    {p.completedIssues}/{p.totalIssues}
                  </td>
                  <td className="border-b border-line p-3.5">
                    <span className="flex flex-col">
                      <span className="font-semibold">{p.targetDate ? formatBR(p.targetDate) : "—"}</span>
                      <span className="text-xs text-muted">{daysLabel(p.targetDate, today)}</span>
                    </span>
                  </td>
                  <td className="border-b border-line p-3.5">
                    {prog.status ? (
                      <span
                        className={`inline-flex h-[26px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold whitespace-nowrap ${
                          prog.status === "ON_TRACK" ? PILL_OK : PILL_LATE
                        }`}
                      >
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                        {prog.status === "ON_TRACK" ? "No ritmo" : "Abaixo do ritmo"}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
