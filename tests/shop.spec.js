import { test, expect } from "@playwright/test";
test("percurso completo da loja e carrinho", async ({ page }, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "À tua maneira." })).toBeVisible();
  await page
    .locator("img")
    .evaluateAll((images) => images.forEach((i) => (i.loading = "eager")));
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) => images.every((i) => i.complete && i.naturalWidth > 0)),
    )
    .toBeTruthy();
  await page.screenshot({
    path: `test-results/inicio-${info.project.name}.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.getByRole("link", { name: "Descobrir a coleção" }).click();
  await expect(page.getByRole("heading", { name: "A coleção." })).toBeVisible();
  await page.locator(".product-card").click();
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Seleciona uma opção" }),
  ).toBeVisible();
  await expect(page.locator("[name=size]").first()).toBeFocused();
  await page.getByLabel("Opção de teste 1", { exact: true }).check();
  await page.getByLabel("Quantidade", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Ver imagem 2:", exact: false }).click();
  await expect(page.locator("#product-image")).toHaveAttribute(
    "src",
    "/images/puro-16.webp",
  );
  await page.screenshot({
    path: `test-results/produto-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await expect(page.getByRole("dialog")).toContainText("Adicionado ao carrinho.");
  await page.getByRole("dialog").getByRole("link", { name: "Ver carrinho" }).click();
  await expect(page.locator("[data-quantity]")).toHaveValue("2");
  await page.locator("[data-quantity]").fill("3");
  await page.locator("[data-quantity]").press("Tab");
  await expect(page.locator(".cart-count")).toHaveText("3");
  await expect(page.locator(".summary strong")).toHaveText("A definir");
  await page.reload();
  await expect(page.locator("[data-quantity]")).toHaveValue("3");
  await page.getByRole("button", { name: "Finalizar compra" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Não foi criada nenhuma encomenda",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Finalizar compra" })).toBeFocused();
  await page.getByRole("button", { name: "Remover", exact: true }).click();
  await expect(
    page.getByText("O teu carrinho está vazio.", { exact: false }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test("menu, marca, informações e imagens válidas", async ({ page }, info) => {
  await page.goto("/");
  if (info.project.name === "telemovel") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page
      .locator("#mobile-menu")
      .getByRole("link", { name: "A PURO", exact: true })
      .click();
  } else
    await page.locator(".desktop-nav").getByRole("link", { name: "A PURO" }).click();
  await expect(
    page.getByRole("heading", { name: "Um espaço para seres tu." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Envios", exact: true }).click();
  await expect(
    page.getByText("Condições, destinos, prazos e custos de envio: a definir."),
  ).toBeVisible();
  await page.goto("/");
  await page.locator(".brand img").evaluate((im) => im.decode());
  await page
    .locator("img")
    .evaluateAll((images) => images.forEach((i) => (i.loading = "eager")));
  const broken = await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(images.map((i) => i.decode().catch(() => {})));
    return images.filter((i) => !i.naturalWidth).map((i) => i.src);
  });
  expect(broken).toEqual([]);
});
// Cálculo puro em Node: evita instâncias duplicadas de módulos durante HMR do Vite.
test("subtotal usa cêntimos quando existe preço confirmado", async () => {
  const { product } = await import("../src/data.js");
  const c = await import("../src/cart.js");
  const originalPrice = product.priceCents;
  try {
    c.saveCart([]);
    expect(c.subtotal()).toBe(0);
    c.addItem("teste-1", 2);
    expect(c.subtotal()).toBeNull();
    // Valor sintético só dentro do teste; não é um preço publicado.
    product.priceCents = 1234;
    expect(c.subtotal()).toBe(2468);
  } finally {
    product.priceCents = originalPrice;
    c.saveCart([]);
  }
});

// O trailer é testado com reprodução real, não apenas pela presença do elemento.
test("trailer a ecrã inteiro e cabeçalho que muda ao fazer scroll", async ({
  page,
}, info) => {
  await page.goto("/");
  const video = page.locator("#hero-video");
  const shell = page.locator(".header-shell");
  const header = page.locator(".header");
  await expect(shell).toHaveClass(/is-transparent/);
  const dimensions = await page.locator(".hero").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
    };
  });
  expect(dimensions.top).toBe(0);
  expect(dimensions.left).toBe(0);
  expect(dimensions.width).toBe(dimensions.viewportWidth);
  expect(Math.abs(dimensions.height - dimensions.viewportHeight)).toBeLessThanOrEqual(
    1,
  );
  await expect
    .poll(() => video.evaluate((v) => v.readyState))
    .toBeGreaterThanOrEqual(3);
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(false);
  await expect.poll(() => video.evaluate((v) => v.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((v) => v.muted)).toBe(true);
  const pause = page.getByRole("button", { name: "Pausar vídeo", exact: true });
  await pause.focus();
  await page.keyboard.press("Space");
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  await expect(
    page.getByRole("button", { name: "Reproduzir vídeo", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Space");
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(false);
  await page.screenshot({ path: `test-results/trailer-${info.project.name}.png` });
  await page.evaluate(() => window.scrollTo(0, 160));
  await expect(shell).not.toHaveClass(/is-transparent/);
  await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
  expect(
    await header.evaluate((el) => Math.round(el.getBoundingClientRect().top)),
  ).toBe(0);
  await page.screenshot({
    path: `test-results/header-scroll-${info.project.name}.png`,
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(shell).toHaveClass(/is-transparent/);
  if (info.project.name === "telemovel") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(shell).not.toHaveClass(/is-transparent/);
    await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await page.keyboard.press("Escape");
    await expect(shell).toHaveClass(/is-transparent/);
  }
  await page.getByRole("link", { name: "Descobrir a coleção" }).click();
  await expect(shell).not.toHaveClass(/is-transparent/);
  await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.locator(".brand").click();
  await expect(shell).toHaveClass(/is-transparent/);
});

test("movimento reduzido mantém o trailer pausado até escolha do utilizador", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const video = page.locator("#hero-video");
  await expect(
    page.getByRole("button", { name: "Reproduzir vídeo", exact: true }),
  ).toBeVisible();
  expect(await video.evaluate((v) => v.paused)).toBe(true);
  await page.getByRole("button", { name: "Reproduzir vídeo", exact: true }).click();
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(false);
});

test("bloqueio de reprodução automática permite iniciar manualmente", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    let first = true;
    HTMLMediaElement.prototype.play = function () {
      if (first) {
        first = false;
        return Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
      }
      return original.call(this);
    };
  });
  await page.goto("/");
  await expect(
    page.getByRole("status").filter({ hasText: "Reprodução automática indisponível." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reproduzir vídeo", exact: true }).click();
  await expect
    .poll(() => page.locator("#hero-video").evaluate((v) => v.paused))
    .toBe(false);
});
