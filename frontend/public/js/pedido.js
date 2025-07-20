document.addEventListener("DOMContentLoaaded", async () => {
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    const usuario = JSON.parse(localStorage.getItem('userName')) || {};

    exibirItensPedidos(carrinho);
    calcularTotal(carrinho);

    document.getElementById('finalizar-pedido').addEventListener('click', async () => {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const endereco = document.getElementById('endereco').value;
        const metodoPagamento = document.querySelector('input[name="pagamento"]:checked').value;

        if (!endereco) {
            alert('Por favor, informe o endereço de entrega.');
            return;
        }

        try {
            const pedidoResponse = await criarPedido(carrinho);

            const entregaResponse = await criarEntrega({
                pedidoId: pedidoResponse.id,
                rua: documento.getElementById('rua').value,
                bairro: documento.getElementById('bairro').value,
                numero: documento.getElementById('numero').value,
            });

            const pagamentoResponse = await processarPagamento({
                pedidoId: pedidoResponse.id,
                metodo: metodoPagamento,
                valor: calcularTotal(carrinho, true)
            });

            localStorage.removeItem('carrinho');
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            alert('Erro ao finalizar pedido. Tente novamente.');
        }
    });
});

function exibirItensPedidos(itens) {
    const container = document.getElementById('itens-pedido');
    container.innerHTML = itens.map(item => `
        <div class="item-pedido">
            <div class="item-info">
                <h4>${item.titulo}</h4>
                <p>${item.descricao}</p>
            </div>
            <div class="item-preco">R$ ${item.valor.toFixed(2)}</div>
        </div>
    `).join('');
}

function calcularTotal(itens, formatar = false) {
    const subtotal = itens.reduce((total, item) => total + item.valor, 0);
    const taxaEntrega = 5.00;
    const total = subtotal + taxaEntrega;

    document.getElementById()
}