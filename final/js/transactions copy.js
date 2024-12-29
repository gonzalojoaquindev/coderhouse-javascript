//Funcion que abre modal de formulario

document.addEventListener('DOMContentLoaded', function () {
    console.log("desde transactions")

    // Inicializar modales
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    // Inicializar selects
    const selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    // Inicializar datepickers con la fecha del día
    const datepickers = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datepickers, {
        format: 'yyyy-mm-dd',
        defaultDate: new Date(), // Establece la fecha del día
        setDefaultDate: true     // Asegura que se muestre como predeterminada
    });
    /*
   // Capturar el formulario
   const transactionForm = document.getElementById('transactionForm');
   console.log(transactionForm)

   // Escuchar el evento submit
   transactionForm.addEventListener('submit', function (event) {
       event.preventDefault(); // Evitar recargar la página

       // Obtener los valores de los inputs
       const monto = document.getElementById('monto').value;
       const cuenta = document.getElementById('cuenta').value;
       const categoria = document.getElementById('categoria').value;
       const tipoTransaccion = document.querySelector('input[name="tipoTransaccion"]:checked').value;
       const fecha = document.getElementById('fecha').value;

       // Crear un objeto con los datos del formulario
       const transactionData = {
           monto,
           cuenta,
           categoria,
           tipoTransaccion,
           fecha
       };

       // Guardar en localStorage
       let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
       transactions.push(transactionData);
       localStorage.setItem('transactions', JSON.stringify(transactions));

       // Opcional: Limpia el formulario
       transactionForm.reset();
       M.FormSelect.init(selects); // Reinicializa los selects

       // Mostrar un mensaje de éxito
       M.toast({ html: 'Transacción guardada exitosamente', classes: 'green' });
   }); */


});


// Función para agregar una nueva transacción al DOM-----------

document.addEventListener('DOMContentLoaded', function () {
    const transactionList = document.getElementById('transactionList');
    const saveButton = document.getElementById('saveTransaction');

    function addTransactionToDOM(transaction) {
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transaction-item');

        const transactionInfo = document.createElement('div');
        transactionInfo.classList.add('transaction-info');

        /*   <div class="icon-container">
              <i class="material-icons">school</i>
          </div>
    */
        /* const icon = document.createElement('div');
        icon.classList.add('transaction-icon');
        icon.style.backgroundColor = transaction.iconColor || '#9E9E9E';
        icon.innerText = transaction.icon || '💵'; */


        const iconContainer = document.createElement('div');
        iconContainer.classList.add('transaction-icon');
        iconContainer.classList.add(transaction.color || 'teal');
        //iconContainer.style.backgroundColor = transaction.iconColor || 'red';

        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.innerText = transaction.icon
        iconContainer.appendChild(icon)

        const details = document.createElement('div');
        details.classList.add('transaction-details');

        const title = document.createElement('span');
        title.innerText = `${transaction.category} - ${transaction.subcategory}`;

        const subtitle = document.createElement('span');
        subtitle.classList.add('transaction-date');
        subtitle.innerText = `${transaction.account} - ${transaction.date}`;



        details.appendChild(title);
        details.appendChild(subtitle);

        transactionInfo.appendChild(iconContainer);
        transactionInfo.appendChild(details);

        const amount = document.createElement('span');
        amount.classList.add('transaction-amount');
        amount.classList.add(`${transaction.type === 'gasto' ? 'red-text' : 'green-text'}`);
        amount.innerText = `${transaction.type === 'gasto' ? '-' : '+'}CLP ${transaction.amount}`;

        transactionItem.appendChild(transactionInfo);
        transactionItem.appendChild(amount);

        transactionList.prepend(transactionItem);
    }

    const localStorageKey = "transactions";

    // Obtener transacciones del localStorage
    function getTransactions(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }




    // Función para cargar todas las transacciones del localStorage
    function loadTransactions() {
        const transactions = getTransactions(transactions)
        transactions.forEach(addTransactionToDOM);
        console.log(transactions)
    }

    // Función para guardar una nueva transacción en localStorage
    function saveTransaction(transaction) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function getCategoryDetailsById(categories, categoryId) {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) {
            console.warn(`Categoría con ID ${categoryId} no encontrada.`);
            return null;
        }
        return { icon: category.icon, color: category.color };
    }



    // Evento al hacer clic en "Guardar"
    saveButton.addEventListener('click', function (e) {
        console.log("hola")
        e.preventDefault(); // Evitar el comportamiento por defecto del formulario

        // Obtener los valores del formulario
        const amount = parseFloat(document.getElementById('amount').value);
        const account = document.getElementById('account').value;
        const category = document.getElementById('category-select').value;
        const subcategory = document.getElementById('subcategory-select').value;
        const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
        const date = document.getElementById('date').value;

        if (!amount || !account || !category || !transactionType || !date) {
            M.toast({ html: 'No ingresaste correctamente los datos!' })
            return;
        }



        console.log("category", category)

        // Crear el objeto de transacción
        const newTransaction = {
            category,
            subcategory,
            account,
            date,
            amount,
            type: transactionType,
            icon: iconcSubcategorySelected,
            color: colorSubcategorySelected,
        };

        console.log(newTransaction)

        // Guardar en localStorage y pintar en pantalla
        saveTransaction(newTransaction);
        addTransactionToDOM(newTransaction);
        // Mostrar un mensaje de éxito
        M.toast({ html: 'Transacción guardada exitosamente', classes: 'green' });

        // Limpiar el formulario
        document.getElementById('transactionForm').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0]; // Restaurar fecha por defecto
    });

    // Cargar transacciones al iniciar
    loadTransactions();
});


