# Dashboard de tarefas pessoais + progresso do time (Linear)

App web de uso pessoal para acompanhar as tarefas do trabalho e o progresso dos projetos do time no Linear. Idioma da interface: **português do Brasil**. Fuso: **America/Sao_Paulo**.

> O layout já foi desenhado e aprovado. Os arquivos em `design/` são a **referência visual e de lógica**. Eles usam um formato próprio (`.dc.html`, com `<sc-for>`, `<sc-if>` e `{{...}}`), então **não rodam sozinhos**: leia-os como código-fonte de referência (estrutura, estilos inline, cores, textos e a lógica no `<script>`) e reescreva em React.

## Stack sugerida

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite em desenvolvimento; Postgres (Neon ou Supabase) em produção
- Zod para validação, date-fns com locale `pt-BR`
- Vitest para testar a lógica de datas e de progresso
- Gráficos de rosca e barras em SVG próprio (sem biblioteca), como no design

Se algo aqui conflitar com uma escolha melhor, proponha antes de implementar.

## Funcionalidades

1. **Criar tarefa** em um modal com: nome, prazo (data), horário, lembrete e prioridade. Projeto é opcional.
   - O campo de horário tem a opção **"Sem horário definido"** (primeira da lista), depois horários de 30 em 30 min, das 07:00 às 22:00.
   - Lembrete: sem lembrete, 15 min, 30 min, 1 h ou 1 dia antes.
   - Prioridade: Alta, Média, Baixa.
2. **Tarefas de hoje** em tabela, com filtro por status (Todas, A fazer, Em andamento, Concluídas) e um seletor de status em cada linha (A fazer / Em andamento / Concluída). Só mostra tarefas com prazo hoje, ordenadas por horário; tarefas sem horário vão para o fim.
3. **Atrasadas** em um bloco separado: prazo anterior a hoje e status diferente de concluída. Mostra "Venceu em ... · N dias de atraso" e o mesmo seletor de status.
4. **Registro de entregas**: ao marcar como concluída, grava `deliveredAt`. A lista mostra quando foi entregue e se foi **no prazo** ou **com atraso**.
5. **Progresso de hoje** e **Progresso da semana**: duas roscas lado a lado, mesma estrutura, cores diferentes. Centro mostra o % entregue; a legenda mostra entregues, em andamento, a fazer e o total.
6. **Calendário do mês**: navegação entre meses, pontos coloridos por dia (entregue, aberta, atrasada), e ao clicar em um dia o painel abaixo lista as tarefas dele.
7. **Lembretes**: card com o próximo lembrete pendente (ações "Adiar 15 min" e "Dispensar") e a lista dos lembretes do dia.
8. **Projetos do time (Linear)**: tabela com, por projeto em andamento, % entregue, % restante, issues concluídas/total, data da última entrega (data-alvo) e status "No ritmo" / "Abaixo do ritmo".
9. **Busca** no topo, filtrando as tarefas de hoje por nome ou projeto.
10. **Tema claro e escuro**: seletor no topo (Claro / Escuro). Padrão: preferência do sistema. Persistir a escolha.

Não incluir: sino de notificações nem bloco de nome/cargo no topo (foram removidos de propósito).

## Regras de negócio

- **Prazo com horário**: `dueDate` + `dueTime`. Sem horário, o prazo vale até **23:59** do dia para fins de "atraso".
- **Lembrete**: `reminderAt = prazo − offset`. Se não há horário, o lembrete toca às **09:00** do dia do prazo. Para "1 dia antes", usa o mesmo horário do dia anterior (ou 09:00 do dia anterior se não há horário). *O protótipo ainda não implementava "1 dia antes"; implementar de verdade.*
- **Atrasada**: `dueDate < hoje` e `status != done`.
- **Entregue com atraso**: `deliveredAt > prazo` (com a regra de 23:59 acima).
- **Ao reabrir** uma tarefa concluída, limpar `deliveredAt`.
- **Semana**: o protótipo usou "hoje + 4 dias". **Decisão a confirmar com o usuário**: usar a semana corrente de segunda a sexta (ou segunda a domingo).
- **Rosca**: percentual = concluídas ÷ total do período, arredondado. Total zero = 0%.
- **Linear, por projeto**:
  - `% entregue` = issues concluídas ÷ total de issues (ou o campo `progress` do projeto, se preferir; documentar a escolha).
  - `% restante` = 100 − % entregue.
  - `Última entrega` = data-alvo do projeto (`targetDate`).
  - `Esperado` = (hoje − início) ÷ (data-alvo − início). **No ritmo** se `% entregue ≥ esperado − 10 pontos`; senão **Abaixo do ritmo**. Sem data de início ou de alvo, não exibir o status.
  - Mostrar só projetos em andamento (não concluídos nem cancelados).

## Modelo de dados (ponto de partida)

