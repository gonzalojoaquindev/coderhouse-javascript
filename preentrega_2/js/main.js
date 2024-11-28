import { Category } from "./controllers/categoriesController.js";
import { Transaction } from "./controllers/transactionController.js";
import { Account } from "./controllers/accountController.js";
//import { categories, accounts, transactions } from "../data/data.js";

//crear data de prueba
Category.addCategory('casa', 'orange', 'home')
Category.addCategory('transporte', 'blue', 'bus')
Category.addCategory('ocio', 'blue', 'cards')
Category.addCategory('trabajo', 'red', 'work')
Category.addCategory('viajes', 'teal', 'plane')
Category.addCategory('salario', 'green', 'money')

Account.addAccount('cuenta_rut', 'orange', 20000)
Account.addAccount('cuenta_corriente', 'blue', 30000)
Account.addAccount('tarjeta_credito', 'gray', 500000)


Transaction.addTransaction(100, "ingreso", "salario", "cuenta_corriente")
Transaction.addTransaction(200, "gasto", "trabajo", "cuenta_rut")

const categories = Category.getCategories()
const accounts = Account.getAccounts()
const transactions = Transaction.getTransactions()
const container = document.getElementById('transactions')
const button = document.getElementById('button')
const popup = document.getElementById("popup");
//opciones de fecha
const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function createTransactionCard(transaction) {
    const card = document.createElement("div");
    card.className = "transaction-card";


    card.innerHTML = `
        <div class="transaction-header">
            <h2>${transaction.typeTransaction}</h2>
            <p class="transaction-amount">$${transaction.amount.toLocaleString()}</p>
        </div>
        <div class="transaction-details">
            <p><strong>Categoría:</strong> ${transaction.category}</p>
            <p><strong>Cuenta:</strong> ${transaction.account}</p>
            <p><strong>Fecha:</strong> ${new Intl.DateTimeFormat('es-ES', opciones).format(transaction.date)}</p>
        </div>
    `;

    container.appendChild(card);
}

for (let transaction of transactions) {
    createTransactionCard(transaction)
}
/* transactions.map(transaction => createTransactionCard(transaction)) */
/* createTransactionCard(transaction); */




function createTransacion() {
    let amountPrompt = parseInt(prompt("ingresar el monto"))
    let typeTransactionPrompt = prompt("Ingresa el tipo de transacción: ingreso o gasto")
    let categoryPrompt = prompt('ingrese categoria: casa, ocio o transporte')
    let accountPrompt = prompt('ingrese la cuenta: cuenta_rut o cuenta_corriente')
    let msg = Transaction.addTransaction(amountPrompt, typeTransactionPrompt, categoryPrompt, accountPrompt)
    if (msg) {
        showPopup('Transacción agregada con éxito!')
        container.textContent = ''
        for (let transaction of transactions) {
            createTransactionCard(transaction)
        }


    } else {
        showPopup('No se puede realizar la transacción debido a datos inválidos.')
    }


}

button.addEventListener('click', createTransacion)

function showPopup(msg) {
    popup.style.display = "flex"; // Muestra el popup
    const p = popup.querySelector('div>p')
    p.textContent = msg

    // Cierra el popup automáticamente después de 2 segundos
    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}

/* const validarDatos = () => {

    if (!isNaN(amountPrompt)) {
        newTransaction.amount = amountPrompt
    } else {
        alert("El monto no es un valor númerico, intentalo denuevo")
        return
    }

    if (typeTransactionPrompt === 'ingreso' || typeTransactionPrompt === 'gasto') {
        newTransaction.typeTransaction = typeTransactionPrompt
    } else {
        alert("no ha ingresado un tipo de transacción valido, intentalo denuevo")
        return
    }

    //validar que se haya ingresado una categoria correcta
    if (categoryPrompt === 'casa' || categoryPrompt === 'ocio' || categoryPrompt === 'transporte') {
        newTransaction.category = categoryPrompt
    } else {
        alert("no ha ingresado una categoria valida")
        return
    }
    if (accountPrompt === 'cuenta_rut' || accountPrompt === 'cuenta_corriente') {
        newTransaction.account = accountPrompt
    } else {
        alert("no ha ingresado una cuenta valida")
        return
    }
    console.log(`se ha hecho 1 ${newTransaction.typeTransaction} por $${newTransaction.amount} en la categoria ${newTransaction.category} y en la cuenta ${newTransaction.account}`)
    return true

}

validarDatos() */

/* const realizarTransaccion = () => {
    let t = newTransaction
    if (t.typeTransaction === 'ingreso') {
        console.log('realizando ingreso')

        console.log(user.accounts)
        //utilizando ciclo for of según consigna
        for (let account of user.accounts) {
            if (account.name === t.account) {
                console.log(`el monto actual de la cuenta ${account.name} es ${account.amount}`)
                account.amount = account.amount + t.amount
                console.log(`Se ha ingresado  $${t.amount} en la cuenta ${account.name}, el nuevo monto es ${account.amount}`)
                return
            }
        }

    }
    if (t.typeTransaction === 'gasto') {
        console.log('realizando gasto')

        console.log(user.accounts)
        //utilizando ciclo for of según consigna
        for (let account of user.accounts) {
            if (account.name === t.account) {
                console.log(`el monto actual de la cuenta ${account.name} es ${account.amount}`)
                account.amount = account.amount - t.amount
                console.log(`Se ha gastado $${t.amount} de la cuenta ${account.name}, el nuevo monto es ${account.amount} `)
                return
            }
        }

    }


} */





