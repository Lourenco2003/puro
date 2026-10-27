# PURO — protótipo local

Website em português de Portugal, sem conta Shopify, serviços externos, pagamentos ou credenciais. Usa JavaScript nativo, CSS e Vite. Não é um tema Shopify instalável.

## Executar no computador

Requisitos: Node.js 20.19+ ou 22.12+ (recomendado: Node 24 LTS) e npm. Extrair o ZIP, abrir um terminal na pasta com `package.json` e executar:

No Windows / PowerShell (evita o bloqueio de `npm.ps1`):

```powershell
npm.cmd ci
npm.cmd run dev
```

No macOS / Linux:

```sh
npm ci
npm run dev
```

Abrir no navegador o endereço indicado pelo Vite, normalmente **http://localhost:5173**. Parar com Ctrl+C. Não abrir `index.html` diretamente. O servidor escuta em todas as interfaces para permitir testes num telemóvel na mesma rede; usa `npm run dev -- --host 127.0.0.1` para limitar o acesso ao computador.

Versão de produção local:

```sh
npm run build
npm run preview
```

O preview usa normalmente a porta 4173. `dist/` contém os ficheiros estáticos prontos a alojar. Não publicar `originals/`, `node_modules/` ou os testes como parte do site.

## Atualizar uma versão anterior no Windows

Estas alterações não adicionam nem alteram dependências. Não é necessário reinstalar o Node.js.

1. Parar o servidor antigo com Ctrl+C no terminal.
2. Extrair o novo ZIP para uma pasta temporária. Abrir a pasta que contém `package.json`.
3. Copiar os ficheiros e pastas do projeto atualizado para a pasta onde já executavas a versão anterior, aceitando substituir os ficheiros. Não apagar a pasta `node_modules` existente; o ZIP não a contém. Copiar para a mesma pasta de `package.json`, evitando criar outra pasta do projeto lá dentro.
4. Nessa pasta original, executar apenas `npm.cmd run dev` e abrir o endereço apresentado pelo Vite. Se necessário, atualizar o navegador com Ctrl+F5.

Se preferires executar numa pasta completamente nova, executar primeiro `npm.cmd ci` nessa pasta, uma só vez, e depois `npm.cmd run dev`. Em futuras atualizações que alterem `package.json` ou `package-lock.json` nas dependências, repetir `npm.cmd ci`. Para iniciar diariamente, basta `npm.cmd run dev`; manter o terminal aberto.

## O que funciona

- Trailer a ocupar o ecrã inteiro na página inicial, em repetição e sem som, com controlo para pausar/reproduzir. Cabeçalho fixo e transparente no topo, branco ao fazer scroll ou abrir o menu; branco nas páginas interiores.
- Início editorial, loja com um produto, produto com quatro fotografias, página da marca e páginas informativas.
- Menu móvel, navegação por teclado, ligação para saltar o conteúdo, foco visível e diálogos com Escape e retorno de foco.
- Seleção obrigatória de opção de teste, quantidade inteira de 1 a 99 (limite técnico, não stock), confirmação, carrinho persistente neste navegador, alteração de quantidades e remoção.
- Subtotal: zero quando vazio; “A definir” quando o preço está em falta. O cálculo em cêntimos está implementado para um preço confirmado. Não se inventou um preço para preencher o total.
- Checkout abre apenas um aviso: não envia encomendas nem cobra valores.
- Sem filtros nem ordenação: só existe um produto identificado. Sem analytics, fontes remotas ou cookies de publicidade.

## Dados provisórios e edição

`src/data.js` concentra o produto, as fotografias, os textos e as informações. O nome “T-shirt PURO — Borboleta” é descritivo, sujeito a confirmação. Preço (`priceCents: null`), tamanhos reais, stock, composição, medidas, cuidados, história, contactos, envios, impostos e políticas estão a definir. As duas “Opções de teste” NÃO representam variantes ou tamanhos disponíveis. Não interpretar a adição ao carrinho como disponibilidade comercial.

