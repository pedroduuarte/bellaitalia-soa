document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popupAvisoLogin");
  const btnFechar = document.querySelector(".close-popup");
  const btnIrParaLogin = document.getElementById("abrirLoginPopup");

  btnFechar.onclick = () => popup.classList.add("hidden");

  btnIrParaLogin.onclick = () => {
    popup.classList.add("hidden");
    document.getElementById("loginModal").classList.remove("hidden");
  };

  document.querySelectorAll(".btn-pedir").forEach(btn => {
    const originalClick = btn.onclick;

    btn.onclick = (e) => {
      const token = localStorage.getItem("token");

      if (!token) {
        e.preventDefault();
        e.stopPropagation(); 
        popup.classList.remove("hidden");
        return;
      }

      if (typeof originalClick === "function") {
        originalClick.call(btn, e);
      }
    };
  });
});
