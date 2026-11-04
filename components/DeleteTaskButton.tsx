import { TrashIcon } from "./icons";

interface Props {
  title: string;
  onDelete: () => void;
  /** "md" = 44px (tabelas e cards); "sm" = 40px (listas compactas) */
  size?: "md" | "sm";
}

/** Botão só com ícone: o rótulo acessível diz qual tarefa será excluída. */
export function DeleteTaskButton({ title, onDelete, size = "md" }: Props) {
  return (
    <button
      type="button"
      onClick={onDelete}
      aria-label={`Excluir tarefa: ${title}`}
      title="Excluir tarefa"
      className={`inline-flex flex-none items-center justify-center rounded-xl border border-border bg-card text-muted hover:border-late-item-border hover:text-late-fg ${
        size === "md" ? "size-11" : "size-10"
      }`}
    >
      <TrashIcon size={16} />
    </button>
  );
}