As frases editoriais são propostas, não factos sobre a fundação, produção ou sustentabilidade da marca. Confirmar todos os conteúdos antes de publicar uma loja. O catálogo não inclui as calças ou outros acessórios visíveis nas fotografias. Não foi fornecido um design Google Stitch. O acesso a scuffers.com devolveu 403; a direção visual baseia-se nas indicações do pedido, sem copiar o site.

Para confirmar um preço, definir `priceCents` com um inteiro em cêntimos e adaptar os rótulos “Preço a definir” em `src/sections.js` ao formatador `money`. Para variantes comerciais reais, substituir as opções de demonstração e ligar seleção e disponibilidade aos dados definitivos. Os dados locais são considerados conteúdo de confiança; ao integrar entradas externas, escapar texto e validar dados, ou usar templates Liquid com os filtros apropriados.

## Organização

- `src/sections.js`: cabeçalho, rodapé, cartão, secções e páginas reutilizáveis.
- `src/main.js`: rotas locais, galeria, formulários e diálogos.
- `src/navigation.js`: menu móvel e transparência do cabeçalho.
- `src/video.js`: reprodução, pausa, preferências de movimento e fallback do trailer.
- `src/cart.js`: persistência local e operações do carrinho, separadas da apresentação.
- `src/style.css`: identidade visual e adaptação a ecrãs.
- `originals/`: todos os materiais do ZIP, sem alterações (inclui vídeo e ficheiros de design).
- `public/images/`: derivados WebP das fotografias e logótipo extraído do ficheiro fornecido. Inclui o poster do trailer; as imagens com texto não são carregadas no site.
- `public/videos/trailer-puro.mp4`: cópia de distribuição do trailer, sem faixa de áudio e com início rápido; o vídeo original foi preservado.
- `scripts/optimize-images.py`: regeneração opcional das fotografias com Python/Pillow; os derivados já estão incluídos.
- `SHOPIFY.md`: plano de migração e configuração comercial.

As imagens foram reduzidas a um máximo de 1600 px e convertidas em WebP; originais preservados. Carregamento diferido nas imagens fora do destaque, sem dependência de um CDN. As 23 fotografias otimizadas ocupam cerca de 5,5 MB no total; a página só referencia uma seleção.

## Trailer e organização do código

O trailer fornecido tem 480 × 848 px (vertical). O destaque usa `object-fit: cover` para preencher todo o ecrã sem deformar a imagem; em computador isto recorta parte da imagem e amplia a resolução original. Para maior nitidez no computador, fornecer uma versão horizontal com mais resolução. O vídeo foi preparado sem som para reprodução automática; a versão original com áudio continua em `originals/`.

O botão permite pausar/reproduzir e funciona com teclado. Se o navegador bloquear o arranque automático, pode-se iniciar manualmente. A preferência de movimento reduzido mantém o vídeo pausado até intervenção do utilizador. Um poster extraído do próprio trailer serve de alternativa enquanto carrega.

Todos os ficheiros de código editáveis foram formatados em múltiplas linhas, com indentação e comentários em português. As páginas estão nas funções documentadas de `src/sections.js`; as regras visuais em `src/style.css`. `.prettierrc.json` mantém uma configuração de formatação consistente. `package-lock.json` é gerado pelo npm e não deve ser editado à mão. O build em `dist/` é comprimido automaticamente para distribuição; editar sempre os ficheiros de `src/`.

## Testar

```sh
npx playwright install chromium
npm test
```

Em Linux, o Playwright pode pedir dependências do sistema (`npx playwright install --with-deps chromium`). Se já existir um Chromium, pode-se indicar o executável com a variável `PURO_CHROMIUM_PATH`; exemplo Linux:

```sh
PURO_CHROMIUM_PATH=/usr/bin/chromium npm test
```

Os testes arrancam o Vite automaticamente, usam contextos isolados e verificam os percursos em computador, tablet e telemóvel. Capturas ficam em `test-results/`. Validados neste ambiente: build e testes Chromium com emulação de dispositivos. Isto não substitui testes em Safari/iOS e dispositivos físicos, nem constitui uma auditoria completa de acessibilidade.

## Próximas confirmações

Nome final do produto, preço, tamanhos e medidas, stock, composição e cuidados, história e contactos oficiais, regras comerciais e aprovação dos textos. Ver `SHOPIFY.md` antes da migração.
