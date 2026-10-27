/** Arranque da aplicação: rotas locais, formulários e diálogos do protótipo. */
import "./style.css";
import { setupNavigation, updateHeader } from "./navigation.js";
import { setupHeroVideo } from "./video.js";
import { product } from "./data.js";
import { addItem, count, setQuantity, removeItem } from "./cart.js";
import {
  header,
  footer,
  home,
  shop,
  productPage,
  cartPage,
  about,
  information,
  notFound,
} from "./sections.js";
const app = document.querySelector("#app");
const arrow =
  '<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M5 5h14v14"/></svg>';
let returnFocus;
/** Mensagem modal com Escape e reposição do foco no elemento de origem. */
function dialog(title, text, added = false) {
  returnFocus = document.activeElement;
  const el = document.createElement("dialog");
  el.className = "notice-dialog";
  el.innerHTML = /* HTML */ `
    <button class="dialog-close plain" aria-label="Fechar mensagem">×</button>
    <p class="eyebrow">${added ? "NO TEU CARRINHO" : "DEMONSTRAÇÃO"}</p>
    <h2>${title}</h2>
    <p>${text}</p>
    ${added
      ? '<a class="button dark" href="#/carrinho">Ver carrinho ↗</a>'
      : '<button class="button dark" data-close>Continuar a explorar</button>'}
  `;
  el.innerHTML = el.innerHTML.replaceAll("↗", arrow);
  el.setAttribute("aria-label", title);
  document.body.append(el);
  el.addEventListener("close", () => {
    el.remove();
    returnFocus?.focus();
  });
  el.querySelector(".dialog-close").onclick = () => el.close();
  el.querySelector("[data-close]")?.addEventListener("click", () => el.close());
  el.querySelector("a")?.addEventListener("click", () => el.close());
  el.showModal();
}
/** Reconstrói a página pedida sem recarregar o navegador. */
function render(focus = false) {
  document.querySelector("dialog")?.close();
  const path = location.hash.slice(1) || "/";
  let page = notFound(),
    title = "Página não encontrada";
  if (path === "/") {
    page = home();
    title = "À tua maneira.";
  } else if (path === "/loja") {
    page = shop();
    title = "A coleção";
  } else if (path === `/produto/${product.slug}`) {
    page = productPage();
    title = product.name;
  } else if (path === "/carrinho") {
    page = cartPage();
    title = "O teu carrinho";
  } else if (path === "/sobre") {
    page = about();
    title = "A PURO";
  } else if (/^\/informacao\/[0-3]$/.test(path)) {
    page = information(Number(path.split("/").pop()));
    title = "Informações";
  }
  document.body.classList.toggle("home-page", path === "/");
  app.innerHTML =
    header() +
    `<main id="main" tabindex="-1">${page}</main>` +
    footer() +
    `<div id="status" class="sr-only" aria-live="polite"></div>`;
  app.innerHTML = app.innerHTML.replaceAll("↗", arrow);
  document.title = `${title} — PURO`;
  app
    .querySelectorAll("[name=size]")
    .forEach((x) =>
      x.addEventListener(
        "change",
        () => (app.querySelector("#size-error").textContent = ""),
      ),
    );
  setupNavigation(app);
  setupHeroVideo(app);
  // Galeria: troca a fotografia e atualiza o estado acessível das miniaturas.
  app.querySelectorAll("[data-image]").forEach(
    (b) =>
      (b.onclick = () => {
        const im = product.images[Number(b.dataset.image)];
        const target = app.querySelector("#product-image");
        target.src = im.src;
        target.alt = im.alt;
        app
          .querySelectorAll("[data-image]")
          .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      }),
  );
  // Produto: valida a opção de teste e a quantidade antes de alterar o carrinho.
  app.querySelector("#product-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const selected = f.querySelector("[name=size]:checked");
    const error = f.querySelector("#size-error");
    if (!selected) {
      error.textContent = "Seleciona uma opção de tamanho de teste antes de adicionar.";
      f.querySelector("[name=size]").focus();
      return;
    }
    error.textContent = "";
    const qty = f.querySelector("#quantity");
    if (!qty.checkValidity()) {
      f.querySelector("#quantity-error").textContent =
        "Introduz uma quantidade inteira entre 1 e 99.";
      qty.focus();
      return;
    }
    f.querySelector("#quantity-error").textContent = "";
    addItem(selected.value, Number(qty.value));
    app.querySelector(".cart-count").textContent = count();
    dialog(
      "Adicionado ao carrinho.",
      `${product.name} · ${selected.nextElementSibling.textContent} · Quantidade: ${qty.value}. Preço e tamanho real a definir.`,
      true,
    );
  });
  // Carrinho: operações locais, sem pagamentos ou chamadas à Shopify.
  app.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        removeItem(b.dataset.remove);
        render();
        app.querySelector("#main").focus();
        app.querySelector("#status").textContent = "Artigo removido do carrinho.";
      }),
  );
  app.querySelectorAll("[data-quantity]").forEach((input) =>
    input.addEventListener("change", () => {
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
      setQuantity(input.dataset.quantity, Number(input.value));
      render();
      app.querySelector(`#${input.id}`)?.focus();
    }),
  );
  app
    .querySelector("#checkout")
    ?.addEventListener("click", () =>
      dialog(
        "Isto é apenas uma demonstração.",
        "Não foi criada nenhuma encomenda nem será cobrado qualquer valor. O checkout, os pagamentos e os envios serão configurados na futura loja Shopify.",
      ),
    );
  if (focus) {
    window.scrollTo(0, 0);
    app.querySelector("#main").focus({ preventScroll: true });
  }
  updateHeader();
}
window.addEventListener("hashchange", () => render(true));
render();
