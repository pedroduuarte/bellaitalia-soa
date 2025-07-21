document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('pedido');
    
    if (!pedidoId) {
        console.error('ID do pedido não encontrado');
        document.getElementById('pedido-id').textContent = 'N/A';
        return;
    }

    document.getElementById('pedido-id').textContent = pedidoId;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3003/api/order/${pedidoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar pedido');
        }

        const pedido = await response.json();
        console.log('Dados do pedido:', pedido); 

        const itensContainer = document.getElementById('itens-pedido');
        if (pedido.items && pedido.items.length > 0) {
            itensContainer.innerHTML = pedido.items.map(item => `
                <div class="item-pedido">
                    <div class="item-info">
                        <h4>${item.titulo}</h4>
                        <p class="item-descricao">${item.descricao}</p>
                    </div>
                    <div class="item-preco">R$ ${item.valor.toFixed(2)}</div>
                </div>
            `).join('');
        }

        document.getElementById('tempo-entrega').textContent = '30-40 minutos';
        document.getElementById('total-pedido').textContent = `R$ ${pedido.total.toFixed(2)}`;

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('itens-pedido').innerHTML = `
            <p class="erro">Não foi possível carregar os itens do pedido</p>
        `;
    }
});