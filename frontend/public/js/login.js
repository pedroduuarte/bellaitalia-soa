document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado");

  const modal = document.getElementById("loginModal");
  const btnOpenLogin = document.getElementById("btnOpenLogin");
  console.log("Botão encontrado:", btnOpenLogin);
  const btnClose = document.querySelector(".close");

  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");

  const showLogin = document.getElementById("showLogin");
  const showRegister = document.getElementById("showRegister");

  // abrir modal e fechar modal
  btnOpenLogin.onclick = () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    if (token && userName) {
      logout(); // se já estiver logado, faz logout
    } else {
      modal.classList.remove("hidden");
      loginSection.classList.remove("hidden");
      registerSection.classList.add("hidden");
    }
  };

  btnClose.onclick = () => modal.classList.add("hidden");

  // alternar entre login e cadastro
  showRegister.onclick = () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
  };

  showLogin.onclick = () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  };

  // Lógica de login
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao logar");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email); 

      document.getElementById("loginMessage").textContent = "Login bem-sucedido!";

      atualizarUIposLogin(); // atualiza UI imediatamente

      setTimeout(() => {
        modal.classList.add("hidden"); // fecha modal após pequeno delay
      }, 500);

    } catch (err) {
      document.getElementById("loginMessage").textContent = err.message;
    }
  });

  // Lógica de cadastro
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
        alert("As senhas não conferem!");
        return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao cadastrar");

      document.getElementById("registerMessage").textContent = "Cadastro realizado com sucesso!";
    } catch (err) {
      document.getElementById("registerMessage").textContent = err.message;
    }
  });

  // Atualiza UI caso já esteja logado
  atualizarUIposLogin();
});

function atualizarUIposLogin() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const btnOpenLogin = document.getElementById("btnOpenLogin");

  if (token && userName) {
    btnOpenLogin.textContent = `Sair (${userName})`;
    btnOpenLogin.onclick = logout;

    document.querySelectorAll(".apenas-logado").forEach(el => {
      el.style.display = "block";
    });
  } else {
    btnOpenLogin.textContent = "Login";
    btnOpenLogin.onclick = () => {
      const modal = document.getElementById("loginModal");
      modal.classList.remove("hidden");
    };

    document.querySelectorAll(".apenas-logado").forEach(el => {
      el.style.display = "none";
    });
  }
}

function logout() {
  const email = localStorage.getItem('userEmail');

  // Remove dados do usuário e carrinho
  sessionStorage.removeItem(`carrinho_${email}`);
  sessionStorage.removeItem('carrinho_anonimo'); // ← garante que não carregue lixo depois

  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("token");

  // Limpa memória
  carrinho = [];
  atualizarContadorCarrinho();
  atualizarUIposLogin();

  setTimeout(() => {
    window.location.href = "/";
  }, 500);
}

