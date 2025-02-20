<template>
  <div class="roles-container">
    <div class="roles-grid">
      <!-- Customer Role -->
      <div class="role-box" @click="navigateToRole('customer')">
        <p>Customer</p>
      </div>
      <!-- Photographer Role -->
      <div class="role-box" @click="navigateToRole('photographer')">
        <p>Photographer</p>
      </div>
      <!-- Admin Role -->
      <div class="role-box" @click="navigateToRole('admin')">
        <p>Admin</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RolesView",
  methods: {
    navigateToRole(role) {
      // Navigate to the respective route based on role
      this.$router.push(`/${role}`);
    },
  },
};
</script>

<style scoped>
.roles-container {
  text-align: center;
  margin: 50px auto;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.roles-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.role-box {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.role-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.2);
}

.role-box p {
  font-size: 18px;
  font-weight: bold;
  color: #555;
  margin: 0;
}
</style>
