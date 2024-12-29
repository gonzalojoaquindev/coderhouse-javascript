import { transactions } from "../../data/data.js";
import { Category } from "./categoriesController.js";
import { Account } from "./accountController.js";
import { createTransactionCard, updateTransactionRender } from "../main.js";

export class Transaction {
    constructor(amount, typeTransaction, category, account, comment) {
        this.amount = parseInt(amount);
        this.typeTransaction = typeTransaction.trim().toLowerCase();
        this.category = category.trim().toLowerCase();
        this.account = account.trim().toLowerCase();
        this.comment = comment
    }

    // Método para validar los datos
    static validarDatos(amount, typeTransaction, category, account, comment) {

        let categories = Category.getCategories()


        //funcion de orden superior
        let categoriesName = categories.map(cat => cat.name)


        let accounts = Account.getAccounts()
        let accountsName = accounts.map(account => account.name)


        if (this.amount === null || this.amount <= 0) {
            console.error("El monto debe ser mayor que 0.");
            return false;
        }
        if (isNaN(amount)) {
            console.log(amount)
            console.error("El monto debe ser un valor númerico");
            return false;
        }


        if (!typeTransaction) {
            console.error("El tipo de transacción es obligatorio.");
            return false;

        }

        if (!typeTransaction === 'ingreso' || !typeTransaction === 'gasto') {
            console.error("el valor debe ser 'ingreso'  o 'gasto")
            return false
        }

        if (!categories) {
            console.error("La categoría es obligatoria.");
            return false;
        }
        if (!categoriesName.includes(category)) {
            console.error("La categoría no existe");
            return false;
        }

        if (!account) {
            console.error("La cuenta es obligatoria.");
            return false;
        }

        if (!accountsName.includes(account)) {
            console.error("La cuenta no existe");
            return false;
        }



        return true;
    }

    /* validarSaldoCuenta(){

    }
 */

    //addTransactions
    //EliminarTransaction
    //EditarTransaction

    // Método para realizar la transacción
    static addTransaction(amount, typeTransaction, category, account, comment) {

        //localStorage.setItem("transactions", JSON.stringify([]));

        if (!this.validarDatos(amount, typeTransaction, category, account)) {
            console.error("No se puede realizar la transacción debido a datos inválidos.");
            return false;
        }



        const newObject = new Transaction(amount, typeTransaction, category, account, comment);
        const newTransaction = { ...newObject }
        newTransaction.date = new Date()
        console.log(newTransaction)
        //transactions.push(newTransaction);

        // 1. Obtener el array desde el localStorage
        let transactions = JSON.parse(localStorage.getItem("transactions"));
        console.log(transactions)

        // Si no existe, se crea el array en el localstorage
        if (!transactions) {
            localStorage.setItem('transactions', JSON.stringify([]));
            transactions = JSON.parse(localStorage.getItem("transactions"))
        }

        console.log(transactions)

        // 2. Editar el array
        transactions.push(newTransaction); // Agregar un nuevo elemento
        //miArray[0] = "Elemento Actualizado"; // Editar un elemento específico

        console.log(transactions)

        // 3. Guardar el array actualizado en el localStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));
        console.log("Array actualizado:", transactions);
        //updateTransactionRender()



        Account.updateAccount(newTransaction)

        console.log("Transacción realizada con éxito");
        return true;
    }

    static getTransactions() {
        let transactionsLocalStorage = JSON.parse(localStorage.getItem("transactions"));
        return (transactionsLocalStorage)
    }


}

// Uso de la clase
//let transaccion = new Transaction(100, "ingreso", "salario", "cuenta bancaria");

// Intentar realizar la transacción
//transaccion.realizarTransaccion(); // Transacción realizada con éxito.