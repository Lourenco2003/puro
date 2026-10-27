/**
 * Comportamento do cabeçalho fixo em todas as páginas.
 * Apenas no topo da página inicial fica transparente; o menu aberto tem fundo branco.
 * O listener de scroll é registado uma só vez, mesmo ao navegar entre páginas.
 */
export function updateHeader() {
  const shell = document.querySelector(".header-shell");
  const menu = document.querySelector("#mobile-menu");
  const atHome = (location.hash.slice(1) || "/") === "/";
  shell?.classList.toggle(
    "is-transparent",
    atHome && window.scrollY < 16 && !!menu?.hidden,
  );
}

window.addEventListener("scroll", updateHeader, { passive: true });

/** Liga o menu móvel ao botão, mantendo os atributos acessíveis sincronizados. */
export function setupNavigation(app) {
  const button = app.querySelector(".menu-button");
  const menu = app.querySelector("#mobile-menu");

  function setOpen(open) {
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    updateHeader();
  }

  button.addEventListener("click", () => setOpen(menu.hidden));
  app.onkeydown = (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setOpen(false);
      button.focus();
    }
  };
  updateHeader();
}
