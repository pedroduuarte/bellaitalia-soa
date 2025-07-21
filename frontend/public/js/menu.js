const email = localStorage.getItem('userEmail') || 'anonimo';
const carrinhoKey = `carrinho_${email}`;
let carrinho = JSON.parse(sessionStorage.getItem(carrinhoKey)) || [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/cardapio', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
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
    renderizarCarrosselPizzas(pizzasTradicionais);


    adicionarEventosPedido();
    atualizarContadorCarrinho();

  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("menu-container").innerHTML = `
      <div class="error-message">
        Erro ao carregar o cardápio. Tente recarregar a página.
      </div>
    `;
  }

  document.getElementById('carrinho-icon')?.addEventListener('click', mostrarModalCarrinho);
  document.getElementById('fechar-modal')?.addEventListener('click', esconderModalCarrinho);
  document.getElementById('finalizar-pedido')?.addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    window.location.href = '/pedido';
  });
});

// função para renderizar cada seção do cardápio
function renderizarCardapio(secaoId, pizzas) {
  const container = document.getElementById(secaoId);
  if (!container) return;

  container.innerHTML = pizzas.map(pizza => `
    <div class="pizza-card" data-id="${pizza.id}">
      <img src="images/pizzas/${pizza.id}.jpg" alt="${pizza.titulo}" class="pizza-imagem"/>
      <h3>${pizza.titulo}</h3>
      <p class="descricao">${pizza.descricao}</p>
      <div class="pizza-footer">
        <span class="preco">R$ ${parseFloat(pizza.valor).toFixed(2)}</span>
        <button class="btn-pedir" data-id="${pizza.id}">Pedir</button>
      </div>
    </div>
  `).join('');
}

function renderizarCarrosselPizzas(pizzas) {
  const container = document.getElementById('carousel-items');
  if (!container) return;

  // Agrupa as pizzas em blocos de 3
  const grupos = [];
  for (let i = 0; i < pizzas.length; i += 3) {
    grupos.push(pizzas.slice(i, i + 3));
  }

  container.innerHTML = grupos.map((grupo, index) => `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="d-flex justify-content-center gap-4 flex-wrap">
        ${grupo.map(pizza => `
          <div class="pizza-card" data-id="${pizza.id}">
            <img src="images/pizzas/${pizza.id}.jpg" alt="${pizza.titulo}" class="pizza-imagem" />
            <h3>${pizza.titulo}</h3>
            <p class="descricao">${pizza.descricao}</p>
            <div class="pizza-footer">
              <span class="preco">R$ ${parseFloat(pizza.valor).toFixed(2)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  adicionarEventosPedido();
}


function adicionarEventosPedido() {
  document.querySelectorAll('.btn-pedir').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      if (!token) {
        // Mostrar o popup avisando que precisa estar logado
        const popup = document.getElementById('popupAvisoLogin');
        popup.classList.remove('hidden');

        // Interrompe aqui para não adicionar ao carrinho
        return;
      }

      // Se estiver logado, adiciona ao carrinho
      const pizzaId = e.target.getAttribute('data-id');
      adicionarAoCarrinho(pizzaId);
    });
  });
}



function adicionarAoCarrinho(pizzaId) {
  const itemExistente = carrinho.find(item => item.id === pizzaId);
  if (itemExistente) {
    if(confirm(`Pizza já está no carrinho. Deseja adicionar mais uma?`)) {
      buscarPizzaPorId(pizzaId).then(pizza => {
        if (pizza) {
          carrinho.push({
            id: pizza.id,
            titulo: pizza.titulo,
            descricao: pizza.descricao,
            valor: parseFloat(pizza.valor)
          });
          atualizarContadorCarrinho();
          console.log('Carrinho carregado:', carrinho);
        }
      });
    }
  } else {
      const pizza = buscarPizzaPorId(pizzaId);
      if (pizza) {
        carrinho.push(pizza);
        atualizarContadorCarrinho();
        sessionStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
        alert(`Pizza "${pizza.titulo}" adicionada ao carrinho!`);
        console.log('Carrinho carregado:', carrinho);
    }
  }
}

function buscarPizzaPorId(id) {
  const todas = [...document.querySelectorAll('.pizza-card')];
  const card = todas.find(c => c.getAttribute('data-id') === id);
  if (!card) return null;
  return {
    id,
    titulo: card.querySelector('h3').textContent,
    descricao: card.querySelector('.descricao').textContent,
    valor: parseFloat(card.querySelector('.preco').textContent.replace('R$ ', ''))
  };
}

function atualizarContadorCarrinho() {
  document.getElementById('carrinho-count').textContent = carrinho.length;
}

function mostrarModalCarrinho() {
  const lista = document.getElementById('carrinho-itens');
  lista.innerHTML = carrinho.map((item, index) => `
    <li data-index="${index}">
      ${item.titulo} - R$ ${item.valor.toFixed(2)}
      <button class="remover-item" data-index="${index}" title="Remover item">
        <img src="/images/trash-icon.png" alt="Remover" class="icone-lixeira" />
      </button>
    </li>
  `).join('');

  document.querySelectorAll('.remover-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      removerItemDoCarrinho(index);
    });
  });
  document.getElementById('carrinho-modal').classList.add('show');
}

function removerItemDoCarrinho(index) {
  carrinho.splice(index, 1);
  sessionStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
  atualizarContadorCarrinho();
  mostrarModalCarrinho(); 
}

function esconderModalCarrinho() {
  document.getElementById('carrinho-modal').classList.remove('show');
}

function irParaPaginaPedido() {
  sessionStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
  window.location.href = '/pedido';
}
