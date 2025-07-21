document.addEventListener('DOMContentLoaded', () => {

    const email = localStorage.getItem('userEmail') || 'anonimo';
    const carrinhoKey = `carrinho_${email}`;
    const chavePixElement = document.getElementById('chave-pix');
    const btnCopiarPix = document.getElementById('btn-copiar-pix');
    const btnJaPaguei = document.getElementById('btnJaPaguei');
    
    const pedidoPendente = JSON.parse(sessionStorage.getItem('pedidoPendente'));
    
    if (!pedidoPendente) {
        alert('Nenhum pedido PIX pendente encontrado. Redirecionando...');
        window.location.href = '/pedido';
        return;
    }

    btnCopiarPix.addEventListener('click', () => {
        const chavePix = chavePixElement.textContent;
        
        navigator.clipboard.writeText(chavePix)
            .then(() => {
                const originalText = btnCopiarPix.textContent;
                btnCopiarPix.textContent = 'Chave copiada!';
                btnCopiarPix.style.backgroundColor = '#4CAF50';
                
                setTimeout(() => {
                    btnCopiarPix.textContent = originalText;
                    btnCopiarPix.style.backgroundColor = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Falha ao copiar: ', err);
                alert('Não foi possível copiar a chave. Tente novamente.');
            });
    });

    btnJaPaguei.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = '/';
                return;
            }

            const pedidoPendente = JSON.parse(sessionStorage.getItem('pedidoPendente'));
            if (!pedidoPendente) {
                throw new Error('Dados do pedido não encontrados');
            }

            const { customerName, itens, total, endereco, paymentMethod } = pedidoPendente;
            const orderId = await criarPedidoCompleto(token, customerName, itens, total, paymentMethod, endereco);
            
            // Limpe os dados temporários
            sessionStorage.removeItem('pedidoPendente');
            sessionStorage.removeItem(carrinhoKey);
            
            // Redirecione com o orderId na URL
            window.location.href = `/confirmacao?pedido=${orderId}`;

        } catch (error) {
            console.error('Erro ao confirmar pagamento:', error);
            alert('Erro ao confirmar pagamento: ' + error.message);
        }
    });
});

async function criarPedidoCompleto(token, customerName, itens, total, paymentMethod, endereco) {
    //  criar pedido
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

    //  criar pagamento
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

    //  criar entrega
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