document.addEventListener("DOMContentLoaded", () => {
    CategoryApp.initialize();
});

// ** category **
const CategoryApp = (() => {
    const categoryList = document.getElementById('categoriesList');
    const localStorageKey = "categories";

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
        fetch('data/categories.json')
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
    const saveAccounts = (categories) => localStorage.setItem(localStorageKey, JSON.stringify(categories));

    // Función para cargar las cuentas en el DOM
    const loadAccounts = () => {
        categoryList.innerHTML = ''; // Limpiar el contenedor de la lista de cuentas
        const categories = getAccounts();
        console.log(categories)
        categories.forEach(addAccountToDOM);
    };

    // Función para agregar una cuenta al DOM
    const addAccountToDOM = (category) => {
        const categoryList = document.getElementById('categoriesList');
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');

        const iconContainer = document.createElement('div');
        iconContainer.classList.add('category-icon', category.color || 'teal');

        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.innerText = category.icon;
        //iconContainer.appendChild(icon);

        const name = document.createElement('div');
        //name.classList.add('category-details');
        name.innerText = 'hola'

        iconContainer.appendChild(icon);
        iconContainer.appendChild(icon);

        const details = document.createElement('div');
        details.classList.add('category-details');
        details.innerHTML = `
            <span>${category.name}</span>
            <span class="category-date"> ${category.category_id}</span>
        `;

        const amount = document.createElement('span');
        amount.classList.add('category-amount', 'grey-text');
        amount.innerText = `${category.id}`;

        categoryItem.appendChild(iconContainer);
        categoryItem.appendChild(details);
        categoryItem.appendChild(amount);

        categoryItem.appendChild(amount);
        categoryList.prepend(categoryItem);


    };

    return {
        initialize
    };
})();