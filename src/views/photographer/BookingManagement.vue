<template>
    <div class="booking-management">
      <h1>Booking Management</h1>
  
      <!-- Filter Buttons -->
      <div class="filter-buttons">
        <button @click="filterByStatus('All')" :class="{ active: selectedStatus === 'All' }">All</button>
        <button @click="filterByStatus('Pending')" :class="{ active: selectedStatus === 'Pending' }">Pending</button>
        <button @click="filterByStatus('Booked')" :class="{ active: selectedStatus === 'Booked' }">Booked</button>
        <button @click="filterByStatus('Cancelled')" :class="{ active: selectedStatus === 'Cancelled' }">Cancelled</button>
      </div>
  
      <!-- Booking Table -->
      <table class="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Speciality</th>
            <th>Category</th>
            <th>Event Location</th>
            <th>Booking Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in filteredBookings" :key="booking.bookingId">
            <td>{{ booking.bookingId }}</td>
            <td>{{ booking.eventDate }}</td>
            <td>{{ booking.customerName }}</td>
            <td>{{ booking.speciality }}</td>
            <td>{{ booking.category }}</td>
            <td>{{ booking.eventLocation }}</td>
            <td>
              <span :class="getStatusClass(booking.bookingStatus)">{{ booking.bookingStatus }}</span>
            </td>
            <td class="buttons">
              <!-- Example actions: confirm or cancel booking -->
              <button v-if="booking.bookingStatus === 'Pending'" @click="confirmBooking(booking.bookingId)" class="confirm-btn">Confirm</button>
              <button v-if="booking.bookingStatus === 'Pending'" @click="cancelBooking(booking.bookingId)" class="cancel-btn">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "BookingManagement",
    data() {
      return {
        bookings: [],
        selectedStatus: "All",
      };
    },
    computed: {
      filteredBookings() {
        if (this.selectedStatus === "All") return this.bookings;
        return this.bookings.filter((booking) => booking.bookingStatus === this.selectedStatus);
      },
    },
    methods: {
      filterByStatus(status) {
        this.selectedStatus = status;
      },
      getStatusClass(status) {
        switch (status) {
          case "Pending":
            return "status-pending";
          case "Booked":
            return "status-booked";
          case "Cancelled":
            return "status-cancelled";
          default:
            return "";
        }
      },
      async fetchBookings() {
        try {
          // Get logged in photographer's id from localStorage
          const photographerId = localStorage.getItem("userId");
          // Fetch bookings for the logged in photographer
          const response = await axios.get(`http://localhost:8080/api/bookings/photographer/${photographerId}`);
          this.bookings = response.data;
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      },
      // Example methods for confirming or canceling bookings
      async confirmBooking(bookingId) {
  try {
    const photographerId = localStorage.getItem("userId"); // The logged-in photographer
    const response = await axios.put(`http://localhost:8080/api/bookings/${bookingId}/confirm`, null, {
      params: { photographerId },
    });
    // After successful update, refetch or update the local array
    this.fetchBookings();
  } catch (error) {
    console.error("Error confirming booking:", error);
  }
},

async cancelBooking(bookingId) {
  try {
    const photographerId = localStorage.getItem("userId");
    const response = await axios.put(`http://localhost:8080/api/bookings/${bookingId}/cancel`, null, {
      params: { photographerId },
    });
    this.fetchBookings();
  } catch (error) {
    console.error("Error canceling booking:", error);
  }
},

    },
    mounted() {
      this.fetchBookings();
    },
  };
  </script>
  
  <style scoped>
  .booking-management {
    padding: 20px;
  }
  
  .filter-buttons {
    margin-bottom: 20px;
  }
  
  .filter-buttons button {
    margin-right: 10px;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  .filter-buttons button.active {
    background-color: #ff8818;
    color: white;
  }
  
  .booking-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .booking-table th,
  .booking-table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .booking-table th {
    background-color: #f4f4f4;
  }
  
  .buttons {
    text-align: center;
  }
  
  .buttons button {
    margin: 2%;
  }
  
  .confirm-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .status-pending {
    background-color: gray;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }
  
  .status-booked {
    background-color: green;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }
  
  .status-cancelled {
    background-color: red;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }
  </style>
  