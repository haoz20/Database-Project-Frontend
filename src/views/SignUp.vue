<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp">
      <!-- Name -->
      <div class="input-group">
        <label for="name">Name</label>
        <input v-model="name" type="text" id="name" placeholder="Enter your name" required />
      </div>

      <!-- Email -->
      <div class="input-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" placeholder="Enter your email" required />
      </div>

      <!-- Password -->
      <div class="input-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Enter your password" required />
      </div>

      <!-- Role Selection -->
      <div class="input-group">
        <label for="role">Select Role</label>
        <select v-model="role" id="role" required>
          <option disabled value="">Select a role</option>
          <option value="CUSTOMER">Customer</option>
          <option value="PHOTOGRAPHER">Photographer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn">Sign Up</button>
    </form>

    <p>Already have an account? <router-link class="router-link" to="/">Login</router-link></p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "",
    };
  },
  methods: {
    handleSignUp() {
      if (this.name && this.email && this.password && this.role) {
        // Create sign up data object, ensuring role is uppercase
        const signUpData = {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role.toUpperCase(),
        };
        console.log("Sign-up Data:", signUpData);
        
        // Send POST request to the users endpoint
        axios.post("http://localhost:8080/api/users", signUpData)
          .then(response => {
            alert("Sign-up successful!");
            // Optionally, save data to localStorage if needed, e.g., email, userId, etc.
            // localStorage.setItem("userEmail", signUpData.email);
            this.$router.push("/");
          })
          .catch(error => {
            console.error("Sign-up error:", error);
            alert("Sign-up failed. Please try again.");
          });
      } else {
        alert("Please fill in all fields.");
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  text-align: center;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

h2 {
  color: orange;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid orange;
  border-radius: 5px;
  font-size: 1em;
}

.btn {
  background-color: orange;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
}

.btn:hover {
  background-color: darkorange;
}

p {
  margin-top: 15px;
  font-size: 0.9em;
}

.router-link {
  color: orange;
  font-weight: bold;
  text-decoration: none;
}
</style>
