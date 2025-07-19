document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/cardapio', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error('Erro ao obter cardápio');
        }
    const { data: cardapio } = await response.json();

    // filtrar por categorias
    const pizzasTradicionais = cardapio.filter(p => p.tipo === "PizzaTradicional");
    const pizzasDoces = cardapio.filter(p => p.tipo === "PizzaDoce");

    renderizarCardapio("tradicionais", pizzasTradicionais);
    renderizarCardapio("doces", pizzasDoces);

    adicionarEventosPedido();

  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("menu-container").innerHTML = `
      <div class="error-message">
        Erro ao carregar o cardápio. Tente recarregar a página.
      </div>
    `;
  }
});

// função para renderizar cada seção do cardápio
function renderizarCardapio(secaoId, pizzas) {
  const container = document.getElementById(secaoId);
  if (!container) return;

  container.innerHTML = pizzas.map(pizza => `
    <div class="pizza-card" data-id="${pizza.id}">
      <h3>${pizza.titulo}</h3>
      <p class="descricao">${pizza.descricao}</p>
      <div class="pizza-footer">
        <span class="preco">R$ ${parseFloat(pizza.valor).toFixed(2)}</span>
        <button class="btn-pedir" data-id="${pizza.id}">Pedir</button>
      </div>
    </div>
  `).join('');
}

function adicionarEventosPedido() {
  document.querySelectorAll('.btn-pedir').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pizzaId = e.target.getAttribute('data-id');
      adicionarAoCarrinho(pizzaId);
    });
  });
}

function adicionarAoCarrinho(pizzaId) {
  console.log(`Pizza ${pizzaId} adicionada ao carrinho`);
  alert(`Pizza adicionada ao carrinho! ID: ${pizzaId}`);
}