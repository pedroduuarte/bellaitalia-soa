document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popupAvisoLogin");
  const btnFechar = document.querySelector(".close-popup");
  const btnIrParaLogin = document.getElementById("abrirLoginPopup");

  // Fechar popup
  btnFechar.onclick = () => popup.classList.add("hidden");

  // Ir para login
  btnIrParaLogin.onclick = () => {
    popup.classList.add("hidden");
    document.getElementById("loginModal").classList.remove("hidden");
  };

  // Substituir todos os botões .btn-pedir por wrappers com verificação
  document.querySelectorAll(".btn-pedir").forEach(btn => {
    const originalClick = btn.onclick;

    btn.onclick = (e) => {
      const token = localStorage.getItem("token");

      if (!token) {
        e.preventDefault();
        e.stopPropagation(); // <- ESSENCIAL: impede outras funções de rodarem
        popup.classList.remove("hidden");
        return;
      }

      // Se o botão tinha uma função original, executa
      if (typeof originalClick === "function") {
        originalClick.call(btn, e);
      }
    };
  });
});
