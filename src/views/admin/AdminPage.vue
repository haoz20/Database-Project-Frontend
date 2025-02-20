<template>
    <div class="layout">
      <header class="header">
        <AppHeader />
      </header>
      <div class="content">
        <aside class="sidebar">
          <SidebarMenu />
        </aside>
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import AppHeader from "@/components/AppHeader.vue";
  import SidebarMenu from "@/components/Sidebar.vue";
  
  export default {
    name: "AdminLayout",
    components: {
      AppHeader,
      SidebarMenu,
    },
  };
  </script>
  
  <style scoped>
  /* Main layout container */
  .layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
  }
  
  /* Header styling */
  .header {
    height: 64px;
    flex-shrink: 0;
    background-color: white;
    border-bottom: 1px solid #ddd;
    position: sticky;
    top: 0;
    z-index: 10; /* Ensure header stays on top */
  }
  
  /* Main content area: sidebar + page content */
  .content {
    display: flex;
    flex: 1;
    overflow: hidden; /* Prevent unwanted scrolls */
  }
  
  /* Sidebar styling */
  .sidebar {
    width: 250px;
    background-color: #f8f9fa;
    border-right: 1px solid #ddd;
    height: 100%;
    position: sticky;
    top: 64px; /* Offset the height of the header */
    flex-shrink: 0;
    z-index: 5;
  }
  
  /* Page content styling */
  .main-content {
    flex: 1;
    background-color: #ffffff;
    overflow-y: auto; /* Enable scrolling if content overflows */
    padding: 20px;
  }
  </style>
  