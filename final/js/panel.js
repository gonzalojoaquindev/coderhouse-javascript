// Función para obtener las transacciones del localStorage
function getTransactions() {
    const transactions = localStorage.getItem('transactions');
    try {
        return JSON.parse(transactions) || [];
    } catch (error) {
        console.error('Error al parsear las transacciones:', error);
        return [];
    }
}

// Función para agrupar los gastos por categoría
function getIncomeByCategory(transactions) {
    const categorias = ["Educación", "Transporte", "Casa", "Salud", "Servicios"];
    const gastos = categorias.map(() => 0); // Inicializar los gastos en 0 para cada categoría

    transactions.forEach(transaction => {
        // Validar que la transacción tiene los datos necesarios
        if (transaction.type === 'gasto' && transaction.category && transaction.amount) {
            const index = categorias.indexOf(transaction.category);
            if (index !== -1) {
                gastos[index] += transaction.amount; // Sumar el monto a la categoría correspondiente
            }
        }
    });

    return { categorias, gastos };
}

// Obtener las transacciones y agrupar los gastos por categoría
const transactions = getTransactions();
const { categorias, gastos } = getIncomeByCategory(transactions);

console.log("Categorías:", categorias);
console.log("Gastos:", gastos);

console.log(transactions)

// Configuración del gráfico
const config = {
    type: "bar", // Gráfico de barras
    data: {
        labels: categorias, // Categorías como etiquetas
        datasets: [{
            label: "Gastos en CLP",
            data: gastos, // Valores para cada categoría
            backgroundColor: [
                "#cddc39  ", // Educación lime
                "#009688 ", // Transporte teal
                "#ffc107  ", // Casa amber
                "#2196f3 ", // Salud blue
                "#f44336 ", // Servicios red
            ],

        }],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Gasto: ${context.raw} CLP`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true, // El eje Y comienza en 0
            },
        },
    },
};

// Crear el gráfico
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, config);


/* const cashBalance = document.getElementById('cash-balance-card')
const creditBalance = document.getElementById('credit-balance-card')
const debitBalance = document.getElementById('debit-balance-card')

console.log(cashBalance)
cashBalance.textContent = `Saldo: -$200000`
 */


// Función para obtener las cuentas del localStorage
function getAccounts() {
    return JSON.parse(localStorage.getItem('accounts')) || [];
}

// Función para actualizar los saldos en las tarjetas
function updateBalanceCards() {
    const accounts = getAccounts();

    let cashBalance = 0;
    let creditBalance = 0;
    let debitBalance = 0;


    accounts.forEach(account => {
        if (account.name === 'efectivo') {
            cashBalance += account.balance;
        } else if (account.name === 'credito') {
            creditBalance += account.balance;
        } else if (account.name === 'debito') {
            debitBalance += account.balance;
        }
    });

    document.getElementById('cash-balance-card').textContent = `Saldo: CLP ${cashBalance}`;
    document.getElementById('credit-balance-card').textContent = `Saldo: CLP ${creditBalance}`;
    document.getElementById('debit-balance-card').textContent = `Saldo: CLP ${debitBalance}`;
}

// Llamar a la función para actualizar los saldos en las tarjetas
updateBalanceCards();
