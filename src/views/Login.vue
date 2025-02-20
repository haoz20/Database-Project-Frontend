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
        <button
          type="button"
          class="show-password"
          @click="togglePasswordVisibility"
        >
          {{ showPassword ? "Hide" : "Show" }}
        </button>
      </div>
      <button type="submit" class="btn">Sign in</button>
    </form>
    <div class="signup-link">
      <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    handleLogin() {
      const staticUsername = "admin";
      const staticPassword = "password123";

      if (
        this.username === staticUsername &&
        this.password === staticPassword
      ) {
        localStorage.setItem("userRole", "admin"); // Store role for further use
        this.$router.push("/roles"); // Redirect to RolesView
      } else {
        this.errorMessage = "Invalid username or password.";
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
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
