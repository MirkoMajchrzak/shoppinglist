const itemInput = document.getElementById('itemInput');
const addButton = document.getElementById('addButton');
const itemList = document.getElementById('itemList');
const darkModeButton = document.getElementById('toggleDarkMode');

let items = JSON.parse(localStorage.getItem('items')) || [];

// Liste anzeigen
function renderItems() {
  itemList.innerHTML = '';

  items.forEach((item, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = item;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️';
    deleteButton.className = 'deleteButton';
    deleteButton.setAttribute('data-index', index);

    deleteButton.addEventListener('click', () => {
      items.splice(index, 1);
      saveItems();
      renderItems();
    });

    li.appendChild(span);
    li.appendChild(deleteButton);
    itemList.appendChild(li);
  });
}

// Speichern
function saveItems() {
  localStorage.setItem('items', JSON.stringify(items));
}

// Hinzufügen
addButton.addEventListener('click', () => {
  const newItem = itemInput.value.trim();
  if (newItem) {
    items.push(newItem);
    saveItems();
    renderItems();
    itemInput.value = '';
  }
});

// Dark Mode
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  darkModeButton.textContent = '☀️ Light Mode';
}

darkModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  darkModeButton.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Drag & Drop mit SortableJS
new Sortable(itemList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    delay: 200, // ⏱️ Wartezeit in ms
    delayOnTouchOnly: true, // Nur auf Touchgeräten (Smartphones/Tablets)
    onEnd: () => {
      const newOrder = Array.from(itemList.children).map(li =>
        li.querySelector('span').textContent.trim()
      );
      items = newOrder;
      saveItems();
    }
  });

renderItems();

// PWA Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registriert!'))
    .catch(error => console.error('Service Worker Fehler:', error));
}