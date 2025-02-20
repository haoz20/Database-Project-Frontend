<template>
    <aside class="sidebar">
      <ul class="menu">
        <li><router-link to="/admin/users-management">Users Management</router-link></li>
        <li><router-link to="/admin/issues">Issues</router-link></li>
        <li><router-link to="/admin/analytics">Analytics</router-link></li>
      </ul>
    </aside>
  </template>
  
  <script>
  export default {
    name: "SidebarMenu",
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #f8f9fa;
    height: 100vh;
    padding: 2.5%;
    position: fixed;
    top: 0;
    left: 0;
    border-right: 1px solid #ddd;
  }
  
  .menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .menu li {
    margin-bottom: 40px;
  }
  
  .menu li a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    font-size: 1rem;
  }
  
  .menu li a:hover {
    color: #ff6600;
  }
  </style>
  