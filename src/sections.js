import { content, product, policies } from "./data.js";
import { cart, count, subtotal, money } from "./cart.js";
export const iconArrow = '<span aria-hidden="true">↗</span>';
/** Cabeçalho partilhado. A transparência é controlada no módulo navigation.js. */
export function header() {
  return /* HTML */ `
    <div class="header-shell">
      <div class="announcement">
        UM PRIMEIRO OLHAR SOBRE A PURO
        <span>·</span>
        LOJA DE DEMONSTRAÇÃO
      </div>
      <header class="header">
        <button
          class="menu-button plain"
          aria-label="Abrir menu"
          aria-expanded="false"
          aria-controls="mobile-menu"
        >
          ☰
        </button>
        <nav class="desktop-nav" aria-label="Navegação principal">
          <a href="#/loja">Loja</a>
          <a href="#/sobre">A PURO</a>
        </nav>
        <a class="brand" href="#/" aria-label="PURO — Página inicial">
          <img src="/images/logo.webp" alt="PURO" width="130" height="42" />
        </a>
        <a class="cart-link" href="#/carrinho">
          Carrinho
          <span class="cart-count">${count()}</span>
        </a>
      </header>
      <nav id="mobile-menu" class="mobile-menu" aria-label="Menu móvel" hidden>
        <a href="#/">Início</a>
        <a href="#/loja">Loja</a>
        <a href="#/sobre">A PURO</a>
        <a href="#/carrinho">Carrinho</a>
      </nav>
    </div>
  `;
}
/** Rodapé e ligações para informações comerciais ainda por confirmar. */
export function footer() {
  return /* HTML */ `
    <footer>
      <div class="footer-top">
        <a class="footer-word" href="#/">puro.</a>
        <p>
          Menos ruído.
          <br />
          Mais espaço para seres tu.
        </p>
        <a href="#/loja">Explorar a coleção ${iconArrow}</a>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} PURO</span>
        <div>
          ${Object.keys(policies)
            .map(
              (x, i) => /* HTML */ `
                <a href="#/informacao/${i}">${x}</a>
              `,
            )
            .join("")}
        </div>
        <span>Protótipo · Sem compras reais</span>
      </div>
    </footer>
  `;
}
/** Cartão reutilizado na página inicial e na loja; só mostra o produto identificado. */
export function productCard() {
  return /* HTML */ `
    <a class="product-card" href="#/produto/${product.slug}">
      <div class="card-photo">
        <img
          src="/images/puro-14.webp"
          alt="T-shirt clara PURO vista de frente"
          loading="lazy"
          width="800"
          height="1000"
        />
        <img class="card-back" src="/images/puro-16.webp" alt="" loading="lazy" />
        <span class="card-label">PURO / 01</span>
        <span class="card-arrow">↗</span>
      </div>
      <div class="card-caption">
        <div>
          <h3>${product.name}</h3>
          <span>Clara · Tamanhos a definir</span>
        </div>
        <span>Preço a definir</span>
      </div>
    </a>
  `;
}
/** Página inicial: trailer, introdução editorial, coleção e apresentação da marca. */
export function home() {
  return /* HTML */ `
    <section class="hero">
      <!-- Vídeo decorativo de campanha: sem som, com alternativa estática e controlo de pausa. -->
      <video
        class="hero-video"
        id="hero-video"
        muted
        loop
        playsinline
        preload="metadata"
        poster="/images/trailer-poster.webp"
        aria-label="Trailer de campanha da PURO"
      >
        <source src="/videos/trailer-puro.mp4" type="video/mp4" />
      </video>
      <div class="hero-shade"></div>
      <div class="hero-top">
        <span>PURO — PRIMEIRO CAPÍTULO</span>
        <span>FEITO PARA O TEU DIA.</span>
      </div>
      <div class="hero-content">
        <p class="eyebrow">O ESSENCIAL, À TUA MANEIRA</p>
        <h1>${content.heroTitle}</h1>
        <div class="hero-bottom">
          <p>${content.heroText}</p>
          <a class="button light" href="#/loja">Descobrir a coleção ${iconArrow}</a>
        </div>
      </div>
      <span class="hero-index">01 / PURO</span>
      <div class="video-controls">
        <span id="video-status" role="status" class="small"></span>
        <button class="video-toggle" type="button" aria-controls="hero-video">
          Reproduzir vídeo
        </button>
      </div>
    </section>
    <section class="intro section">
      <span class="eyebrow">NATURALMENTE, PURO.</span>
      <h2>
        Não precisas de muito.
        <br />
        Só de ser tu.
      </h2>
      <p>
        Uma t-shirt. Um detalhe nas costas.
        <br />
        O resto fica contigo.
      </p>
    </section>
    <section class="collection section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">A COLEÇÃO</p>
          <h2>O primeiro capítulo.</h2>
        </div>
        <a class="text-link" href="#/loja">Ver a coleção ${iconArrow}</a>
      </div>
      <div class="collection-grid">
        ${productCard()}
        <a class="editorial-tile" href="#/produto/${product.slug}">
          <img
            src="/images/puro-16.webp"
            alt="A borboleta PURO em destaque nas costas da t-shirt"
            loading="lazy"
          />
          <div>
            <span>UM OUTRO PONTO DE VISTA</span>
            <h3>
              Os detalhes
              <br />
              fazem a diferença.
            </h3>
            <span>Conhecer a peça ↗</span>
          </div>
        </a>
      </div>
    </section>
    <section class="brand-story">
      <img
        src="/images/puro-22.webp"
        alt="Retrato de campanha PURO junto a uma parede de azulejos"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">POR TRÁS DA PEÇA</p>
        <h2>${content.aboutTitle}</h2>
        <p>${content.aboutText}</p>
        <a class="text-link" href="#/sobre">Conhece a PURO ${iconArrow}</a>
      </div>
    </section>
  `;
}
/** Página da loja. Um produto não exige filtros ou ordenação. */
export function shop() {
  return /* HTML */ `
    <section class="page section">
      <div class="breadcrumbs">
        <a href="#/">Início</a>
        / Loja
      </div>
      <div class="section-heading">
        <div>
          <p class="eyebrow">PRIMEIRO CAPÍTULO</p>
          <h1>A coleção.</h1>
        </div>
        <span>1 produto</span>
      </div>
      <p class="muted">
        Uma peça, diferentes formas de a usar. Preço e tamanhos a definir.
      </p>
      <div class="shop-grid">${productCard()}</div>
    </section>
  `;
}
/** Página de produto: galeria, opções de teste e formulário ligado pelo main.js. */
export function productPage() {
  return /* HTML */ `
    <section class="product-page">
      <div class="gallery">
        <div class="main-photo">
          <img
            id="product-image"
            src="${product.images[0].src}"
            alt="${product.images[0].alt}"
            width="1000"
            height="1250"
          />
        </div>
        <div class="thumbnails" aria-label="Fotografias do produto">
          ${product.images
            .map(
              (im, i) => /* HTML */ `
                <button
                  class="thumbnail"
                  data-image="${i}"
                  aria-label="Ver imagem ${i + 1}: ${im.alt}"
                  aria-pressed="${i === 0}"
                >
                  <img src="${im.src}" alt="" width="100" height="125" />
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
      <div class="product-info">
        <div class="breadcrumbs">
          <a href="#/loja">Loja</a>
          / T-shirt PURO
        </div>
        <p class="eyebrow">PURO / 01</p>
        <h1>${product.name}</h1>
        <p class="price">Preço a definir</p>
        <p>${product.description}</p>
        <form id="product-form" novalidate>
          <fieldset aria-describedby="size-note size-error">
            <legend>
              Tamanho
              <span>— a definir</span>
            </legend>
            <p class="muted small" id="size-note">
              Opções apenas para testar o protótipo. Os tamanhos reais e a
              disponibilidade ainda não estão definidos.
            </p>
            <div class="size-options">
              ${product.demoOptions
                .map(
                  (o) => /* HTML */ `
                    <label>
                      <input type="radio" name="size" value="${o.id}" />
                      <span>${o.label}</span>
                    </label>
                  `,
                )
                .join("")}
            </div>
            <p id="size-error" class="error" role="alert"></p>
          </fieldset>
          <label class="quantity-label" for="quantity">Quantidade</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            max="99"
            value="1"
            required
          />
          <p class="small error" id="quantity-error" role="alert"></p>
          <button class="button dark add-button" type="submit">
            Adicionar ao carrinho
            <span aria-hidden="true">+</span>
          </button>
        </form>
        <p class="demo-note">
          Protótipo funcional. Não é possível efetuar compras reais.
        </p>
        <details>
          <summary>Detalhes da peça</summary>
          <p>
            Cor: ${product.color}. Composição: ${product.composition}. Medidas, cuidados
            e stock: a definir.
          </p>
        </details>
        <details>
          <summary>Envios e devoluções</summary>
          <p>Condições, prazos, custos e políticas: a definir.</p>
        </details>
      </div>
    </section>
  `;
}
/** Página do carrinho. Valores e quantidades vêm exclusivamente de cart.js. */
export function cartPage() {
  return /* HTML */ `
    <section class="page section cart-page">
      <div class="breadcrumbs">
        <a href="#/loja">Loja</a>
        / Carrinho
      </div>
      <h1>
        O teu carrinho
        <span class="heading-count">(${count()})</span>
      </h1>
      ${cart.length
        ? /* HTML */ `
            <div class="cart-layout">
              <div>
                ${cart
                  .map(
                    (item) => /* HTML */ `
                      <article class="cart-item">
                        <a href="#/produto/${product.slug}">
                          <img
                            src="${product.images[0].src}"
                            alt="T-shirt PURO clara"
                            width="130"
                            height="160"
                          />
                        </a>
                        <div>
                          <a href="#/produto/${product.slug}">
                            <h2>${product.name}</h2>
                          </a>
                          <p>
                            ${product.demoOptions.find((o) => o.id === item.option)
                              .label}
                            · Tamanho real a definir
                          </p>
                          <p>Preço a definir</p>
                          <label class="small" for="qty-${item.option}">
                            Quantidade
                          </label>
                          <input
                            id="qty-${item.option}"
                            data-quantity="${item.option}"
                            type="number"
                            min="1"
                            max="99"
                            value="${item.quantity}"
                          />
                          <button class="remove plain" data-remove="${item.option}">
                            Remover
                          </button>
                        </div>
                      </article>
                    `,
                  )
                  .join("")}
              </div>
              <aside class="summary">
                <h2>Resumo</h2>
                <div>
                  <span>Subtotal</span>
                  <strong>${money(subtotal())}</strong>
                </div>
                <p class="small">
                  O subtotal será calculado quando o preço for confirmado. Envios e
                  impostos: a definir.
                </p>
                <button class="button dark" id="checkout">
                  Finalizar compra ${iconArrow}
                </button>
                <p class="demo-note">Checkout de demonstração · Sem pagamentos</p>
                <a class="text-link" href="#/loja">Continuar a explorar</a>
              </aside>
            </div>
          `
        : /* HTML */ `
            <div class="empty-cart">
              <span aria-hidden="true">◯</span>
              <h2>Ainda está tudo em aberto.</h2>
              <p>O teu carrinho está vazio. Descobre a primeira peça da PURO.</p>
              <a class="button dark" href="#/loja">Explorar a coleção ${iconArrow}</a>
            </div>
          `}
    </section>
  `;
}
/** Página sobre a marca com textos propostos e história ainda por confirmar. */
export function about() {
  return /* HTML */ `
    <section class="about-hero">
      <img src="/images/puro-17.webp" alt="Fotografia urbana de campanha da PURO" />
      <div>
        <p class="eyebrow">A PURO</p>
        <h1>
          Um espaço
          <br />
          para seres tu.
        </h1>
        <p>${content.aboutText}</p>
      </div>
    </section>
    <section class="section about-copy">
      <p class="eyebrow">A NOSSA HISTÓRIA</p>
      <h2>
        Este capítulo
        <br />
        ainda está a ser escrito.
      </h2>
      <p>${content.history}</p>
      <p class="muted small">
        Os títulos e frases editoriais deste protótipo são propostas de comunicação,
        sujeitas a aprovação da marca.
      </p>
      <a class="text-link" href="#/loja">Descobrir a coleção ${iconArrow}</a>
    </section>
  `;
}
/** Página informativa selecionada pela rota; não contém políticas inventadas. */
export function information(id) {
  const title = Object.keys(policies)[id];
  return title
    ? /* HTML */ `
        <section class="page section info-page">
          <p class="eyebrow">INFORMAÇÕES</p>
          <h1>${title}</h1>
          <p>${policies[title]}</p>
          <a class="text-link" href="#/loja">Voltar à loja ↗</a>
        </section>
      `
    : notFound();
}
/** Alternativa para rotas desconhecidas, com acesso à página inicial. */
export function notFound() {
  return /* HTML */ `
    <section class="page section">
      <h1>Página não encontrada.</h1>
      <a class="button dark" href="#/">Voltar ao início</a>
    </section>
  `;
}
