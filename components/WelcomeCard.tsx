import { CARD } from "./styles";

interface Props {
  onNewTask: () => void;
  onLoadSamples: () => void;
}

/** Aparece enquanto não há nenhuma tarefa salva. */
export function WelcomeCard({ onNewTask, onLoadSamples }: Props) {
  return (
    <section aria-labelledby="h-welcome" className={`${CARD} flex flex-col gap-3`}>
      <h2 id="h-welcome" className="m-0 text-lg font-bold tracking-[-0.01em]">
        Seu painel está vazio
      </h2>
      <p className="m-0 text-[13px] text-ink-2">
        Crie a primeira tarefa ou carregue algumas tarefas de exemplo para conhecer o painel. Tudo o que você fizer fica
        salvo só neste navegador, sem conta e sem login.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onNewTask}
          className="bg-action min-h-11 rounded-xl border-0 px-5 text-[13px] font-bold text-white"
        >
          Criar primeira tarefa
        </button>
        <button
          type="button"
          onClick={onLoadSamples}
          className="min-h-11 rounded-xl border border-field-border bg-card px-5 text-[13px] font-bold text-ink"
        >
          Carregar exemplos
        </button>
      </div>
    </section>
  );
}
