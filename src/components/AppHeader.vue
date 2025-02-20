<template>
  <header class="header">
    <h1 class="title">Studiosphere</h1>
    <button class="user-icon">
      <i class="bi bi-person-circle"></i>
    </button>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px; /* Horizontal padding only */
  background-color: white;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 60px; /* Fixed height */
}

.title {
  font-family: "Playfair Display", serif;
  font-size: 2.5rem; /* Adjust font size if needed */
  color: #ff6600; /* Orange color */
  font-weight: bold;
  margin: 0; /* Remove default margin */
}

.user-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.8rem; /* Size of the icon */
  color: #000; /* Icon color */
  margin: 0; /* Remove any default margin */
  padding: 0; /* Remove any default padding */
}
</style>