```
Task
  id            string (cuid)
  userId        string
  title         string
  dueDate       date
  dueTime       string | null      // "HH:mm" ou null = sem horário definido
  priority      enum(HIGH, MEDIUM, LOW)
  reminderOffset enum(NONE, MIN_15, MIN_30, HOUR_1, DAY_1)
  reminderAt    datetime | null    // calculado ao salvar; null se NONE
  reminderState enum(SCHEDULED, SNOOZED, DISMISSED, SENT)
  status        enum(TODO, DOING, DONE)
  deliveredAt   datetime | null
  projectName   string | null      // texto livre ou id de projeto do Linear
  createdAt, updatedAt
```

## Integração com o Linear

- API GraphQL do Linear. Autenticação com **chave de API pessoal** guardada em variável de ambiente (`LINEAR_API_KEY`), nunca no código nem no front-end.
- A chamada acontece no servidor (route handler ou server action) e o resultado é cacheado por poucos minutos.
- Confirmar nos docs do Linear os campos exatos de projeto (progresso, datas, estado) antes de implementar. Definir com o usuário qual **time** exibir.
- Enquanto a chave não estiver configurada, mostrar dados de exemplo claramente marcados como tal.

## Lembretes

Os lembretes precisam funcionar **com o app fechado**. Proposta, em ordem:
1. Web Push (service worker) + job agendado (cron) que envia quando `reminderAt` chega.
2. E-mail como alternativa (ex.: Resend).
3. Opcional: criar o evento no Google Calendar com alerta.

Dentro do app, manter o card "Lembretes" com adiar 15 min e dispensar.

## Design

Estilo: fundo lavanda suave, sidebar flutuante, cards brancos com sombra leve, ícones em blocos com gradiente rosa e lilás, pílulas de status, tabelas com cabeçalho em faixa. Fonte: **Plus Jakarta Sans** (400, 500, 600, 700, 800).

| Token | Claro | Escuro |
|---|---|---|
| Fundo da página | gradiente `#FBF8FF → #F4EEFC → #FDF1F8` | gradiente `#0E0A1C → #130C28 → #1A0E24` |
| Card | `#FFFFFF` | `#17112B` |
| Borda | `#EFEAF8` | `#2A2244` |
| Texto | `#1F1147` | `#F3F0FF` |
| Texto secundário | `#4B4563` | `#C9C2E0` |
| Texto discreto | `#6B6585` | `#A79FC2` |
| Gradiente de ação | `#DB2777 → #7C3AED` | igual |

- Raios: cards 20px, botões e campos 14px, pílulas 8px (etiquetas) ou totalmente arredondadas (abas).
- Prioridade: Alta rosa, Média lilás, Baixa azul. Atrasada em laranja. Entregue em verde. Sempre acompanhar a cor com texto.
- Rosca de hoje: `#8B5CF6` (entregues), `#EC4899` (em andamento), `#FDBA74` (a fazer). Rosca da semana: `#4F46E5`, `#38BDF8`, lavanda.
- Todas as cores exatas do tema escuro estão no objeto `c` da função `renderVals()` em `design/dashboard-referencia.dc.html`. Extrair para tokens (CSS variables) em vez de repetir valores.
- Layout responsivo: sidebar + conteúdo, grids que quebram em coluna única no celular, tabelas com rolagem horizontal própria.

## Acessibilidade

- Botões reais (`<button>`), campos com `<label>`, `aria-label` nos botões só com ícone, `aria-pressed` nos seletores.
- Alvos de toque de pelo menos 40–44px.
- Contraste de texto AA nos dois temas.
- Nada depende só de cor: status sempre com rótulo.

## Ordem de trabalho

1. **Base**: projeto Next.js, tokens de tema claro/escuro, layout (sidebar, topo), componentes de UI com dados mockados, igual ao design.
2. **Dados**: Prisma + SQLite, CRUD de tarefas, modal de nova tarefa, mudança de status com `deliveredAt`, listas de hoje/atrasadas, roscas, calendário e registro de entregas, tudo vindo do banco.
3. **Testes** da lógica de datas, lembretes, atraso e progresso (Vitest).
4. **Linear**: leitura dos projetos e cálculo de progresso.
5. **Lembretes** com o app fechado.
6. **Acesso e deploy**: login simples (uso pessoal), Postgres em produção, variáveis de ambiente, publicação.

## Decisões em aberto (perguntar ao usuário antes de implementar)

- Semana: segunda a sexta ou segunda a domingo?
- Canal dos lembretes: push, e-mail, Google Calendar, ou mais de um?
- Qual time do Linear exibir?
- Hospedagem (Vercel + Neon/Supabase é a sugestão) e forma de login.

## Convenções

- TypeScript estrito. Funções de data e de progresso isoladas em `lib/` e cobertas por testes.
- Nenhuma chave ou segredo no repositório; usar `.env.local` e deixar um `.env.example`.
- Commits pequenos, um por etapa da lista acima.
