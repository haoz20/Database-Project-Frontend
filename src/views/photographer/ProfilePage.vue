<template>
    <div class="profile-page">
      <h1>Profile</h1>
      <!-- Display Profile Information -->
      <div class="profile-info">
        <h2>Photographer Information</h2>
        <ul>
          <li><strong>Name:</strong> {{ profile.name }}</li>
          <li><strong>Email:</strong> {{ profile.email }}</li>
          <li><strong>Available to work in:</strong> {{ profile.availableToWorkIn }}</li>
          <li><strong>Rating:</strong> {{ profile.rating }}</li>
          <li><strong>Speciality:</strong> {{ profile.speciality }}</li>
          <li><strong>Category:</strong> {{ profile.category }}</li>
          <li>
            <strong>Portfolio:</strong>
            <a :href="profile.portfolio" target="_blank">{{ profile.portfolio }}</a>
          </li>
        </ul>
        <button @click="openModal" class="edit-btn">Edit Profile</button>
      </div>
  
      <!-- Edit Profile Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>Edit Profile</h2>
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" v-model="editProfile.name" required />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="editProfile.email" required />
            </div>
            <div class="form-group">
              <label for="availableToWorkIn">Available to work in:</label>
              <input
                type="text"
                id="availableToWorkIn"
                v-model="editProfile.availableToWorkIn"
                required
              />
            </div>
            <div class="form-group">
              <label for="speciality">Speciality:</label>
              <input type="text" id="speciality" v-model="editProfile.speciality" required />
            </div>
            <div class="form-group">
              <label for="category">Category:</label>
              <input type="text" id="category" v-model="editProfile.category" required />
            </div>
            <div class="form-group">
              <label for="portfolio">Portfolio URL:</label>
              <input type="url" id="portfolio" v-model="editProfile.portfolio" required />
            </div>
            <div class="modal-buttons">
              <button type="submit" class="update-btn">Save Changes</button>
              <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "ProfilePage",
    data() {
      return {
        profile: {
          name: "",
          email: "",
          availableToWorkIn: "",
          rating: 0,
          speciality: "",
          category: "",
          portfolio: "",
        },
        editProfile: {},
        showModal: false,
      };
    },
    async mounted() {
      // 1. Get userId from localStorage
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");
  
      // 2. If no userId or role is found, redirect to login (or handle error)
      if (!userId || userRole !== "PHOTOGRAPHER") {
        this.$router.push("/"); // or your login route
        return;
      }
  
      // 3. Fetch the photographer profile from your backend
      //    Suppose your endpoint is GET /api/photographers/:id
      try {
        const response = await axios.get(`http://localhost:8080/api/photographers/${userId}`);
        this.profile = response.data; // Assign the fetched data to profile
      } catch (error) {
        console.error("Failed to fetch photographer profile:", error);
        // handle error (e.g., show a message, redirect, etc.)
      }
    },
    methods: {
      openModal() {
        this.editProfile = { ...this.profile };
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async updateProfile() {
        try {
          // 1. PUT request to update the photographer's info
          //    Suppose your endpoint is PUT /api/photographers/:id
          const userId = localStorage.getItem("userId");
          const response = await axios.put(`http://localhost:8080/api/photographers/${userId}`, this.editProfile);
          // 2. Update local profile with response data
          this.profile = response.data;
          this.showModal = false;
          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Failed to update profile:", error);
          alert("An error occurred while updating profile.");
        }
      },
    },
  };
  </script>

<style scoped>
.profile-page {
    padding: 20px;
}

.profile-info {
    margin-bottom: 30px;
}

.profile-info ul {
    list-style: none;
    padding: 0;
}

.profile-info li {
    margin-bottom: 10px;
    text-align: left;
}

.edit-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.edit-btn:hover {
    background-color: #0056b3;
}

.modal-overlay {
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

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
}

.form-group label {
    font-weight: bold;
    margin-bottom: 5px;
    text-align: left;
    width: 100%;
}

.form-group input {
    width: 95%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.update-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.update-btn:hover {
    background-color: #45a049;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #e53935;
}
</style>
