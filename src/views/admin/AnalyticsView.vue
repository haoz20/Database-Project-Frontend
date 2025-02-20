<template>
    <div class="analytics-view">
      <!-- Top Two Panels -->
      <div class="top-panels">
        <!-- Users Panel -->
        <div class="panel users-panel">
          <h2>Users</h2>
          <div class="panel-content">
            <div class="stat-item">
              <span>Total Photographers:</span>
              <span>100</span>
            </div>
            <div class="stat-item">
              <span>Total Customers:</span>
              <span>100</span>
            </div>
            <div class="stat-item">
              <span>New Users This Month:</span>
              <span>30</span>
            </div>
            <div class="stat-item">
              <span>Percentage Increase:</span>
              <span>10%</span>
            </div>
          </div>
        </div>
  
        <!-- Bookings Panel -->
        <div class="panel bookings-panel">
          <h2>Bookings</h2>
          <div class="panel-content">
            <div class="stat-item">
              <span>Total Bookings:</span>
              <span>100</span>
            </div>
            <div class="stat-item">
              <span>Upcoming Bookings:</span>
              <span>100</span>
            </div>
            <div class="stat-item">
              <span>Cancelled Bookings:</span>
              <span>30</span>
            </div>
            <div class="stat-item">
              <span>Most Active Booking Day:</span>
              <span>2024/11/23</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Top 5 Photographers Table -->
      <div class="top-photographers">
        <h2>Top 5 Photographers</h2>
        <table>
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Photographer Name</th>
              <th>Photographer Email</th>
              <th>Total Bookings Accepted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(photographer, index) in topPhotographers" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ photographer.name || "—" }}</td>
              <td>{{ photographer.email || "—" }}</td>
              <td>{{ photographer.bookings || "—" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AnalyticsView",
    data() {
      return {
        topPhotographers: [
          {
            name: "Prasert Boonyarit",
            email: "prasert.boonyarit@example.com",
            bookings: 50,
          },
          {}, // Add empty objects to represent unfilled rankings
          {},
          {},
          {},
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* General Layout */
  .analytics-view {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  /* Top Panels */
  .top-panels {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .panel {
    flex: 1;
    padding: 20px;
    border-radius: 8px;
    background-color: #f0f0f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .panel h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
  
  .panel-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 500;
  }
  
  /* Top Photographers Table */
  .top-photographers {
    margin-top: 20px;
  }
  
  .top-photographers h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table th, table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  table th {
    background-color: #f4f4f4;
  }
  
  table td {
    background-color: #f9f9f9;
  }
  </style>
  