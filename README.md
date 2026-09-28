> ⛔ **APOSENTADO em 27/09/2026 — repositório arquivado (somente leitura).**
>
> A suíte só testava o tier `*.lab.rvmtech.com.br` (portfólio), que saiu do ar em 01/09/2026 (TASK-832).
> Nenhum workflow do ecossistema a chamava. Os E2E vivos moram em cada app (`test/playwright`, `e2e.yml`
> via `Elfarrar/RVM.Actions`). Mantido só como histórico — não desenvolver.

# RVM.E2E

Suite Playwright E2E centralizada para todos os frontends do portfolio RVM Tech. Cada arquivo de spec cobre um projeto — navegacao, layout, fluxos principais e estados de erro.

## Projetos Cobertos

| Spec | Projeto | URL base |
|---|---|---|
| `authforge.spec.ts` | RVM.AuthForge | `https://authforge.lab.rvmtech.com.br` |
| `codelens.spec.ts` | RVM.CodeLens | `https://codelens.lab.rvmtech.com.br` |
| `docforge.spec.ts` | RVM.DocForge | `https://docforge.lab.rvmtech.com.br` |
| `healthguard.spec.ts` | RVM.HealthGuard | `https://healthguard.lab.rvmtech.com.br` |
| `liveboard.spec.ts` | RVM.LiveBoard | `https://liveboard.lab.rvmtech.com.br` |
| `logstream.spec.ts` | RVM.LogStream | `https://logstream.lab.rvmtech.com.br` |
| `mcpforge.spec.ts` | RVM.McpForge | `https://mcpforge.lab.rvmtech.com.br` |
| `menunamao.spec.ts` | RVM.MenuNaMao | `https://menunamao.lab.rvmtech.com.br` |
| `nearby.spec.ts` | RVM.NearBy | `https://nearby.lab.rvmtech.com.br` |
| `shopengine.spec.ts` | RVM.ShopEngine | `https://shopengine.lab.rvmtech.com.br` |

## Pre-requisitos

- Node.js 18+
- Browsers Playwright instalados

```bash
npm install
npx playwright install chromium
```

## Como Rodar

```bash
# Todos os testes
npm test

# Suite especifica
npx playwright test authforge.spec.ts

# Com UI interativa (debug)
npm run test:ui

# Com browser visivel
npm run test:headed

# Modo headless + report HTML
npm test && npm run report
```

## Configuracao

As URLs base estao hardcoded em cada spec file apontando para o ambiente de portfolio (`*.lab.rvmtech.com.br`). Para testar outro ambiente, altere a constante `BASE` no topo do spec desejado.

Configuracao global em `playwright.config.ts`:

| Parametro | Valor |
|---|---|
| Timeout por teste | 60 segundos |
| Timeout de expect | 15 segundos |
| Retries | 1 |
| Workers paralelos | 3 |
| Browser | Chromium |
| Screenshot | Apenas em falha |
| Trace | Na primeira retry |

## Estrutura

```
RVM.E2E/
├── tests/
│   ├── authforge.spec.ts
│   ├── codelens.spec.ts
│   ├── docforge.spec.ts
│   ├── healthguard.spec.ts
│   ├── liveboard.spec.ts
│   ├── logstream.spec.ts
│   ├── mcpforge.spec.ts
│   ├── menunamao.spec.ts
│   ├── nearby.spec.ts
│   └── shopengine.spec.ts
├── playwright.config.ts
├── package.json
└── playwright-report/       # Report HTML (gerado apos execucao)
```

## Adicionar Novo Spec

1. Criar `tests/<nome-do-projeto>.spec.ts`
2. Definir `const BASE = "https://<projeto>.lab.rvmtech.com.br"`
3. Usar o helper `waitForBlazor(page)` para apps Blazor Server (aguarda reconexao do circuit)
4. Rodar `npx playwright test <nome>.spec.ts` para validar

## Licenca

MIT
