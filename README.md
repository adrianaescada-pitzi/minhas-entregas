# Dashboard de tarefas pessoais

App pessoal em português do Brasil (fuso America/Sao_Paulo). Veja `CLAUDE.md` para escopo, regras e ordem de trabalho.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos: `npm run build`, `npm run lint`, `npx tsc --noEmit`.

## Onde roda

**https://adrianaescada-pitzi.github.io/minhas-entregas/** (GitHub Pages). O workflow `.github/workflows/pages.yml`
publica a cada push na `main`.

```bash
npm run build:pages   # gera out/ (site estático); no Windows defina PAGES_EXPORT=1 antes de `next build`
```

## Seus dados

- Tudo fica salvo no `localStorage` do navegador: só aquele navegador, naquele aparelho, vê as tarefas.
- Limpar os dados do site apaga as tarefas. Em **Seus dados** há **Exportar backup (.json)** e **Importar backup**.
- O app começa vazio; **Carregar exemplos** preenche com tarefas fictícias (removíveis).
- Cada tarefa tem lixeira para excluir (com **Desfazer** por 10 s) e pode ser marcada para o **reporte semanal** ao criá-la.

## Estrutura

- `app/` – layout raiz (fonte, script de tema), `globals.css` com os tokens de tema
- `components/` – blocos da interface
- `lib/` – regras puras de datas, lembretes, atraso e progresso; `schema.ts` (validação) e `taskStore.ts` (localStorage)
- `design/` – referência visual aprovada (`.dc.html`, só leitura)

## Estado

Etapas 1 (base) e 2 (persistência no navegador) concluídas. Próxima: testes com Vitest.

## Decisões

- Semana do progresso: segunda a sexta da semana corrente.
- Fora do escopo: Linear, lembretes com o app fechado, login, banco de dados e sincronização entre aparelhos.