let iconcSubcategorySelected = null
let colorSubcategorySelected = null

// Elemento <select> del formulario---------------------------------------------

/*     const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory-select'); */
// Fetch para cargar las categorías
document.addEventListener('DOMContentLoaded', () => {

    const categorySelect = document.getElementById('category-select');
    const subcategorySelect = document.getElementById('subcategory-select');
    const categoryIcon = document.getElementById('category-icon');

    let categoriesData = []; // Definir la variable globalmente


    // Re-inicializar el select
    M.FormSelect.init(categorySelect);

    M.FormSelect.init(subcategorySelect);

    // S: Single Responsibility
    // Función dedicada solo a obtener datos del servidor
    async function fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        return response.json();
    }

    // O: Open/Closed
    // Función que transforma los datos (puede extenderse sin modificar el código original)
    function transformCategories(categories) {
        return categories.map((category) => ({
            category_name: category.category_name,
            color: category.color,
            icon: category.icon,
            subcategories: category.subcategories
        }));
    }


    // Función que actualiza el DOM (S: Single Responsibility)
    function populateSelect(categories) {
        const select = document.getElementById('category-select');
        categories.forEach((category) => {
            console.log(category)
            const option = document.createElement('option');
            option.value = category.category_name;
            option.dataset.color = category.color;
            option.dataset.icono = category.icon;
            option.textContent = category.category_name;
            select.appendChild(option);
        });

        // Re-inicializar Materialize
        M.FormSelect.init(categorySelect);
    }

    // Ejecutar la carga de categorías
    //loadCategories();

    // Función para manejar el cambio en el select de categorías
    function onCategoryChange(event) {
        const categorySelect = event.target; // El select que disparó el evento
        console.log(categorySelect)
        console.log(categorySelect.value)
        const selectedCategory = categorySelect.value;
        const selectedOption = categorySelect.options[categorySelect.selectedIndex];

        // Obtener datos del ícono y el color seleccionados
        const icono = selectedOption.dataset.icono || 'help_outline';
        iconcSubcategorySelected = icono
        const color = selectedOption.dataset.color || 'black';
        colorSubcategorySelected = color


        console.log(icono)

        // Actualizar el ícono junto al select
        const categoryIcon = document.getElementById('category-icon');
        categoryIcon.textContent = icono; // Icono visual
        categoryIcon.style.color = color;

        // Limpiar el select de subcategorías
        const subcategorySelect = document.getElementById('subcategory-select');
        subcategorySelect.innerHTML = '<option value="" disabled selected>Selecciona una subcategoría</option>';

        // Buscar la categoría seleccionada en los datos
        const category = categoriesData.find(cat => cat.category_name === selectedCategory);

        console.log(category)

        // Agregar subcategorías al segundo select
        if (category) {
            category.subcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.name; // ID único de la subcategoría
                option.textContent = sub.name; // Nombre legible de la subcategoría
                subcategorySelect.appendChild(option);
            });
        }

        // Re-inicializar Materialize select
        M.FormSelect.init(subcategorySelect);
    }


    // D: Dependency Inversion
    // Función principal que usa las funciones anteriores para cargar y configurar todo
    async function initializeTransaction() {
        try {
            const url = './data/categories2.json';
            const rawCategories = await fetchData(url); // Carga los datos
            categoriesData = transformCategories(rawCategories); // Guarda los datos globalmente
            console.log(categoriesData)

            // Poblar el select de categorías
            populateSelect(categoriesData);

            // Asignar el evento al select de categorías
            // const categorySelect = document.getElementById('category-select-with-icons');
            categorySelect.addEventListener('change', onCategoryChange);
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }
    // Ejecutar la inicialización al cargar el script
    initializeTransaction();
})


