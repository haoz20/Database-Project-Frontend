<template>
  <div class="container">
    <div class="logo">
      <h1>Studiosphere</h1>
    </div>
    <form class="login-form" @submit.prevent="handleLogin">
      <div class="input-group">
        <input
          v-model="username"
          type="text"
          placeholder="username or email address"
          class="input-field"
          required
        />
      </div>
      <div class="input-group">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="password"
          class="input-field"
          required
        />
        <button type="button" class="show-password" @click="togglePasswordVisibility">
          {{ showPassword ? "Hide" : "Show" }}
        </button>
      </div>
      <button type="submit" class="btn">Sign in</button>
      <p v-if="errorMessage" style="color:red">{{ errorMessage }}</p>
    </form>
    <div class="signup-link">
      <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      errorMessage: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Fetch all users from the backend
        const response = await axios.get('http://localhost:8080/api/users');
        const users = response.data;
        
        // Find the user by matching username/email and password.
        // Note: This assumes your User object contains a "password" field (not recommended for production).
        const foundUser = users.find(user =>
          (user.email === this.username || user.name === this.username) &&
          user.password === this.password
        );
        
        if (foundUser) {
          // Store the user's role in localStorage for role-based redirection
          localStorage.setItem("userRole", foundUser.role);
          localStorage.setItem("userId", foundUser.userId);
          
          // Redirect based on role
          if (foundUser.role === "ADMIN") {
            this.$router.push("/admin");
          } else if (foundUser.role === "PHOTOGRAPHER") {
            this.$router.push("/photographer");
          } else if (foundUser.role === "CUSTOMER") {
            this.$router.push("/customer");
          } else {
            this.$router.push("/home");
          }
        } else {
          this.errorMessage = "Invalid username or password.";
        }
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = "An error occurred during login.";
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  margin: auto;
  padding: 20px;
  max-width: 400px;
  font-family: "Inter", sans-serif;
}
.logo h1 {
  font-family: "Playfair Display", serif;
  color: orange;
  font-size: 2.5em;
  margin-bottom: 20px;
}
.input-group {
  margin: 15px 0;
}
.input-field {
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
.signup-link p {
  margin-top: 20px;
  font-size: 0.9em;
}
.signup-link a {
  color: orange;
  text-decoration: none;
  font-weight: bold;
}
</style>
