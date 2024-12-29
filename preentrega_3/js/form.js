import { transactions } from "../data/data.js";
import { Account } from "./controllers/accountController.js";
import { Category } from "./controllers/categoriesController.js";
import { Transaction } from "./controllers/transactionController.js";
import { showPopup, createTransactionCard } from "./main.js"

// Seleccionar elementos
const modal = document.getElementById('modal');
const openModal = document.getElementById('button');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const cuentaSelect = document.getElementById('account');
const categorySelect = document.getElementById('category');
const container = document.getElementById('transactions')
const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const accounts = Account.getAccounts()
const categories = Category.getCategories()

console.log(categories)

// Poblar el select con las cuentas
accounts.forEach(account => {
    const option = document.createElement('option');
    option.value = account.name.toLowerCase();
    option.textContent = account.name;
    cuentaSelect.appendChild(option);
});
// Poblar el select con las categorias
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name.toLowerCase();
    option.textContent = category.name;
    categorySelect.appendChild(option);
});


// Abrir el modal
openModal.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Cerrar el modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cancelar y cerrar el modal
cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Enviar el formulario
/* document.getElementById('transactionForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar el envío por defecto

    alert('Formulario enviado con éxito!');
    modal.style.display = 'none';
});
 */

document.getElementById('transactionForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el envío por defecto

    // Crear un objeto FormData con el formulario
    const formData = new FormData(event.target);

    // Convertir los datos a un objeto de JavaScript
    const formObject = Object.fromEntries(formData.entries());

    // Mostrar los datos en la consola
    console.log(formObject);


    let msg = Transaction.addTransaction(formObject.amount, formObject.typeTransaction, formObject.category, formObject.account, formObject.comment)
    formObject.date = new Date()
    console.log(formObject)
    const newTransaction = document.createElement('div');

    newTransaction.innerHTML = `
        <div class="transaction-header">
            <h2>${formObject.typeTransaction}</h2>
            <p class="transaction-amount">$${formObject.amount.toLocaleString()}</p>
        </div>
        <div class="transaction-details">
            <p><strong>Categoría:</strong> ${formObject.category}</p>
            <p><strong>Cuenta:</strong> ${formObject.account}</p>
            <p><strong>Fecha:</strong> ${new Intl.DateTimeFormat('es-ES', opciones).format(formObject.date)}</p>
        </div>
    `;
    container.appendChild(newTransaction);
    /* createTransactionCard(formObject) */
    modal.style.display = 'none';

    if (msg) {
        showPopup('Transacción agregada con éxito!')


    } else {
        showPopup('No se puede realizar la transacción debido a datos inválidos.')
    }
});

//Transaction.addTransaction(100, "ingreso", "salario", "cuenta_corriente", "prueba1")