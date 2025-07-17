document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/cardapio');
        const result = await response.json();
        const items = result.data;
        console.log('Resposta do fetch:', items);
        const container = document.getElementById('menu-container');

        items.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('pizza-item');
            div.innerHTML = `
                <h3>${item.titulo}</h3>
                <p>${item.tipo}</p>
                <p>${item.descricao}</p>
                <p>Preço: R$ ${item.valor}</p>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error('Erro ao carregar menu:', err);
    }
});