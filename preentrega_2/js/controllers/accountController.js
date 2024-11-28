import { accounts } from "../../data/data.js";

export class Account {
    constructor(name, color, balance) {
        this.name = name;
        this.color = color;
        this.balance = balance;
    }

    static addAccount(name, color, icon) {
        const newObject = new Account(name, color, icon);
        const newAccount = { ...newObject }
        accounts.push(newAccount);
    }


    static getAccounts() {
        return accounts
    }

    static updateAccount(transaction) {
        console.log(transaction)
        let accountsList = this.getAccounts()
        let index = accountsList.findIndex(item => item.name === transaction.account)
        console.log(index)
        console.log(accounts[index])

        if (transaction.typeTransaction === 'ingreso') {
            accounts[index].balance += transaction.amount
        }
        if (transaction.typeTransaction === 'gasto') {
            accounts[index].balance -= transaction.amount
        }
        console.log(`el monto actual de la cuenta ${accounts[index].name} es ${accounts[index].balance}`)
    }
}