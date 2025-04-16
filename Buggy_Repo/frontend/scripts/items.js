// Local storage key for storing items
const STORAGE_KEY = 'app_items';

// Helper function to generate unique IDs
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Load items from localStorage
function getItems() {
  const items = localStorage.getItem(STORAGE_KEY);
  return items ? JSON.parse(items) : [];
}

// Save items to localStorage
function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Display items on the page
function displayItems(searchTerm = '') {
  // Get current items
  let items = getItems();
  
  // Filter based on search term if provided
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    items = items.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.description.toLowerCase().includes(term)
    );
  }

  // Update the item count directly (no animation)
  const itemCountElement = document.getElementById('itemCounts');
  itemCountElement.textContent = `Total items: ${items.length}`;

  // Get the list element and clear it
  const list = document.getElementById('itemList');
  list.innerHTML = '';

  // Show message if no items
  if (items.length === 0) {
    list.innerHTML = `<li class="no-items">
      <i class="fas fa-info-circle"></i> 
      ${searchTerm ? "No items match your search" : "No items added yet"}
    </li>`;
    return;
  }

  // Add each item to the list
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'item-entry';
    
    // Create item content
    const itemContent = document.createElement('div');
    itemContent.className = 'item-content';
    
    const itemName = document.createElement('h3');
    itemName.textContent = item.name;
    
    const itemDesc = document.createElement('p');
    itemDesc.textContent = item.description;
    
    itemContent.appendChild(itemName);
    itemContent.appendChild(itemDesc);
    li.appendChild(itemContent);

    // Create action buttons
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    
    // Edit button
    const edit = document.createElement('button');
    edit.className = 'btn secondary btn-sm';
    edit.innerHTML = '<i class="fas fa-edit"></i>';
    edit.title = 'Edit Item';
    edit.onclick = () => editItem(item.id);
    
    // Delete button
    const del = document.createElement('button');
    del.className = 'btn danger btn-sm';
    del.innerHTML = '<i class="fas fa-trash-alt"></i>';
    del.title = 'Delete Item';
    del.onclick = () => {
      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        deleteItem(item.id);
      }
    };
    
    actions.appendChild(edit);
    actions.appendChild(del);
    li.appendChild(actions);
    
    list.appendChild(li);
  });
}

// Add a new item
function addItem(name, description) {
  // Create new item object
  const newItem = {
    id: generateId(),
    name: name,
    description: description,
    createdAt: new Date().toISOString()
  };

  // Get current items and add the new one
  const items = getItems();
  items.push(newItem);
  
  // Save updated items
  saveItems(items);
  
  // Show success notification
  showNotification('Item added successfully!', 'success');
  
  // Refresh display
  const searchTerm = document.getElementById('search').value;
  displayItems(searchTerm);
}

// Delete an item
function deleteItem(id) {
  // Get current items
  let items = getItems();
  
  // Filter out the item to delete
  items = items.filter(item => item.id !== id);
  
  // Save updated items
  saveItems(items);
  
  // Show success notification
  showNotification('Item deleted successfully!', 'success');
  
  // Refresh display
  const searchTerm = document.getElementById('search').value;
  displayItems(searchTerm);
}

// Edit an item
function editItem(id) {
  // Get the item to edit
  const items = getItems();
  const item = items.find(item => item.id === id);
  
  if (!item) return;
  
  // Fill the form with item data
  document.getElementById('itemname').value = item.name;
  document.getElementById('description').value = item.description;
  
  // Change button to update mode
  const submitButton = document.querySelector('#itemForm button[type="submit"]');
  submitButton.innerHTML = '<i class="fas fa-save"></i> Update Item';
  
  // Store the item ID in the button for later use
  submitButton.dataset.editId = id;
  
  // Scroll to form
  document.querySelector('.add-item-section').scrollIntoView({ behavior: 'smooth' });
}

// Update an existing item
function updateItem(id, name, description) {
  // Get current items
  let items = getItems();
  
  // Find the item index
  const index = items.findIndex(item => item.id === id);
  
  if (index !== -1) {
    // Update the item
    items[index].name = name;
    items[index].description = description;
    
    // Save updated items
    saveItems(items);
    
    // Show success notification
    showNotification('Item updated successfully!', 'success');
  }
  
  // Refresh display
  const searchTerm = document.getElementById('search').value;
  displayItems(searchTerm);
}

// Form submit handler (for both add and update)
document.getElementById('itemForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get values from form
  const name = document.getElementById('itemname').value.trim();
  const description = document.getElementById('description').value.trim();
  
  // Return if inputs are empty
  if (!name || !description) return;
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  
  // Check if we're in edit mode
  if (submitButton.dataset.editId) {
    // Update existing item
    updateItem(submitButton.dataset.editId, name, description);
    
    // Reset button to add mode
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Add Item';
    delete submitButton.dataset.editId;
  } else {
    // Add new item
    addItem(name, description);
  }
  
  // Reset form
  e.target.reset();
});

// Handle search input with debounce
let searchTimeout;
document.getElementById('search').addEventListener('input', function(e) {
  clearTimeout(searchTimeout);
  
  const searchTerm = e.target.value;
  
  // Show loading indicator
  if (searchTerm) {
    e.target.classList.add('searching');
  }
  
  searchTimeout = setTimeout(() => {
    displayItems(searchTerm);
    e.target.classList.remove('searching');
  }, 300);
});

// Notification system
function showNotification(message, type = 'info') {
  // Create notification container if it doesn't exist
  let notifications = document.querySelector('.notifications');
  if (!notifications) {
    notifications = document.createElement('div');
    notifications.className = 'notifications';
    document.body.appendChild(notifications);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  
  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;
  
  // Add to container
  notifications.appendChild(notification);
  
  // Remove after animation
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Load and display items
  displayItems();
  
  // Add sample items if none exist (first time visit)
  const items = getItems();
  if (items.length === 0) {
    addItem('Sample Item 1', 'This is a sample item to get you started');
    addItem('Sample Item 2', 'You can edit or delete this item');
  }
});