// Define baseURL if needed - assuming the API is on the same server
const baseURL = 'http://localhost:8000'; // adding baseURL by divya

async function loadUsers() {
  try {
    const res = await fetch(`${baseURL}/users`);
    const users = await res.json();
    const list = document.getElementById("userList");
    list.innerHTML = "";
    
    document.getElementById("userCounts").textContent = `Total users: ${users.length}`;
    
    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.username}: ${user.bio}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = async () => {
        await fetch(`${baseURL}/users/${user._id}`, { method: "DELETE" });
        loadUsers();
      };

      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

document.getElementById("search").addEventListener("input", async (e) => {
  try {
    const term = e.target.value.toLowerCase();
    const res = await fetch(`${baseURL}/users`);
    const users = await res.json();
    const list = document.getElementById("userList");
    list.innerHTML = "";

    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(term));
    document.getElementById("userCounts").textContent = `Total users: ${filteredUsers.length}`;

    filteredUsers.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.username}: ${user.bio}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = async () => {
        await fetch(`${baseURL}/users/${user._id}`, { method: "DELETE" });
        loadUsers();
      };

      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error searching users:", error);
  }
});

// Load users when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const username = document.getElementById("username").value;
    const bio = document.getElementById("bio").value;
    await fetch(`${baseURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bio })
    }
  );
    e.target.reset();
    loadUsers();
  } catch (error) {
    console.error("Error adding user:", error);
  }
});