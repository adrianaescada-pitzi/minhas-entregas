# Dashboard de tarefas pessoais

App pessoal em português do Brasil (fuso America/Sao_Paulo). Veja `CLAUDE.md` para escopo, regras e ordem de trabalho.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos: `npm run build`, `npm run lint`, `npx tsc --noEmit`.

## Estado

**Etapa 1 (Base) concluída**: layout do design, temas claro/escuro e dados de exemplo em memória
(nada é salvo ao recarregar). Próximas: banco de dados (2), testes (3), deploy num link sem login (4).

## Estrutura

- `app/` – layout raiz (fonte, script de tema), `globals.css` com os tokens de tema
- `components/` – blocos da interface
- `lib/` – regras puras de datas, lembretes, atraso e progresso (a cobrir com Vitest na etapa 3)
- `design/` – referência visual aprovada (`.dc.html`, só leitura)

## Decisões

- Semana do progresso: segunda a sexta da semana corrente.
- Fora do escopo: integração com o Linear, lembretes com o app fechado e login.
- Acesso: link fixo sem login e sem indexação (quem tiver o link vê e edita). Hospedagem a decidir antes da etapa 4.
