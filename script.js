// Elemente holen
const itemInput = document.getElementById('itemInput');
const addButton = document.getElementById('addButton');
const itemList = document.getElementById('itemList');

// Items laden oder leeres Array
let items = JSON.parse(localStorage.getItem('items')) || [];

// Liste anzeigen
function renderItems() {
    itemList.innerHTML = '';

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item}
            <button class="deleteButton" data-index="${index}">🗑️</button>
        `;
        itemList.appendChild(li);
    });

    // Eventlistener für alle Lösch-Buttons
    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            items.splice(index, 1);
            saveItems();
            renderItems();
        });
    });
}

// Items speichern
function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}

// Neues Item hinzufügen
addButton.addEventListener('click', () => {
    const newItem = itemInput.value.trim();
    if (newItem) {
        items.push(newItem);
        saveItems();
        renderItems();
        itemInput.value = '';
    }
});

// App starten
renderItems();

// Service Worker Registrierung
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service Worker registriert!'))
      .catch(error => console.error('Service Worker Fehler:', error));
  }

  // 🌗 Dark Mode Handling
const darkModeButton = document.getElementById('toggleDarkMode');

// Beim Laden: gespeicherten Zustand anwenden
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeButton.textContent = '☀️ Light Mode';
}

// Toggle Funktion
darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);

    darkModeButton.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});