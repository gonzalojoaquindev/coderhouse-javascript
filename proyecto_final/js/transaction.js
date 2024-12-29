document.addEventListener("DOMContentLoaded", () => {
    TransactionApp.initialize();


});

// ** TransactionApp **
const TransactionApp = (() => {
    const transactionList = document.getElementById('transactionList');
    const localStorageKey = "transactions";
    let categoriesData = [];
    let iconSelected = null;
    let colorSelected = null;

    // Botón para agregar una nueva transacción
    document.getElementById('addTransactionButton').addEventListener('click', () => {
        console.log("creando transacción")
        openTransactionModal(false);
    });

    // ** Inicialización Principal **
    const initialize = () => {
        initializeMaterialize();
        loadTransactions();
        initializeCategorySelect();
        initializeSaveButton();
    };

    // ** Inicializar Materialize **
    const initializeMaterialize = () => {
        M.Modal.init(document.querySelectorAll('.modal'));
        M.FormSelect.init(document.querySelectorAll('select'));
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            format: 'yyyy-mm-dd',
            defaultDate: new Date(),
            setDefaultDate: true
        });
    };

    // ** Gestión de Transacciones **
    const getTransactions = () => JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const saveTransactions = (transactions) => localStorage.setItem(localStorageKey, JSON.stringify(transactions));

    const loadTransactions = () => {
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';
        const transactions = getTransactions();
        transactions.forEach(addTransactionToDOM);
    };

    const saveTransaction = (transaction) => {
        const transactions = getTransactions();
        transactions.push(transaction);
        saveTransactions(transactions);
    };

    function loadTransactionToForm(transactionId) {
        console.log("editando transacción")
        const transactions = getTransactions();
        const transaction = transactions.find(t => t.id === transactionId);
        console.log(transaction)

        if (!transaction) {
            console.error(`Transacción con ID ${transactionId} no encontrada.`);
            return;
        }

        // Cargar datos al formulario
        //document.getElementById("transaction-id").value = transaction.id;
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("account").value = transaction.account;
        document.getElementById("subcategory-select").value = transaction.subcategory;
        document.getElementById("category-select").value = transaction.category;
        document.getElementById("date").value = transaction.date;
        document.querySelector(`input[name="transactionType"][value="${transaction.type}"]`).checked = true;

        // Actualiza los selects de Materialize
        M.FormSelect.init(document.querySelectorAll('select'));

        // Actualiza los selects de Materialize
        // M.FormSelect.init(document.getElementById("subcategory-select"));

        // Abre el modal del formulario
        const modal = document.getElementById('transactionModal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    function saveTransactionFromForm() {
        const transactions = getTransactions();

        // Leer datos del formulario
        const transactionId = parseInt(document.getElementById("transaction-id").value, 10);
        const updatedTransaction = {
            id: transactionId,
            amount: parseFloat(document.getElementById("amount").value),
            account: document.getElementById("account").value,
            category: document.getElementById("category-select").value,
            subcategory: document.getElementById("subcategory-select").value,
            date: document.getElementById("date").value,
            type: document.querySelector('input[name="transactionType"]:checked').value
        };

        // Actualizar la transacción existente
        const index = transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            transactions[index] = updatedTransaction;
            saveTransactions(transactions);
            console.log(`Transacción con ID ${transactionId} actualizada.`);
        } else {
            console.error(`Transacción con ID ${transactionId} no encontrada.`);
        }

        // Actualizar la lista en el DOM
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionToDOM);

        // Mensaje de éxito
        M.toast({ html: 'Transacción actualizada exitosamente', classes: 'green' });
    }

    const addTransactionToDOM = (transaction) => {
        const transactionList = document.getElementById('transactionList');
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transaction-item');

        const iconContainer = document.createElement('div');
        iconContainer.classList.add('transaction-icon', transaction.color || 'teal');

        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.innerText = transaction.icono;
        iconContainer.appendChild(icon);

        const details = document.createElement('div');
        details.classList.add('transaction-details');
        details.innerHTML = `
            <span>${transaction.category} - ${transaction.subcategory}</span>
            <span class="transaction-date"> ${transaction.account} - ${transaction.date}</span>
        `;

        const amount = document.createElement('span');
        amount.classList.add('transaction-amount', transaction.type === 'gasto' ? 'red-text' : 'green-text');
        amount.innerText = `${transaction.type === 'gasto' ? '-' : '+'}CLP ${transaction.amount}`;

        transactionItem.appendChild(iconContainer);
        transactionItem.appendChild(details);
        transactionItem.appendChild(amount);

        // Botón de edición
        const editButton = document.createElement('button');
        editButton.classList.add('btn-small', 'waves-effect', 'waves-light', 'teal', 'modal-trigger');

        const editButtonIcon = document.createElement('i');
        editButtonIcon.textContent = 'create';
        editButtonIcon.classList.add('material-icons');

        editButton.appendChild(editButtonIcon)
        editButton.addEventListener('click', () => {
            openTransactionModal(true, transaction.id);
        });

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-small', 'red', 'waves-effect', 'waves-light');

        const deleteButtonIcon = document.createElement('i');
        deleteButtonIcon.textContent = 'delete';
        deleteButtonIcon.classList.add('material-icons');

        deleteButton.appendChild(deleteButtonIcon)
        // Evento para eliminar la transacción
        deleteButton.addEventListener('click', (event) => {
            removeTransaction(event.currentTarget, transaction.id);
        });


        const iconContainerAction = document.createElement('div');

        iconContainerAction.appendChild(editButton)
        iconContainerAction.appendChild(deleteButton)

        transactionItem.appendChild(amount);
        transactionItem.appendChild(iconContainerAction);

        //transactionItem.appendChild(editButton);

        transactionList.prepend(transactionItem);
    };

    function openTransactionModal(isEdit, transactionId = null) {
        const modalTitle = document.getElementById('modal-title');
        const saveButton = document.getElementById('saveTransaction');
        const updateButton = document.getElementById('updateButton');

        console.log(isEdit)

        if (isEdit) {
            console.log("Editando transaccion")
            modalTitle.textContent = 'Editar Transacción';
            saveButton.style.display = 'none';
            updateButton.style.display = 'inline-block';
            loadTransactionToForm(transactionId);
            updateButton.onclick = () => updateTransaction(transactionId);
        } else {
            modalTitle.textContent = 'Agregar Transacción';
            saveButton.style.display = 'inline-block';
            updateButton.style.display = 'none';
            resetTransactionForm();
        }

        // Abre el modal del formulario
        const modal = document.getElementById('transactionModal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    function loadTransactionToForm(transactionId) {
        console.log("editando transacción");
        const transactions = getTransactions();
        const transaction = transactions.find(t => t.id === transactionId);
        console.log(transaction);

        if (!transaction) {
            console.error(`Transacción con ID ${transactionId} no encontrada.`);
            return;
        }

        // Cargar datos al formulario
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("account").value = transaction.account;
        document.getElementById("category-select").value = transaction.category;
        document.getElementById("subcategory-select").value = transaction.subcategory;
        document.getElementById("date").value = transaction.date;
        document.querySelector(`input[name="transactionType"][value="${transaction.type}"]`).checked = true;

        // Actualiza los selects de Materialize
        M.FormSelect.init(document.querySelectorAll('select'));

        // Poblar subcategorías
        populateSubcategorySelect(transaction.category)
        const subcategorySelect = document.getElementById("subcategory-select")
        subcategorySelect.value = transaction.subcategory;
        M.FormSelect.init(subcategorySelect);


        const categoryIcon = document.getElementById('category-icon');
        categoryIcon.textContent = transaction.icono
        categoryIcon.style.color = transaction.color


        // Abre el modal del formulario
        const modal = document.getElementById('transactionModal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    function resetTransactionForm() {
        document.getElementById('transactionForm').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    function updateTransaction(transactionId) {
        const transactions = getTransactions();
        const index = transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            const transactionEdit = transactions[index]
            console.log("hola")
            console.log(transactions[index])
            transactions[index] = {
                id: transactionId,
                amount: parseFloat(document.getElementById("amount").value),
                account: document.getElementById("account").value,
                category: document.getElementById("category-select").value,
                subcategory: document.getElementById("subcategory-select").value,
                date: document.getElementById("date").value,
                type: document.querySelector('input[name="transactionType"]:checked').value,
                icono: iconSelected,
                color: colorSelected

            };
            saveTransactions(transactions);
            loadTransactions();
            M.toast({ html: 'Transacción actualizada exitosamente', classes: 'green' });
        } else {
            console.error(`Transacción con ID ${transactionId} no encontrada para actualizar.`);
        }
    }



    // Función para eliminar una transacción del localStorage y del DOM
    function removeTransaction(buttonElement, transactionId) {
        console.log(`Eliminando transacción ${transactionId}`)
        const transactions = getTransactions();
        const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);

        // Actualizar localStorage
        saveTransactions(updatedTransactions);

        // Verificar que buttonElement sea un elemento del DOM
        if (buttonElement instanceof HTMLElement) {
            // Eliminar la transacción del DOM directamente
            const transactionItem = buttonElement.closest('.transaction-item'); // Encuentra el contenedor padre más cercano
            if (transactionItem) {
                transactionItem.remove();
            }
        } else {
            console.error('buttonElement no es un elemento del DOM');
        }

        // Mostrar un mensaje
        M.toast({ html: 'Transacción eliminada', classes: 'red' });
    }


    // ** Guardar Transacción desde el Formulario **
    const initializeSaveButton = () => {
        const saveButton = document.getElementById('saveTransaction');
        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            const newTransaction = getTransactionFormData();
            if (!newTransaction) {
                M.toast({ html: 'No ingresaste correctamente los datos!' });
                return;
            }
            saveTransaction(newTransaction);
            addTransactionToDOM(newTransaction);
            M.toast({ html: 'Transacción guardada exitosamente', classes: 'green' });
            resetTransactionForm();
        });
    };

    function generateTransactionId() {
        return `${Date.now()}`;
    }

    const getTransactionFormData = () => {

        const id = generateTransactionId();// Generar un ID único para la transacción
        const amount = parseFloat(document.getElementById('amount').value);
        const account = document.getElementById('account').value;
        const category = document.getElementById('category-select').value;
        const subcategory = document.getElementById('subcategory-select').value;
        const transactionType = document.querySelector('input[name="transactionType"]:checked')?.value;
        const date = document.getElementById('date').value;

        if (!amount || !account || !category || !transactionType || !date) return null;

        return {
            id,
            amount,
            account,
            category,
            subcategory,
            type: transactionType,
            date,
            icono: iconSelected,
            color: colorSelected
        };
    };


    // ** Gestión de Categorías **
    const initializeCategorySelect = () => {
        fetch('./data/categories2.json')
            .then(response => response.json())
            .then(data => {
                categoriesData = data.map(transformCategory);
                populateCategorySelect();
                document.getElementById('category-select').addEventListener('change', onCategoryChange);
            })
            .catch(error => console.error('Error al cargar categorías:', error));
    };

    const transformCategory = (category) => ({
        category_name: category.category_name,
        color: category.color,
        icono: category.icon,
        subcategories: category.subcategories
    });



    // Función para agregar una cuenta al DOM
    const addAccountToDOM = (account) => {
        const accountList = document.getElementById('accountList');
        const accountItem = document.createElement('div');
        accountItem.classList.add('account-item');

        const details = document.createElement('div');
        details.classList.add('account-details');
        details.innerHTML = `
        <span>${account.name}</span>
        <span class="account-balance">Saldo: CLP ${account.balance}</span>
    `;

        accountItem.appendChild(details);

        // Botón de edición
        const editButton = document.createElement('button');
        editButton.classList.add('btn-small', 'waves-effect', 'waves-light', 'teal', 'modal-trigger');

        const editButtonIcon = document.createElement('i');
        editButtonIcon.textContent = 'create';
        editButtonIcon.classList.add('material-icons');

        editButton.appendChild(editButtonIcon);
        editButton.addEventListener('click', () => {
            openAccountModal(true, account.id);
        });

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-small', 'red', 'waves-effect', 'waves-light');

        const deleteButtonIcon = document.createElement('i');
        deleteButtonIcon.textContent = 'delete';
        deleteButtonIcon.classList.add('material-icons');

        deleteButton.appendChild(deleteButtonIcon);
        deleteButton.addEventListener('click', (event) => {
            removeAccount(event.currentTarget, account.id);
        });

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('account-actions');
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);

        accountItem.appendChild(actionContainer);
        accountList.appendChild(accountItem);
    };

    // Función para cargar las cuentas en el DOM
    const loadAccounts = () => {
        const accountList = document.getElementById('accountList');
        accountList.innerHTML = ''; // Limpiar el contenedor de la lista de cuentas
        const accounts = getAccounts();
        accounts.forEach(addAccountToDOM);
    };



    const populateCategorySelect = () => {
        const categorySelect = document.getElementById('category-select');
        categoriesData.forEach(category => {

            const option = document.createElement('option');
            option.value = category.category_name;
            option.dataset.color = category.color;
            option.dataset.icono = category.icono;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
        });
        M.FormSelect.init(categorySelect);
    };

    const onCategoryChange = (event) => {
        console.log("cambio de categoria")
        const selectedOption = event.target.options[event.target.selectedIndex];
        iconSelected = selectedOption.dataset.icono || 'help_outline';
        colorSelected = selectedOption.dataset.color || 'black';

        const categoryIcon = document.getElementById('category-icon');
        categoryIcon.textContent = iconSelected;
        categoryIcon.style.color = colorSelected;

        populateSubcategorySelect(event.target.value);
    };

    const populateSubcategorySelect = (categoryName) => {
        console.log("poblando subcategories")
        const subcategorySelect = document.getElementById('subcategory-select');
        subcategorySelect.innerHTML = '<option value="" disabled selected>Selecciona una subcategoría</option>';
        console.log(categoriesData)
        const category = categoriesData.find(cat => cat.category_name === categoryName);
        console.log("intentanddo poblar subcategorias")
        if (category) {
            category.subcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.name;
                option.textContent = sub.name;
                subcategorySelect.appendChild(option);
            });
        }
        M.FormSelect.init(subcategorySelect);
    };

    return {
        initialize
    };
})();