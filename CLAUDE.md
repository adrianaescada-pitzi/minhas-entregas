# Dashboard de tarefas pessoais

App web de uso pessoal para acompanhar as tarefas do trabalho, publicado num link fixo (sem login). Idioma da interface: **português do Brasil**. Fuso: **America/Sao_Paulo**.

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
8. **Busca** no topo, filtrando as tarefas de hoje por nome ou projeto.
9. **Tema claro e escuro**: seletor no topo (Claro / Escuro). Padrão: preferência do sistema. Persistir a escolha.

Não incluir: sino de notificações nem bloco de nome/cargo no topo (foram removidos de propósito).

**Fora do escopo (decidido)**: integração com o Linear (tabela "Projetos do time" e card "Conectar ao Linear"), lembretes com o app fechado (push/e-mail/Google Calendar) e login. O campo Projeto da tarefa é texto livre.

## Regras de negócio

- **Prazo com horário**: `dueDate` + `dueTime`. Sem horário, o prazo vale até **23:59** do dia para fins de "atraso".
- **Lembrete**: `reminderAt = prazo − offset`. Se não há horário, o lembrete toca às **09:00** do dia do prazo. Para "1 dia antes", usa o mesmo horário do dia anterior (ou 09:00 do dia anterior se não há horário). *O protótipo ainda não implementava "1 dia antes"; implementar de verdade.*
- **Atrasada**: `dueDate < hoje` e `status != done`.
- **Entregue com atraso**: `deliveredAt > prazo` (com a regra de 23:59 acima).
- **Ao reabrir** uma tarefa concluída, limpar `deliveredAt`.
- **Semana**: segunda a sexta da semana corrente (o protótipo usava "hoje + 4 dias").
- **Rosca**: percentual = concluídas ÷ total do período, arredondado. Total zero = 0%.

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
  projectName   string | null      // texto livre
  createdAt, updatedAt
```

## Lembretes

O card "Lembretes" mostra o próximo lembrete pendente do dia, com "Adiar 15 min" e "Dispensar". Os avisos só aparecem com o dashboard aberto; não há notificação com o app fechado (fora do escopo).

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

1. **Base** (concluída): projeto Next.js, tokens de tema claro/escuro, layout e componentes com dados mockados.
2. **Dados**: Prisma + SQLite, CRUD de tarefas, modal de nova tarefa, mudança de status com `deliveredAt`, listas de hoje/atrasadas, roscas, calendário e registro de entregas, tudo vindo do banco.
3. **Testes** (Vitest) da lógica de datas, lembretes, atraso e progresso.
4. **Deploy sem login**: Postgres em produção, variáveis de ambiente e publicação num link fixo. Sem login; a página não é indexada por buscadores (robots/noindex), mas quem tiver o link vê e edita tudo.

## Decisões

- Semana do progresso: **segunda a sexta** da semana corrente.
- Projeto da tarefa: texto livre, com sugestão dos já usados.
- Acesso: link sem login (aceito: quem tiver o link vê e edita). Sem indexação.
- Hospedagem (Vercel + Neon/Supabase é a sugestão): **a decidir antes da etapa 4**.

## Convenções

- TypeScript estrito. Funções de data e de progresso isoladas em `lib/` e cobertas por testes.
- Nenhuma chave ou segredo no repositório; usar `.env.local` e deixar um `.env.example`.
- Commits pequenos, um por etapa da lista acima.
