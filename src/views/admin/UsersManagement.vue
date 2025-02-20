<template>
  <div class="users-management">
    <!-- Search Bar and Filter -->
    <div class="search-filter">
      <input v-model="searchQuery" type="text" placeholder="Search by name, email, or ID" class="search-input" />
      <button @click="searchUsers">Search</button>
      <button @click="filterUsers('All')">All</button>
      <button @click="filterUsers('Customer')">Customers</button>
      <button @click="filterUsers('Photographer')">Photographers</button>
      <button @click="filterUsers('Admin')">Admins</button>
    </div>
    <!-- Users Table -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <div class="action-buttons">
              <button @click="viewUser(user)">View</button>
              <button @click="editUser(user)">Edit</button>
              <button @click="openDeleteModal(user)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination Controls -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

    <!-- View Modal Window -->
    <div v-if="selectedUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>User Details</h2>
        <p><strong>ID:</strong> {{ selectedUser.id }}</p>
        <p><strong>Name:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Role:</strong> {{ selectedUser.role }}</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>

    <!-- Edit Modal Window -->
    <div v-if="editingUser" class="edit-modal-overlay" @click="closeEditModal">
      <div class="edit-modal-content" @click.stop>
        <form @submit.prevent="saveUserEdit">
          <!-- Name Field -->
          <div class="edit-form-group">
            <label for="editName" class="edit-label">Name:</label>
            <input id="editName" v-model="editingUser.name" class="edit-input" type="text" required />
          </div>

          <!-- Email Field -->
          <div class="edit-form-group">
            <label for="editEmail" class="edit-label">Email:</label>
            <input id="editEmail" v-model="editingUser.email" class="edit-input" type="email" required />
          </div>

          <!-- Role Field -->
          <div class="edit-form-group">
            <label for="editRole" class="edit-label">Role:</label>
            <select id="editRole" v-model="editingUser.role" class="edit-select" required>
              <option value="Customer">Customer</option>
              <option value="Photographer">Photographer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="edit-modal-buttons">
            <button type="submit" class="btn btn-save">Save</button>
            <button type="button" class="btn btn-cancel" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- Delete Modal Window -->
  <div v-if="deletingUser" class="delete-modal-overlay" @click="closeDeleteModal">
    <div class="delete-modal-content" @click.stop>
      <h2 class="delete-title">Delete User</h2>
      <p>Do you want to permanently delete this user?</p>
      <div class="delete-modal-buttons">
        <button type="button" class="btn btn-confirm" @click="confirmDelete">Confirm</button>
        <button type="button" class="btn btn-cancel" @click="closeDeleteModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UsersManagement",
  data() {
    return {
      users: [
        { id: 1, name: "Somchai Suksawat", email: "somchai@example.com", role: "Customer" },
        { id: 2, name: "Prasert Boonyarit", email: "prasert@example.com", role: "Photographer" },
        { id: 3, name: "Siriporn Meechai", email: "siriporn@example.com", role: "Admin" },
      ],
      searchQuery: "",
      filterRole: "All",
      currentPage: 1,
      itemsPerPage: 5,
      selectedUser: null, // For view modal
      editingUser: null, // For edit modal
      deletingUser: null,
    };
  },
  computed: {
    filteredUsers() {
      let result = this.users;
      if (this.filterRole !== "All") {
        result = result.filter(user => user.role === this.filterRole);
      }
      if (this.searchQuery) {
        result = result.filter(user =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          String(user.id).includes(this.searchQuery)
        );
      }
      return result;
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
  },
  methods: {
    viewUser(user) {
      this.selectedUser = user;
    },
    editUser(user) {
      this.editingUser = { ...user }; // Create a copy of the user to edit
    },
    saveUserEdit() {
      const index = this.users.findIndex(u => u.id === this.editingUser.id);
      if (index !== -1) {
        this.users.splice(index, 1, this.editingUser);
      }
      this.closeEditModal();
    },
    deleteUser(id) {
      console.log("Delete user", id);
    },
    searchUsers() {
      this.currentPage = 1;
    },
    filterUsers(role) {
      this.filterRole = role;
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    closeModal() {
      this.selectedUser = null;
    },
    closeEditModal() {
      this.editingUser = null;
    },
    openDeleteModal(user) {
      this.deletingUser = user; // Simulate the deletion process
    },
    closeDeleteModal() {
      this.deletingUser = null; // Close the modal without action
    },
    confirmDelete() {
      // Simulate deletion (demo)
      console.log(`User to be deleted: ${this.deletingUser.name}`);
      alert(`Demo: User "${this.deletingUser.name}" will be deleted.`);
      this.deletingUser = null; // Close the modal after confirmation
    },
  },
};
</script>

<style scoped>
.users-management {
  padding: 20px;
}

.search-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 1rem;
  text-align: center;
  border: 1px solid #ddd;
}

td button {
  margin: 3%;
}

th {
  background-color: #f4f4f4;
}

.action-buttons button {
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 3%;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.modal-content form div {
  margin-bottom: 15px;
  /* Add spacing between each field */
  display: inline;
  flex-direction: column;
  align-items: flex-start;
}

.modal-content form label {
  margin-bottom: 5px;
  /* Add space between label and input */
  font-weight: bold;
}

.modal-content button {
  padding: 10px 20px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content form input,
.modal-content form select {
  width: 95%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}


/* Overlay */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.edit-modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 450px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: left;
}

/* Form Group */
.edit-form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
}

/* Label */
.edit-label {
  flex: 1;
  text-align: right;
  margin-right: 15px;
  font-weight: 600;
  color: #333;
}

/* Input */
.edit-input {
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

/* Select Dropdown */
.edit-select {
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

/* Buttons */
.edit-modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* Overlay */
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.delete-modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* Modal Title */
.delete-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Modal Buttons */
.delete-modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-confirm {
  background-color: #4bb40e;
  color: white;
}

.btn-confirm:hover {
  background-color: #23dd19;
}


.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-save:hover {
  background-color: #218838;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
}

.btn-cancel:hover {
  background-color: #c82333;
}

p {
  text-align: left;
}
</style>