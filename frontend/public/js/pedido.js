let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Carrinho carregado:', carrinho);
    atualizarContadorCarrinho();
    atualizarTotais();
    exibirItensPedido();
    try {
        const response = await fetch('/api/cardapio');
        if (!response.ok) throw new Error('Erro ao obter cardápio');

        const { data: cardapio } = await response.json();
        const pizzasTradicionais = cardapio.filter(p => p.tipo === "PizzaTradicional");
        const pizzasDoces = cardapio.filter(p => p.tipo === "PizzaDoce");

        renderizarCardapio("tradicionais", pizzasTradicionais);
        renderizarCardapio("doces", pizzasDoces);
        adicionarEventosPedido();
        atualizarContadorCarrinho();

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("menu-container").innerHTML = `
      <div class="error-message">Erro ao carregar o cardápio</div>
    `;
    }

    // Event Listeners
    document.getElementById('carrinho-icon')?.addEventListener('click', mostrarModalCarrinho);
    document.getElementById('fechar-modal')?.addEventListener('click', esconderModalCarrinho);
    document.getElementById('finalizar-pedido-botao')?.addEventListener('click', finalizarPedido);
    document.getElementById('finalizar-pedido')?.addEventListener('click', irParaPaginaPedido);
});

// Funções auxiliares
function renderizarCardapio(secaoId, pizzas) {
    const container = document.getElementById(secaoId);
    if (!container) return;

    container.innerHTML = pizzas.map(pizza => `
    <div class="pizza-card" data-id="${pizza.id}">
      <h3>${pizza.titulo}</h3>
      <p class="descricao">${pizza.descricao}</p>
      <div class="pizza-footer">
        <span class="preco">R$ ${pizza.valor.toFixed(2)}</span>
        <button class="btn-pedir" data-id="${pizza.id}">Pedir</button>
      </div>
    </div>
  `).join('');
}

async function buscarPizzaPorId(id) {
    try {
        const response = await fetch(`/api/cardapio/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar pizza:', error);
        return null;
    }
}

function adicionarAoCarrinho(pizzaId) {
    buscarPizzaPorId(pizzaId).then(pizza => {
        if (pizza) {
            carrinho.push({
                id: pizza.id,
                titulo: pizza.titulo,
                descricao: pizza.descricao,
                valor: parseFloat(pizza.valor)
            });
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarContadorCarrinho();
            atualizarTotais();
            alert(`Pizza "${pizza.titulo}" adicionada ao carrinho!`);
        }
    });
}

function atualizarContadorCarrinho() {
    const countElement = document.getElementById('carrinho-count');
    if (countElement) {
        countElement.textContent = carrinho.length;
    }
}

function mostrarModalCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    if (lista) {
        lista.innerHTML = carrinho.map(item => `
      <li>${item.titulo} - R$ ${item.valor.toFixed(2)}</li>
    `).join('');
    }
    document.getElementById('carrinho-modal').classList.add('show');
}

function esconderModalCarrinho() {
    document.getElementById('carrinho-modal').classList.remove('show');
}

function irParaPaginaPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarTotais();
    window.location.href = '/pedido';
}

async function finalizarPedido() {
    try {
       const endereco = document.getElementById('endereco').value;
       const pagamento = document.querySelector('input[name="pagamento"]:checked')?.value;
       const customerName = document.getElementById('name').value;
       const total = carrinho.reduce((acc, item) => acc + item.valor, 0) + 5.00;

       const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }, 
        body: JSON.stringify({
            customerName,
            itens: carrinho,
            total,
            endereco,
            pagamento
        })
    });

    if (!response.ok) throw new Error('Erro ao finalizar pedido');

    localStorage.removeItem('carrinho');
    window.location.href = '/confirmacao';

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao finalizar pedido: ' + error.message);
    }
}

function exibirItensPedido() {
    const itensContainer = document.getElementById('itens-pedido');
    if (!itensContainer) return;

    if (carrinho.length === 0) {
        itensContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
        return;
    }

    itensContainer.innerHTML = carrinho.map(item => `
        <div class="item-pedido">
            <div class="item-info">
                <h4>${item.titulo}</h4>
                <p class="item-descricao">${item.descricao}</p>
            </div>
            <div class="item-preco">R$ ${item.valor.toFixed(2)}</div>
        </div>
    `).join('');
}

function calcularTotalCarrinho() {
  const subtotal = carrinho.reduce((total, item) => total + item.valor, 0);
  const taxaEntrega = 5.00;
  return subtotal + taxaEntrega;
}

function atualizarTotais() {
  const subtotalElement = document.getElementById('subtotal');
  const taxaElement = document.getElementById('taxa-entrega');
  const totalElement = document.getElementById('total');
  
  if (!subtotalElement || !taxaElement || !totalElement) return;

  const subtotal = carrinho.reduce((total, item) => total + item.valor, 0);
  const taxaEntrega = 5.00;
  const total = subtotal + taxaEntrega;

  subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
  taxaElement.textContent = `R$ ${taxaEntrega.toFixed(2)}`;
  totalElement.textContent = `R$ ${total.toFixed(2)}`;
}