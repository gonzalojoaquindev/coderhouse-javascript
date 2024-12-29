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

    // Función para obtener las transacciones del localStorage
    const getTransactions = () => JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // Función para guardar las transacciones en el localStorage
    const saveTransactions = (transactions) => localStorage.setItem(localStorageKey, JSON.stringify(transactions));

    // Función para cargar las transacciones en el DOM
    const loadTransactions = () => {
        transactionList.innerHTML = ''; // Limpiar el contenedor de la lista de transacciones
        const transactions = getTransactions();
        transactions.forEach(addTransactionToDOM);
    };

    // Función para agregar una transacción al DOM
    const addTransactionToDOM = (transaction) => {
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

        editButton.appendChild(editButtonIcon);
        editButton.addEventListener('click', () => {
            openTransactionModal(true, transaction.id);
        });

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-small', 'red', 'waves-effect', 'waves-light');

        const deleteButtonIcon = document.createElement('i');
        deleteButtonIcon.textContent = 'delete';
        deleteButtonIcon.classList.add('material-icons');

        deleteButton.appendChild(deleteButtonIcon);
        // Evento para eliminar la transacción
        deleteButton.addEventListener('click', (event) => {
            removeTransaction(event.currentTarget, transaction.id);
        });

        const iconContainerAction = document.createElement('div');
        iconContainerAction.classList.add('transaction-actions');
        iconContainerAction.appendChild(editButton);
        iconContainerAction.appendChild(deleteButton);

        transactionItem.appendChild(iconContainerAction);
        transactionList.appendChild(transactionItem);
    };

    // Función para abrir el modal de transacción
    const openTransactionModal = (isEdit, transactionId = null) => {
        const modalTitle = document.getElementById('modal-title');
        const saveButton = document.getElementById('saveButton');
        const updateButton = document.getElementById('updateButton');

        if (isEdit) {
            modalTitle.textContent = 'Editar Transacción';
            saveButton.style.display = 'none';
            updateButton.style.display = 'inline-block';
            loadTransactionToForm(transactionId);
            updateButton.onclick = (event) => updateTransaction(event, transactionId);
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
    };

    // Función para cargar los datos de una transacción en el formulario
    const loadTransactionToForm = (transactionId) => {
        const transactions = getTransactions();
        const transaction = transactions.find(t => t.id === transactionId);

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
        populateSubcategorySelect(transaction.category);
        const subcategorySelect = document.getElementById("subcategory-select");
        subcategorySelect.value = transaction.subcategory;
        M.FormSelect.init(subcategorySelect);

        const categoryIcon = document.getElementById('category-icon');
        categoryIcon.textContent = transaction.icono;
        categoryIcon.style.color = transaction.color;
    };

    // Función para resetear el formulario de transacción
    const resetTransactionForm = () => {
        document.getElementById('transactionForm').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        M.FormSelect.init(document.querySelectorAll('select'));
    };

    // Función para poblar las subcategorías
    const populateSubcategorySelect = (categoryName) => {
        const category = categoriesData.find(cat => cat.category_name === categoryName);
        const subcategorySelect = document.getElementById('subcategory-select');
        subcategorySelect.innerHTML = '<option value="" disabled selected>Selecciona una subcategoría</option>';
        if (category) {
            category.subcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                subcategorySelect.appendChild(option);
            });
        }
        M.FormSelect.init(subcategorySelect);
    };

    // Función para actualizar una transacción
    const updateTransaction = (event, transactionId) => {
        event.preventDefault();

        const transactions = getTransactions();
        const index = transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            transactions[index] = {
                id: transactionId,
                amount: parseFloat(document.getElementById("amount").value),
                account: document.getElementById("account").value,
                category: document.getElementById("category-select").value,
                subcategory: document.getElementById("subcategory-select").value,
                date: document.getElementById("date").value,
                type: document.querySelector('input[name="transactionType"]:checked').value,
                icono: transactions[index].icono, // Mantener el icono existente
                color: transactions[index].color  // Mantener el color existente
            };
            saveTransactions(transactions);
            loadTransactions();
            M.toast({ html: 'Transacción actualizada exitosamente', classes: 'green' });
        } else {
            console.error(`Transacción con ID ${transactionId} no encontrada para actualizar.`);
        }
    };

    // Función para eliminar una transacción del localStorage y del DOM
    const removeTransaction = (buttonElement, transactionId) => {
        console.log(`Eliminando transacción ${transactionId}`);
        const transactions = getTransactions();
        const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);

        // Actualizar localStorage
        saveTransactions(updatedTransactions);

        // Eliminar la transacción del DOM directamente
        const transactionItem = buttonElement.closest('.transaction-item'); // Encuentra el contenedor padre más cercano
        if (transactionItem) {
            transactionItem.remove();
        }

        // Mostrar un mensaje
        M.toast({ html: 'Transacción eliminada', classes: 'red' });
    };

    return {
        initialize
    };
})();