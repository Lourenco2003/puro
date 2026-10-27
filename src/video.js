/**
 * Trailer de fundo: tenta iniciar sem som, como exigem os navegadores.
 * Respeita a preferência de movimento reduzido e permite reproduzir/pausar por teclado.
 * O poster mantém o destaque visível se o vídeo não arrancar ou não puder ser carregado.
 */
export function setupHeroVideo(app) {
  const video = app.querySelector("#hero-video");
  if (!video) return;

  const button = app.querySelector(".video-toggle");
  const status = app.querySelector("#video-status");
  video.muted = true;

  const syncButton = () => {
    button.textContent = video.paused ? "Reproduzir vídeo" : "Pausar vídeo";
  };

  const play = async () => {
    try {
      await video.play();
      status.textContent = "";
    } catch {
      // Bloqueios de reprodução automática não impedem usar o resto da página.
      if (video.isConnected) status.textContent = "Reprodução automática indisponível.";
    }
    syncButton();
  };

  button.addEventListener("click", () => {
    if (video.paused) play();
    else video.pause();
  });
  video.addEventListener("play", syncButton);
  video.addEventListener("pause", syncButton);
  video.addEventListener("error", () => {
    status.textContent = "Vídeo indisponível. A imagem de apresentação foi mantida.";
    button.hidden = true;
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) play();
  syncButton();
}
