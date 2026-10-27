# Adaptação a Shopify

## Escolha e compromissos

O protótipo usa HTML produzido por módulos JavaScript, CSS sem framework e secções reutilizáveis. É pequeno, funciona localmente e não depende de uma API ou conta. A estrutura aproxima as responsabilidades de um tema Online Store 2.0, mas a navegação por fragmentos (`#/...`), a renderização JavaScript e o carrinho local terão de ser substituídos. Não é um tema válido, não foi validado com Shopify Theme Check nem testado numa loja.

## O que aproveitar

Fotografias WebP (e originais para outros recortes), logótipo, direção artística, cores, tipografia de sistema, CSS responsivo, conteúdos aprovados, composição das secções, galeria e padrões acessíveis. Transpor o HTML de cada secção para Liquid, com atenção aos dados dinâmicos e aos estilos por secção. Os módulos JavaScript não se convertem automaticamente em Liquid.

| Protótipo                                 | Destino sugerido no tema                                      |
| ----------------------------------------- | ------------------------------------------------------------- |
| `header`, `footer`                        | Grupos de secções de cabeçalho/rodapé, menus Shopify          |
| Hero, introdução, coleção, bloco da marca | `sections/*.liquid` com `schema`, settings e blocos editáveis |
| `productCard`                             | `snippets/card-product.liquid` com objeto `product`           |
| Página inicial                            | `templates/index.json`                                        |
| Loja                                      | `templates/collection.json` + coleção real                    |
| Produto                                   | `templates/product.json` + secção principal de produto        |
| Sobre                                     | `templates/page.about.json` + página e conteúdo aprovado      |
| Carrinho                                  | `templates/cart.json` + secção e formulário reais             |
| `src/data.js`                             | Produtos, variantes, media, páginas, metafields e settings    |
| CSS / galeria / menu                      | `assets/`, ajustando eventos ao editor de temas               |

## Trailer e cabeçalho

Transpor o destaque para uma secção com um setting `video` do editor Shopify e renderizar o vídeo com os recursos nativos de media. Expor poster, recorte e conteúdo editorial como settings. Aproveitar os comportamentos de pausa, preferência de movimento reduzido e header transparente/branco de `video.js` e `navigation.js`, adaptando o arranque ao ciclo de carregamento de secções do editor de temas. Verificar reprodução automática e recortes em Safari/iOS e no editor; não presumir que um vídeo vertical é adequado a todos os ecrãs.

## Produtos e variantes

Criar apenas o produto confirmado; configurar título, descrição, preço, moeda, impostos, imagens e textos alternativos. Criar as variantes reais por tamanho, SKU, disponibilidade e stock. Remover integralmente as opções de teste. Usar IDs de variantes Shopify e o estado `available`, não os identificadores locais. Confirmar se a designação da cor e o nome descritivo correspondem à nomenclatura oficial. Não inferir composição ou sustentabilidade a partir de fotografias.

## Carrinho e navegação

Trocar rotas `#/...` por URLs e `routes` do Shopify e ligar os menus à navegação da loja. Usar um formulário de produto Liquid com ID de variante, quantidade e `routes.cart_add_url`, ou Ajax Cart API com URLs conscientes da localização (`window.Shopify.routes.root`). O carrinho deve usar os dados reais do servidor, chaves de linha e preços/totais devolvidos pela plataforma. Substituir `localStorage`, tratar erros de stock, variantes indisponíveis, remoção, descontos e alteração de quantidades. Não transferir carrinhos de teste para encomendas reais.

O checkout real pertence ao Shopify. Remover o aviso de demonstração apenas depois de validar a integração; nunca recolher dados de cartão neste código.

## Configuração necessária na loja

- Conta/loja e tema de desenvolvimento; Shopify CLI e acesso autorizado apenas nessa fase.
- Identidade comercial, domínio, moeda EUR ou outra confirmada, mercados, idioma pt-PT e traduções das mensagens do tema e checkout.
- Produtos, variantes, preços, inventário e locais de expedição; confirmar a política para stock esgotado.
- Pagamentos disponíveis para a entidade e país, configuração fiscal e faturação.
- Zonas, tarifas, prazos, transportadoras e regras de envio, trocas/devoluções e políticas legais aprovadas.
- Contactos, notificações de encomenda, privacidade e consentimento; apps de faturação, transporte, email ou analytics só quando necessárias.

## Validação antes de abrir

Executar Theme Check; testar templates e editor de temas, URLs diretas, teclado, foco, imagens, pesquisa/coleções se adicionadas, seleção de variantes, stock esgotado e erros de carrinho. Validar Safari/iOS, Android e computador. Confirmar preços, impostos, portes, descontos, idioma e moeda no checkout. Usar o modo de teste do fornecedor de pagamentos e encomendas de teste; verificar emails, inventário, expedição, cancelamentos e reembolsos antes de ativar pagamentos reais. Fazer nova revisão de acessibilidade, desempenho, SEO e políticas.

Nenhuma ligação à Shopify ou alteração numa loja foi feita nesta entrega; não são necessárias credenciais para testar localmente.
