document.addEventListener("DOMContentLoaded", () => {
    AccountApp.initialize();
});

// ** AccountApp **
const AccountApp = (() => {
    const accountList = document.getElementById('accountList');
    const localStorageKey = "accounts";

    // ** Inicialización Principal **
    const initialize = () => {
        initializeMaterialize();
        fetchAccounts();
    };

    // ** Inicializar Materialize **
    const initializeMaterialize = () => {
        M.Modal.init(document.querySelectorAll('.modal'));
        M.FormSelect.init(document.querySelectorAll('select'));
    };

    // Función para obtener las cuentas del archivo JSON
    const fetchAccounts = () => {
        fetch('data/accounts.json')
            .then(response => response.json())
            .then(data => {
                saveAccounts(data);
                loadAccounts();
            })
            .catch(error => console.error('Error al cargar las cuentas:', error));
    };

    // Función para obtener las cuentas del localStorage
    const getAccounts = () => JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // Función para guardar las cuentas en el localStorage
    const saveAccounts = (accounts) => localStorage.setItem(localStorageKey, JSON.stringify(accounts));

    // Función para cargar las cuentas en el DOM
    const loadAccounts = () => {
        accountList.innerHTML = ''; // Limpiar el contenedor de la lista de cuentas
        const accounts = getAccounts();
        console.log(accounts)
        accounts.forEach(addAccountToDOM);
    };

    // Función para agregar una cuenta al DOM
    const addAccountToDOM = (account) => {
        const accountList = document.getElementById('accountList');
        const accountItem = document.createElement('div');
        accountItem.classList.add('account-item');

        const iconContainer = document.createElement('div');
        iconContainer.classList.add('account-icon', account.color || 'teal');

        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.innerText = account.icon;
        iconContainer.appendChild(icon);

        const details = document.createElement('div');
        details.classList.add('account-details');
        details.innerHTML = `
            <span>${account.name}</span>
            <span class="account-date"> ${account.description}</span>
        `;

        const amount = document.createElement('span');
        amount.classList.add('account-amount', account.type === 'gasto' ? 'red-text' : 'green-text');
        amount.innerText = `$${account.balance}`;

        accountItem.appendChild(iconContainer);
        accountItem.appendChild(details);
        accountItem.appendChild(amount);



        accountItem.appendChild(amount);


        //accountItem.appendChild(editButton);

        accountList.prepend(accountItem);


    };

    return {
        initialize
    };
})();