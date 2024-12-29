document.addEventListener('DOMContentLoaded', function () {
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

    // Capturar el formulario
    const transactionForm = document.getElementById('transactionForm');

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
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const transactionList = document.getElementById('transactionList');
    const saveButton = document.getElementById('saveTransaction');

    // Función para agregar una nueva transacción al DOM
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
        iconContainer.classList.add(transaction.iconColor || 'teal');
        //iconContainer.style.backgroundColor = transaction.iconColor || 'red';

        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.innerText = "house" || '💵';
        iconContainer.appendChild(icon)

        const details = document.createElement('div');
        details.classList.add('transaction-details');

        const title = document.createElement('span');
        title.innerText = transaction.category;

        const subtitle = document.createElement('span');
        subtitle.classList.add('transaction-date');
        subtitle.innerText = `${transaction.account} - ${transaction.date}`;



        details.appendChild(title);
        details.appendChild(subtitle);

        transactionInfo.appendChild(iconContainer);
        transactionInfo.appendChild(details);

        const amount = document.createElement('span');
        amount.classList.add('transaction-amount');
        amount.innerText = `${transaction.type === 'gasto' ? '-' : '+'}CLP ${transaction.amount}`;

        transactionItem.appendChild(transactionInfo);
        transactionItem.appendChild(amount);

        transactionList.prepend(transactionItem);
    }

    // Función para cargar todas las transacciones del localStorage
    function loadTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.forEach(addTransactionToDOM);
        console.log(transactions)
    }

    // Función para guardar una nueva transacción en localStorage
    function saveTransaction(transaction) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Evento al hacer clic en "Guardar"
    saveButton.addEventListener('click', function (e) {
        e.preventDefault(); // Evitar el comportamiento por defecto del formulario

        // Obtener los valores del formulario
        const amount = parseFloat(document.getElementById('amount').value);
        const account = document.getElementById('account').value;
        const category = document.getElementById('category').value;
        const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
        const date = document.getElementById('date').value;

        if (!amount || !account || !category || !transactionType || !date) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        console.log("category", category)

        // Crear el objeto de transacción
        const newTransaction = {
            category,
            account,
            date,
            amount,
            type: transactionType,
            icon: category === 'food' ? '🍔' : category === 'education' ? '📘' : '💵', // Ejemplo dinámico
            //iconColor: category === 'food' ? '#FF5722' : category === 'education' ? '#4CAF50' : '#9E9E9E',
            iconColor: "",
        };

        // Guardar en localStorage y pintar en pantalla
        saveTransaction(newTransaction);
        addTransactionToDOM(newTransaction);

        // Limpiar el formulario
        document.getElementById('transactionForm').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0]; // Restaurar fecha por defecto
    });

    // Cargar transacciones al iniciar
    loadTransactions();
});


// Elemento <select> del formulario---------------------------------------------

/*     const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory-select'); */
// Fetch para cargar las categorías
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const subcategorySelect = document.getElementById('subcategory-select');
    const categoryIcon = document.getElementById('category-icon');
    let iconSelected, colorSelected

    // Inicializar los selects de Materialize
    M.FormSelect.init(categorySelect);



    // Re-inicializar el select
    M.FormSelect.init(categorySelect);

    M.FormSelect.init(subcategorySelect);

    // Cargar datos desde el JSON
    fetch('./data/categories2.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el archivo JSON');
            return response.json();
        })
        .then(data => {
            console.log(data)
            // Poblar el select de categorías
            data.forEach(category => {


                const option = document.createElement('option');
                option.value = category.category_name; // Usamos el nombre como valor
                option.textContent = category.category_name;
                option.dataset.icono = category.icon; // Guardar el ícono en un atributo personalizado
                option.dataset.color = category.color; // Guardar el color en un atributo personalizado
                categorySelect.appendChild(option);
            });

            // Re-inicializar Materialize select
            M.FormSelect.init(categorySelect);

            // Manejar el cambio en categorías
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
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
});