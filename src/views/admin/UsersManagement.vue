<template>
  <div class="users-management">
    <!-- Search Bar and Filter -->
    <div class="search-filter">
      <input v-model="searchQuery" type="text" placeholder="Search by name, email, or ID" class="search-input" />
      <button @click="searchUsers">Search</button>
      <button @click="filterUsers('All')">All</button>
      <button @click="filterUsers('CUSTOMER')">Customers</button>
      <button @click="filterUsers('PHOTOGRAPHER')">Photographers</button>
      <button @click="filterUsers('ADMIN')">Admins</button>
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
              <option value="CUSTOMER">Customer</option>
              <option value="PHOTOGRAPHER">Photographer</option>
              <option value="ADMIN">Admin</option>
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
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UsersManagement",
  data() {
    return {
      users: [],
      searchQuery: "",
      filterRole: "All",
      currentPage: 1,
      itemsPerPage: 5,
      selectedUser: null, // For view modal
      editingUser: null,  // For edit modal
      deletingUser: null, // For delete modal
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
    fetchUsers() {
      axios.get("http://localhost:8080/api/users")
        .then(response => {
          // Map backend response to include an 'id' property and force role to upper case.
          this.users = response.data.map(user => ({
            id: user.id || user.userId, // Use 'userId' if 'id' is not available.
            name: user.name,
            email: user.email,
            role: user.role ? user.role.toUpperCase() : ""
          }));
        })
        .catch(error => {
          console.error("Error fetching users:", error);
          alert("Failed to fetch users from backend.");
        });
    },
    searchUsers() {
      this.currentPage = 1;
      // Local filtering is handled in computed property.
    },
    filterUsers(role) {
      this.filterRole = role;
      this.currentPage = 1;
    },
    viewUser(user) {
      this.selectedUser = user;
    },
    editUser(user) {
      // Create a shallow copy of the user to edit and force the role to uppercase.
      this.editingUser = { ...user, role: user.role.toUpperCase() };
    },
    saveUserEdit() {
      axios.put(`http://localhost:8080/api/users/${this.editingUser.id}`, this.editingUser)
        .then(response => {
          const index = this.users.findIndex(u => u.id === this.editingUser.id);
          if (index !== -1) {
            this.users.splice(index, 1, {
              ...response.data,
              // Ensure role is in uppercase
              role: response.data.role ? response.data.role.toUpperCase() : ""
            });
          }
          this.closeEditModal();
          alert("User updated successfully.");
        })
        .catch(error => {
          console.error("Error updating user:", error);
          alert("Failed to update user.");
        });
    },
    openDeleteModal(user) {
      this.deletingUser = user;
    },
    closeModal() {
      this.selectedUser = null;
    },
    closeEditModal() {
      this.editingUser = null;
    },
    closeDeleteModal() {
      this.deletingUser = null;
    },
    confirmDelete() {
      axios.delete(`http://localhost:8080/api/users/${this.deletingUser.id}`)
        .then(() => {
          alert(`User "${this.deletingUser.name}" has been deleted.`);
          this.users = this.users.filter(u => u.id !== this.deletingUser.id);
          this.deletingUser = null;
        })
        .catch(error => {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
        });
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
    goToPage(page) {
      this.currentPage = page;
    },
  },
  mounted() {
    this.fetchUsers();
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

.modal-overlay,
.edit-modal-overlay,
.delete-modal-overlay {
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

.modal-content,
.edit-modal-content,
.delete-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.edit-modal-content {
  width: 450px;
  text-align: left;
}

.edit-form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
}

.edit-label {
  flex: 1;
  text-align: right;
  margin-right: 15px;
  font-weight: 600;
  color: #333;
}

.edit-input {
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.edit-select {
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.edit-modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.delete-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.delete-modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
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

.btn-confirm {
  background-color: #4bb40e;
  color: white;
}

.btn-confirm:hover {
  background-color: #23dd19;
}

p {
  text-align: left;
}
</style>
