import { transactions } from "../../data/data.js";
import { Category } from "./categoriesController.js";
import { Account } from "./accountController.js";

export class Transaction {
    constructor(amount, typeTransaction, category, account) {
        this.amount = parseInt(amount);
        this.typeTransaction = typeTransaction.trim().toLowerCase();
        this.category = category.trim().toLowerCase();
        this.account = account.trim().toLowerCase();
    }

    // Método para validar los datos
    static validarDatos(amount, typeTransaction, category, account) {

        let categories = Category.getCategories()
        console.log(categories)

        //funcion de orden superior
        let categoriesName = categories.map(cat => cat.name)

        let accounts = Account.getAccounts()
        let accountsName = accounts.map(account => account.name)


        if (this.amount === null || this.amount <= 0) {
            console.error("El monto debe ser mayor que 0.");
            return false;
        }
        if (isNaN(amount)) {
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
    static addTransaction(amount, typeTransaction, category, account) {
        if (!this.validarDatos(amount, typeTransaction, category, account)) {
            console.error("No se puede realizar la transacción debido a datos inválidos.");
            return false;
        }

        const newObject = new Transaction(amount, typeTransaction, category, account);
        const newTransaction = { ...newObject }
        newTransaction.date = new Date()
        console.log(newTransaction)
        transactions.push(newTransaction);
        Account.updateAccount(newTransaction)
        console.log("Transacción realizada con éxito");
        return true;
    }

    static getTransactions() {
        return (transactions)
    }


}

// Uso de la clase
//let transaccion = new Transaction(100, "ingreso", "salario", "cuenta bancaria");

// Intentar realizar la transacción
//transaccion.realizarTransaccion(); // Transacción realizada con éxito.