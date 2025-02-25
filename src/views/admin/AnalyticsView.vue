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
            <span>{{ analyticsUsers.totalPhotographers }}</span>
          </div>
          <div class="stat-item">
            <span>Total Customers:</span>
            <span>{{ analyticsUsers.totalCustomers }}</span>
          </div>
        </div>
      </div>
  
      <!-- Bookings Panel -->
      <div class="panel bookings-panel">
        <h2>Bookings</h2>
        <div class="panel-content">
          <div class="stat-item">
            <span>Total Bookings:</span>
            <span>{{ analyticsBookings.totalBookings }}</span>
          </div>
          <div class="stat-item">
            <span>Upcoming Bookings:</span>
            <span>{{ analyticsBookings.upcomingBookings }}</span>
          </div>
          <div class="stat-item">
            <span>Cancelled Bookings:</span>
            <span>{{ analyticsBookings.cancelledBookings }}</span>
          </div>
          <div class="stat-item">
            <span>Most Active Booking Day:</span>
            <span>{{ analyticsBookings.mostActiveBookingDay }}</span>
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
            <td>{{ photographer.bookingsAccepted || "—" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
export default {
  name: "AnalyticsView",
  data() {
    return {
      analyticsUsers: {
        totalPhotographers: 0,
        totalCustomers: 0
      },
      analyticsBookings: {
        totalBookings: 0,
        upcomingBookings: 0,
        cancelledBookings: 0,
        mostActiveBookingDay: "N/A"
      },
      topPhotographers: []
    };
  },
  methods: {
    fetchUsersAnalytics() {
      axios.get("http://localhost:8080/api/analytics/users")
        .then(response => {
          this.analyticsUsers = response.data;
        })
        .catch(error => {
          console.error("Error fetching user analytics:", error);
        });
    },
    fetchBookingsAnalytics() {
      axios.get("http://localhost:8080/api/analytics/bookings")
        .then(response => {
          this.analyticsBookings = response.data;
        })
        .catch(error => {
          console.error("Error fetching booking analytics:", error);
        });
    },
    fetchTopPhotographers() {
      axios.get("http://localhost:8080/api/analytics/top-photographers")
        .then(response => {
          this.topPhotographers = response.data;
        })
        .catch(error => {
          console.error("Error fetching top photographers:", error);
        });
    },
    fetchAnalyticsData() {
      this.fetchUsersAnalytics();
      this.fetchBookingsAnalytics();
      this.fetchTopPhotographers();
    }
  },
  mounted() {
    this.fetchAnalyticsData();
  }
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

table th,
table td {
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
