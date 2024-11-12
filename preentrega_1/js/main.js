
let user = {
    accounts: [
        { name: 'cuenta_rut', amount: 100000 },
        { name: 'cuenta_corriente', amount: 150000 },

    ]
}

let newTransaction = {
    amount: null,
    typeTransaction: null,
    category: null,
    account: null
}

alert("ingresa una nueva transaccion: Ej: monto: 30000, tipo de transaccion: gasto, categoria: casa, cuenta: cuenta_rut")

let amountPrompt = parseInt(prompt("ingresar el monto"))
let typeTransactionPrompt = prompt("Ingresa el tipo de transacción: ingreso o gasto")
let categoryPrompt = prompt('ingrese categoria: casa, ocio o transporte')
let accountPrompt = prompt('ingrese la cuenta: cuenta_rut o cuenta_corriente')

const validarDatos = () => {

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

validarDatos()

const realizarTransaccion = () => {
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

            }
        }

    }


}

if (validarDatos) {
    realizarTransaccion()
}










//validar que se haya ingresado una cuenta correcta




//función para sumar los gastos de un array.
const sumarGastos = (typeTransaction) => {
    let total = 0
    for (var i = 0; i < tipoGasto.length; i++) {
        total += tipoGasto[i].costo
    }
    return total
};

/* const restarDinero () = {

} */


/* sumarSaldo(monto) {
    let cupo = this.cupo
    let credito = this.saldo.credito
    let cupoOcupado = cupo - credito

    if (credito >= cupo) {
        //Despositar a debito
        this.saldo.debito += monto
        console.log('depositar a debito')
    } else {
        if (monto > cupoOcupado) {
            //desposita a credito y lo que sobra a debito
            this.saldo.debito += monto - cupoOcupado
            this.saldo.credito = cupo
            console.log('depositar a credito y lo que sobre a la debito')
        } else {
            //desposita solo a credito
            console.log('depositar todo a la cuenta credito')
        }
    }
} */





let mensuales = [{
    item: "casa",
    costo: 10
},
{
    item: "pasaje de bus",
    costo: 20
},
{
    item: "internet",
    costo: 30
},
{
    item: "netflix",
    costo: 40
},
{
    item: 'pastillas',
    costo: 50
}
];