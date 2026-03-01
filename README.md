# Trocarta

Marketplace de troca de cartas desenvolvido como teste técnico para a vaga de Front-End Pleno na InMeta.

## Tecnologias

- Vue 3 com Composition API e TypeScript
- Vite
- Tailwind CSS v4
- Pinia (gerenciamento de estado)
- Vue Router
- Axios (cliente HTTP)
- Vee-validate + Zod (validação de formulários)
- Vitest + Vue Test Utils (testes unitários)
- Vue Sonner (notificações)
- Lucide Vue (ícones)
- Date-fns (formatação de datas)

## Funcionalidades

- Listagem de trocas abertas no marketplace
- Cadastro e autenticação de usuários
- Gerenciamento da coleção de cartas
- Criação de novas trocas em 3 etapas
- Exclusão de trocas próprias
- Busca por nome de carta
- Interface responsiva para mobile e desktop

## Arquitetura

O projeto segue uma arquitetura em camadas:

- `src/api` — funções de comunicação com a API, separadas por domínio
- `src/stores` — stores Pinia por domínio (auth, cards, trades)
- `src/pages` — páginas da aplicação
- `src/components` — componentes reutilizáveis divididos em ui, cards, trades e layout
- `src/composables` — funções reutilizáveis que utilizam a Composition API
- `src/types` — interfaces e tipos TypeScript centralizados
- `src/config.ts` — constantes globais da aplicação

### Estrutura do projeto

```
src/
├── api/           # Cliente HTTP (axios), interceptors e funções por domínio (auth, cards, trades)
├── components/    # ui (botões, inputs, modal), cards (CardTile), trades (TradeCard), layout (navbar)
├── composables/   # useDebounce e demais lógica reutilizável
├── pages/         # Uma página por rota (Marketplace, Login, Register, MyCards, NewTrade)
├── router/        # Rotas e guard de autenticação (requiresAuth)
├── stores/        # Pinia: auth (usuário, token, login/logout), cards (catálogo + coleção), trades
├── types/         # Interfaces TypeScript (User, Card, Trade, payloads da API)
└── config.ts      # Constantes (TOKEN_KEY, CACHE_TTL)
```

### Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Marketplace — listagem de trocas abertas |
| `/login` | Público | Login |
| `/register` | Público | Cadastro de usuário |
| `/my-cards` | Autenticado | Minha coleção e adicionar cartas |
| `/trades/new` | Autenticado | Criar nova solicitação de troca |

### Integração com a API

A aplicação consome a API em `VITE_API_URL` (ver `.env.example`). O cliente em `src/api/client.ts` envia o token JWT no header `Authorization: Bearer <token>` em todas as requisições após o login; o token é persistido em `localStorage`. Erros da API são normalizados em `ApiError` (status HTTP e payload) e tratados nas páginas com feedback via toasts.

## Como executar

**Pré-requisitos:** Node.js 18+ (recomendado 20+).

1. Copie o arquivo de exemplo de variáveis de ambiente e ajuste se necessário:

```bash
# Linux / macOS / Git Bash
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

A URL padrão (`https://cards-marketplace-api.onrender.com`) já aponta para a API do desafio. A API pode demorar alguns minutos para responder após inatividade (hibernação em ~30s).

2. Instale as dependências e inicie o projeto:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm run test

# Executar testes sem watch
npm run test:run

# Build para produção
npm run build
```

## Testes

O projeto conta com 43 testes unitários cobrindo:

- Stores: auth, cards, trades
- Componentes: AppButton, AppInput, CardTile
- Composables: useDebounce

## Decisões técnicas

**Zod v3** foi utilizado no lugar do v4 por compatibilidade com o `@vee-validate/zod`.

**Cache:** foi implementado cache com TTL (Time To Live) de 60 segundos na store de cartas (`src/stores/cards.ts`). Ao listar as cartas do sistema (catálogo geral), as requisições à API só são feitas quando o cache expira ou quando os dados são forçados a atualizar, reduzindo chamadas desnecessárias e melhorando a resposta ao navegar entre telas que usam o mesmo catálogo. As listagens de trocas não utilizam cache, pois as ofertas mudam com frequência e o usuário deve ver sempre o estado mais recente do marketplace.

**ApiError customizado** foi criado para preservar o status HTTP e o payload original dos erros, facilitando o tratamento de erros específicos no futuro.

**Debounce nos campos de busca** foi implementado via composable reutilizável para evitar filtragens excessivas durante a digitação.

**Cartas a receber na Nova Troca:** na etapa "O que você quer receber?", a lista exibe apenas cartas que o usuário ainda não possui. A API permite escolher entre todas as cartas registradas; optei por filtrar as que já estão na coleção para evitar trocas por cartas duplicadas e tornar o fluxo mais intuitivo.

## Limitações conhecidas

A API não disponibiliza endpoint para remover cartas da coleção, por isso essa funcionalidade não foi implementada.