/* Editar las transacciones------------------------------------ */




// Guardar transacciones en el localStorage
function saveTransactions(transactions) {
    localStorage.setItem(localStorageKey, JSON.stringify(transactions));
}

function loadTransactionToForm(transactionId) {
    const transactions = getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);

    if (!transaction) {

        console.error(`Transacción con ID ${transactionId} no encontrada.`);
        return;
    }

    // Cargar datos al formulario
    document.getElementById("transaction-id").value = transaction.id;
    document.getElementById("transaction-category").value = transaction.category;
    document.getElementById("transaction-amount").value = transaction.amount;
    document.getElementById("transaction-description").value = transaction.description;
    document.getElementById("transaction-date").value = transaction.date;
}


//guardar datos del formulario
function saveTransactionFromForm() {
    const transactions = getTransactions();

    // Leer datos del formulario
    const transactionId = parseInt(document.getElementById("transaction-id").value, 10);
    const updatedTransaction = {
        id: transactionId,
        category: document.getElementById("transaction-category").value,
        amount: parseFloat(document.getElementById("transaction-amount").value),
        description: document.getElementById("transaction-description").value,
        date: document.getElementById("transaction-date").value
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
}

// Simulación: Editar una transacción con ID = 1
document.addEventListener("DOMContentLoaded", () => {
    // Simular la carga de transacción
    loadTransactionToForm(1);
});


/* // Manejar el cambio en categorías
categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];

    // Obtener datos del ícono y el color seleccionados
    const icon = selectedOption.dataset.icono || 'help_outline';
    console.log(icon)
    const color = selectedOption.dataset.color || 'black';

    // Actualizar el ícono junto al select
    categoryIcon.textContent = icon;
    categoryIcon.style.color = color;

    // Limpiar el select de subcategorías
    subcategorySelect.innerHTML = '<option value="" disabled selected>Selecciona una subcategoría</option>';

    // Buscar la categoría seleccionada en el JSON
    const category = data.find(cat => cat.category_name === selectedCategory);

    // Agregar subcategorías al segundo select
    if (category) {
        category.subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.id; // ID único de la subcategoría
            option.textContent = sub.name; // Nombre legible de la subcategoría
            subcategorySelect.appendChild(option);
        });
    }

    // Re-inicializar Materialize select
    M.FormSelect.init(subcategorySelect);
}); */
/* }) */
