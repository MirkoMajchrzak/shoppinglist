const itemInput = document.getElementById('itemInput');
const addButton = document.getElementById('addButton');
const itemList = document.getElementById('itemList');
const darkModeButton = document.getElementById('toggleDarkMode');

let items = JSON.parse(localStorage.getItem('items')) || [];

// Liste anzeigen
function renderItems() {
  itemList.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.dataset.id = item.id;

    const grip = document.createElement('span');
    grip.className = 'drag-handle';
    grip.textContent = '☰';

    const span = document.createElement('span');
    span.textContent = item.text;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️';
    deleteButton.className = 'deleteButton';

    deleteButton.addEventListener('click', () => {
      items = items.filter(i => i.id !== item.id);
      saveItems();
      renderItems();
    });

    li.appendChild(grip);
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
    items.push({
      id: crypto.randomUUID(), // Eindeutige ID
      text: newItem
    });
    saveItems();
    renderItems();
  }
  itemInput.value = '';
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

// Initiales Rendern + Sortable aktivieren
renderItems();

new Sortable(itemList, {
  animation: 150,
  handle: '.drag-handle',
  delay: 200,
  delayOnTouchOnly: true,
  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  onEnd: () => {
    const newOrder = Array.from(itemList.children).map(li => li.dataset.id);
    items = newOrder.map(id => items.find(item => item.id === id));
    saveItems();
  }
});

// PWA Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registriert!'))
    .catch(error => console.error('Service Worker Fehler:', error));
}
