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

## Como executar

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

**Cache com TTL** foi implementado na store de cards para evitar requisições desnecessárias à API. As trades não utilizam cache pois mudam com frequência.

**ApiError customizado** foi criado para preservar o status HTTP e o payload original dos erros, facilitando o tratamento de erros específicos no futuro.

**Debounce nos campos de busca** foi implementado via composable reutilizável para evitar filtragens excessivas durante a digitação.

## Limitações conhecidas

A API não disponibiliza endpoint para remover cartas da coleção, por isso essa funcionalidade não foi implementada.
