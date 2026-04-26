# RVM.E2E

## Visao Geral

RVM.E2E e a suite Playwright E2E centralizada para todos os frontends do portfolio RVM Tech. Cada arquivo de spec (`tests/*.spec.ts`) cobre um projeto, testando navegacao, layout, fluxos principais e estados de erro. Os testes rodam contra o ambiente de portfolio (`*.lab.rvmtech.com.br`) — sem autenticacao SSO, sem dados reais.

Este repositorio nao tem codigo de aplicacao — e inteiramente de testes. Nao ha TESTING.md separado.

## Stack

- **Playwright** `^1.58.2` (TypeScript)
- **Node.js** 18+
- **Browser:** Chromium (unico — sem cross-browser para portfolio)
- **Config:** `playwright.config.ts` na raiz

## Estrutura

```
tests/
  authforge.spec.ts     # RVM.AuthForge
  codelens.spec.ts      # RVM.CodeLens
  docforge.spec.ts      # RVM.DocForge
  healthguard.spec.ts   # RVM.HealthGuard
  liveboard.spec.ts     # RVM.LiveBoard
  logstream.spec.ts     # RVM.LogStream
  mcpforge.spec.ts      # RVM.McpForge
  menunamao.spec.ts     # RVM.MenuNaMao
  nearby.spec.ts        # RVM.NearBy
  shopengine.spec.ts    # RVM.ShopEngine
playwright.config.ts
package.json
```

## Convencoes

- **URL base:** constante `BASE` no topo de cada spec. Padrao: `https://<projeto>.lab.rvmtech.com.br`.
- **Helper Blazor:** usar `waitForBlazor(page)` antes de interagir com qualquer componente Blazor Server. Aguarda o circuit se estabilizar (modal de reconexao desaparecendo, 2s de buffer).
- **Seletores:** preferir seletores semanticos (`getByRole`, `getByText`) sobre CSS classes geradas pelo Blazor. Para elementos customizados, usar `locator()` com seletores CSS estaveis.
- **Timeout:** 60s por teste, 15s por expect. Nao aumentar sem justificativa — indica problema no app.
- **Retries:** 1 retry automatico. Screenshot capturado apenas em falha. Trace disponivel na primeira retry.
- **Paralelismo:** 3 workers. Testes dentro do mesmo spec rodam em sequencia (sem `test.parallel()`).
- **Nomenclatura:** `test.describe("RVM.NomeProjeto", () => { ... })` — prefixo RVM no describe.

## Como Rodar

```bash
npm install
npx playwright install chromium

# Todos
npm test

# Um spec
npx playwright test authforge.spec.ts

# Debug visual
npm run test:ui
```

## Adicionar Novo Spec

1. Criar `tests/<projeto>.spec.ts`
2. Definir `const BASE = "https://<projeto>.lab.rvmtech.com.br"`
3. Copiar o helper `waitForBlazor` se o projeto for Blazor Server
4. Cobrir: redirect inicial, layout (sidebar/navbar), pelo menos 2 paginas, 1 acao CRUD ou busca
5. Rodar localmente antes de fazer PR

## Decisoes

- **Suite centralizada** (vs. Playwright em cada repo de portfolio) — evita duplicar instalacao de browsers e configuracao em 10 repos. Um unico lugar para manter e atualizar.
- **Somente Chromium** — portfolio nao exige cross-browser; chromium cobre 95%+ do publico alvo.
- **Sem fixtures de banco** — testes sao read-only ou usam dados de seed do ambiente de portfolio. Nao criam nem apagam dados.
