let varukorg = JSON.parse(localStorage.getItem('varukorg')) || [];

function laggTillVarukorg(namn, pris) {
    const produktIndex = varukorg.findIndex(p => p.namn === namn);
    if (produktIndex > -1) {
        varukorg[produktIndex].antal += 1;
    } else {
        varukorg.push({namn: namn, pris: pris, antal: 1});
    }
    localStorage.setItem('varukorg', JSON.stringify(varukorg));
    alert(`${namn} har lagts till i varukorgen!`);
}

function uppdateraVarukorg() {
    const tbody = document.querySelector('.varukorg tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let total = 0;

    varukorg.forEach(p => {
        const rad = document.createElement('tr');
        rad.innerHTML = `
            <td>${p.namn}</td>
            <td>${p.pris} kr</td>
            <td>
                <button class="minus">−</button>
                ${p.antal}
                <button class="plus">+</button>
            </td>
            <td>${p.pris * p.antal} kr</td>
            <td><button class="ta-bort">Ta bort</button></td>
        `;
        tbody.appendChild(rad);

        total += p.pris * p.antal;

        rad.querySelector('.plus').addEventListener('click', () => {
            p.antal += 1;
            localStorage.setItem('varukorg', JSON.stringify(varukorg));
            uppdateraVarukorg();
        });

        rad.querySelector('.minus').addEventListener('click', () => {
            if (p.antal > 1) {
                p.antal -= 1;
            } else {
                varukorg = varukorg.filter(item => item.namn !== p.namn);
            }
            localStorage.setItem('varukorg', JSON.stringify(varukorg));
            uppdateraVarukorg();
        });

        // Ta bort-knapp
        rad.querySelector('.ta-bort').addEventListener('click', () => {
            varukorg = varukorg.filter(item => item.namn !== p.namn);
            localStorage.setItem('varukorg', JSON.stringify(varukorg));
            uppdateraVarukorg();
        });
    });

    // Uppdatera totalpris
    const totalElement = document.querySelector('.totalpris');
    if (totalElement) totalElement.textContent = `Totalt: ${total} kr`;
}


const produktKnappar = document.querySelectorAll('.produktkort button');
if (produktKnappar.length > 0) {
    produktKnappar.forEach(btn => {
        btn.addEventListener('click', () => {
            const namn = btn.dataset.namn;
            const pris = parseInt(btn.dataset.pris);
            laggTillVarukorg(namn, pris);
        });
    });
}

uppdateraVarukorg();

const rensaKnapp = document.querySelector('.rensa-varukorg');
if (rensaKnapp) {
    rensaKnapp.addEventListener('click', (e) => {
        e.preventDefault();
        varukorg = [];
        localStorage.removeItem('varukorg');
        uppdateraVarukorg();
        alert('Varukorgen har rensats!');
    });
}

const checkoutForm = document.getElementById('checkout');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Tack för ditt köp! Din order är mottagen.');
        varukorg = [];
        localStorage.removeItem('varukorg');
        window.location.href = 'index.html';
    });
}
