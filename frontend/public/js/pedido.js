const email = localStorage.getItem('userEmail') || 'anonimo';
const carrinhoKey = `carrinho_${email}`;
let carrinho = JSON.parse(sessionStorage.getItem(carrinhoKey)) || [];

document.addEventListener('DOMContentLoaded', async () => {
    atualizarContadorCarrinho();
    atualizarTotais();
    exibirItensPedido();
    console.log('Carrinho carregado:', carrinho);



    const radios = document.querySelectorAll('input[name="pagamento"]');

    radios.forEach((radio) => {
        radio.addEventListener('change', () => {
            document.getElementById('credit-card-fields').style.display = 'none';
            document.getElementById('pix-fields').style.display = 'none';
            document.getElementById('cash-fields').style.display = 'none';

            const selectedValue = document.querySelector('input[name="pagamento"]:checked')?.value;

            if (selectedValue === 'credit_card') {
                document.getElementById('credit-card-fields').style.display = 'block';
                console.log('Exibindo campos de cartão de crédito');
            } else if (selectedValue === 'pix') {
                document.getElementById('pix-fields').style.display = 'block';
                console.log('Exibindo campos de PIX');
            } else if (selectedValue === 'cash') {
                document.getElementById('cash-fields').style.display = 'block';
                console.log('Exibindo campos de dinheiro');
            }
        });
    });
    console.log('Elemento do botão:', document.getElementById('finalizar-pedido-botao'));
    console.log('Carrinho antes de finalizar:', carrinho);

    // Event Listeners
    document.getElementById('carrinho-icon')?.addEventListener('click', mostrarModalCarrinho);
    document.getElementById('fechar-modal')?.addEventListener('click', esconderModalCarrinho);
    document.getElementById('finalizar-pedido-botao')?.addEventListener('click', () => {
        const selectedValue = document.querySelector('input[name="pagamento"]:checked')?.value;

        const rua = document.getElementById('rua')?.value.trim();
        const bairro = document.getElementById('bairro')?.value.trim();
        const numero = document.getElementById('numero')?.value.trim();

        const endereco = { rua, bairro, numero };

        if (!selectedValue || !rua || !bairro || !numero) {
            alert('Preencha todos os campos de entrega e selecione uma forma de pagamento.');
            return;
        }

        finalizarPedidoCompleto(selectedValue, endereco);
    });
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
            sessionStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
            sessionStorage.removeItem(carrinhoKey);
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
    sessionStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
    sessionStorage.removeItem(carrinhoKey);
    atualizarTotais();
    window.location.href = '/pedido';
}

function exibirItensPedido() {
    const itensContainer = document.getElementById('itens-pedido');
    if (!itensContainer) return;

    if (carrinho.length === 0) {
        itensContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
        return;
    }

    itensContainer.innerHTML = carrinho.map((item, index) => `
        <div class="item-pedido" data-index="${index}">
            <div class="item-info">
                <h4>${item.titulo}</h4>
                <p class="item-descricao">${item.descricao}</p>
            </div>
                <div class="item-preco">R$ ${item.valor.toFixed(2)}</div>
                <button class="btn-remover-item" data-index="${index}" title="Remover item"><img src="/images/trash-icon.png" alt="Remover" class="icone-lixeira" /></button>
            </div>
    `).join('');

    document.querySelectorAll('.btn-remover-item').forEach(btn => {
        btn.addEventListener('click', removerItemDoCarrinho);
    });
}

function removerItemDoCarrinho(event) {
    const index = event.currentTarget.dataset.index;
    if (index !== undefined) {
        carrinho.splice(index, 1);
        sessionStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
        atualizarContadorCarrinho();
        exibirItensPedido(); 
        atualizarTotais();
    }
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

async function finalizarPedidoCompleto(paymentMethod, endereco) {
    try {
        const token = localStorage.getItem('token');
        const customerName = localStorage.getItem('userName') || 'Cliente';
        const total = carrinho.reduce((acc, item) => acc + item.valor, 0) + 5.00;

        if (paymentMethod === 'pix') {
            const pedidoTemporario = {
                customerName,
                itens: [...carrinho],
                total,
                endereco,
                paymentMethod,
                timestamp: new Date().getTime()
            };
            
            sessionStorage.setItem('pedidoPendente', JSON.stringify(pedidoTemporario));
            window.location.href = '/confirmacao-pix';
            return;
        }

        const orderId = await criarPedidoCompleto(token, customerName, carrinho, total, paymentMethod, endereco);
        
        sessionStorage.removeItem(carrinhoKey);
        window.location.href = `/confirmacao?pedido=${orderId}`;

    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        alert('Erro ao finalizar pedido: ' + error.message);
    }
}

async function criarPedidoCompleto(token, customerName, itens, total, paymentMethod, endereco) {
    // 1. Criar pedido
    const pedidoResponse = await fetch('http://localhost:3003/api/order/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            customerName,
            itens,
            total
        })
    });

    if (!pedidoResponse.ok) {
        const error = await pedidoResponse.json().catch(() => ({}));
        throw new Error(error.message || 'Erro ao criar pedido');
    }

    const pedidoData = await pedidoResponse.json();
    const orderId = pedidoData.orderId;

    if (!orderId) {
        throw new Error('ID do pedido não foi retornado pela API');
    }

    // 2. Criar pagamento
    const pagamentoResponse = await fetch('http://localhost:3005/api/payment/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            orderId,
            paymentMethod,
            amount: total
        })
    });

    if (!pagamentoResponse.ok) {
        const error = await pagamentoResponse.json().catch(() => ({}));
        throw new Error(error.message || 'Falha no processamento do pagamento');
    }

    // 3. Criar entrega
    const deliveryResponse = await fetch('http://localhost:3004/api/delivery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: orderId,
            rua: endereco.rua,
            bairro: endereco.bairro,
            numero: endereco.numero,
            taxaEntrega: 5.00,
            tempoEntrega: '30 minutos',
            status: 'pendente'
        })
    });

    if (!deliveryResponse.ok) {
        const error = await deliveryResponse.json().catch(() => ({}));
        throw new Error(error.message || 'Falha ao criar entrega');
    }

    return orderId;
}