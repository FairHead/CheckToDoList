// Datenstruktur für Listen
let lists = [];
let currentListId = null;
let currentItemId = null;
let deleteType = null; // 'list' oder 'item'
let deleteListIndex = null;
let deleteItemIndex = null;

// Listen aus localStorage laden
function loadLists() {
    const saved = localStorage.getItem('todoLists');
    if (saved) {
        lists = JSON.parse(saved);
        renderLists();
    }
}

// Listen in localStorage speichern
function saveLists() {
    localStorage.setItem('todoLists', JSON.stringify(lists));
}

// Listen rendern
function renderLists() {
    const grid = document.getElementById('listsGrid');
    grid.innerHTML = '';
    
    lists.forEach((list, index) => {
        const listBox = document.createElement('div');
        listBox.className = 'list-box';
        
        let itemsHtml = '';
        list.items.forEach((item, itemIndex) => {
            itemsHtml += `
                <li>
                    <input type="checkbox" ${item.completed ? 'checked' : ''} 
                           onchange="toggleItem(${index}, ${itemIndex})">
                    <span class="item-text ${item.completed ? 'completed' : ''}">${item.text}</span>
                    <div class="item-actions">
                        <button onclick="showEditItemDialog(${index}, ${itemIndex})" title="Bearbeiten">
                            <i class="material-icons">edit</i>
                        </button>
                        <button onclick="showDeleteItemConfirm(${index}, ${itemIndex})" title="Löschen">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </li>
            `;
        });
        
        listBox.innerHTML = `
            <div class="list-box-header">
                <span>${list.name}</span>
                <button class="mdl-button mdl-js-button add-item-btn" onclick="showNewItemDialog(${index})">
                    <i class="material-icons" style="font-size: 18px;">add</i>
                </button>
            </div>
            <div class="list-box-content">
                <ul>${itemsHtml}</ul>
            </div>
            <div class="list-box-footer">
                <button onclick="showRenameListDialog(${index})" title="Umbenennen">
                    <i class="material-icons">edit</i>
                </button>
                <button class="delete-btn" onclick="showDeleteListConfirm(${index})" title="Liste löschen">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `;
        
        grid.appendChild(listBox);
    });
}

// Dialog für neue Liste anzeigen
function showNewListDialog() {
    document.getElementById('newListDialog').classList.add('active');
    document.getElementById('listNameInput').value = '';
    document.getElementById('listNameInput').focus();
}

// Dialog für neue Liste verstecken
function hideNewListDialog() {
    document.getElementById('newListDialog').classList.remove('active');
}

// Neue Liste erstellen
function createNewList() {
    const name = document.getElementById('listNameInput').value.trim();
    if (name) {
        lists.push({
            name: name,
            items: []
        });
        saveLists();
        renderLists();
        hideNewListDialog();
    }
}

// Dialog für neues Item anzeigen
function showNewItemDialog(listIndex) {
    currentListId = listIndex;
    document.getElementById('newItemDialog').classList.add('active');
    document.getElementById('itemInput').value = '';
    document.getElementById('itemInput').focus();
}

// Dialog für neues Item verstecken
function hideNewItemDialog() {
    document.getElementById('newItemDialog').classList.remove('active');
    currentListId = null;
}

// Item zur Liste hinzufügen
function addItemToList() {
    const text = document.getElementById('itemInput').value.trim();
    if (text && currentListId !== null) {
        lists[currentListId].items.push({
            text: text,
            completed: false
        });
        saveLists();
        renderLists();
        hideNewItemDialog();
    }
}

// Item als erledigt markieren/entmarkieren
function toggleItem(listIndex, itemIndex) {
    lists[listIndex].items[itemIndex].completed = !lists[listIndex].items[itemIndex].completed;
    saveLists();
    renderLists();
}

// === Liste umbenennen ===
function showRenameListDialog(listIndex) {
    currentListId = listIndex;
    document.getElementById('renameListDialog').classList.add('active');
    document.getElementById('renameListInput').value = lists[listIndex].name;
    document.getElementById('renameListInput').focus();
}

function hideRenameListDialog() {
    document.getElementById('renameListDialog').classList.remove('active');
    currentListId = null;
}

function renameList() {
    const newName = document.getElementById('renameListInput').value.trim();
    if (newName && currentListId !== null) {
        lists[currentListId].name = newName;
        saveLists();
        renderLists();
        hideRenameListDialog();
    }
}

// === Item bearbeiten ===
function showEditItemDialog(listIndex, itemIndex) {
    currentListId = listIndex;
    currentItemId = itemIndex;
    document.getElementById('editItemDialog').classList.add('active');
    document.getElementById('editItemInput').value = lists[listIndex].items[itemIndex].text;
    document.getElementById('editItemInput').focus();
}

function hideEditItemDialog() {
    document.getElementById('editItemDialog').classList.remove('active');
    currentListId = null;
    currentItemId = null;
}

function saveEditedItem() {
    const newText = document.getElementById('editItemInput').value.trim();
    if (newText && currentListId !== null && currentItemId !== null) {
        lists[currentListId].items[currentItemId].text = newText;
        saveLists();
        renderLists();
        hideEditItemDialog();
    }
}

// === Löschen bestätigen ===
function showDeleteListConfirm(listIndex) {
    deleteType = 'list';
    deleteListIndex = listIndex;
    document.getElementById('confirmDeleteTitle').textContent = 'Liste löschen';
    document.getElementById('confirmDeleteMessage').textContent = `Möchtest du die Liste "${lists[listIndex].name}" wirklich löschen?`;
    document.getElementById('confirmDeleteDialog').classList.add('active');
}

function showDeleteItemConfirm(listIndex, itemIndex) {
    deleteType = 'item';
    deleteListIndex = listIndex;
    deleteItemIndex = itemIndex;
    document.getElementById('confirmDeleteTitle').textContent = 'Item löschen';
    document.getElementById('confirmDeleteMessage').textContent = `Möchtest du "${lists[listIndex].items[itemIndex].text}" wirklich löschen?`;
    document.getElementById('confirmDeleteDialog').classList.add('active');
}

function hideConfirmDeleteDialog() {
    document.getElementById('confirmDeleteDialog').classList.remove('active');
    deleteType = null;
    deleteListIndex = null;
    deleteItemIndex = null;
}

function confirmDelete() {
    if (deleteType === 'list' && deleteListIndex !== null) {
        lists.splice(deleteListIndex, 1);
    } else if (deleteType === 'item' && deleteListIndex !== null && deleteItemIndex !== null) {
        lists[deleteListIndex].items.splice(deleteItemIndex, 1);
    }
    saveLists();
    renderLists();
    hideConfirmDeleteDialog();
}

// Enter-Taste für Dialoge
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (document.getElementById('newListDialog').classList.contains('active')) {
            createNewList();
        } else if (document.getElementById('newItemDialog').classList.contains('active')) {
            addItemToList();
        } else if (document.getElementById('renameListDialog').classList.contains('active')) {
            renameList();
        } else if (document.getElementById('editItemDialog').classList.contains('active')) {
            saveEditedItem();
        } else if (document.getElementById('confirmDeleteDialog').classList.contains('active')) {
            confirmDelete();
        }
    }
    if (e.key === 'Escape') {
        hideNewListDialog();
        hideNewItemDialog();
        hideRenameListDialog();
        hideEditItemDialog();
        hideConfirmDeleteDialog();
    }
});

// Beim Laden der Seite Listen laden
document.addEventListener('DOMContentLoaded', loadLists);