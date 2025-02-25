<template>
    <div class="date-management">
      <h1>Date</h1>
      <div class="calendar-container">
        <h2>Set Your Availability</h2>
        <VueDatePicker
          v-model="selectedDate"
          :inline="true"
          :highlighted="highlightedDates"
          @change="toggleAvailability"
        />
        <div class="selected-date">
          <h3 v-if="selectedDate">
            Selected Date: {{ formatDateForDisplay(selectedDate) }}
          </h3>
          <div class="actions">
            <button
              v-if="isDateAvailable(selectedDate)"
              @click="removeAvailability"
              class="remove-btn"
            >
              Remove Availability
            </button>
            <button
              v-else
              @click="addAvailability"
              class="add-btn"
            >
              Set Available
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import VueDatePicker from "vue-datepicker-next";
  import "vue-datepicker-next/index.css";
  import axios from "axios";
  
  export default {
    name: "DateManagement",
    components: { VueDatePicker },
    data() {
      return {
        bookings: [],       // if you want to highlight already-booked dates
        availableDates: [], // store your "YYYY-MM-DD" strings for availability
        selectedDate: null, // the date the photographer clicks
      };
    },
    computed: {
      highlightedDates() {
        // Merge bookings and availableDates for highlighting
        return this.bookings.concat(this.availableDates);
      },
    },
    methods: {
      // This is for display only, e.g. "2025-05-10"
      formatDateForDisplay(date) {
        return new Date(date).toLocaleDateString("en-CA"); 
      },
  
      // This ensures we always get a "YYYY-MM-DD" string for API calls
      formatDateForAPI(date) {
        return new Date(date).toLocaleDateString("en-CA");
      },
  
      toggleAvailability(date) {
        // Called when the user clicks a date in the calendar
        this.selectedDate = date;
      },
  
      async fetchAvailability() {
        try {
          const photographerId = localStorage.getItem("userId");
          const response = await axios.get(`http://localhost:8080/api/availability/${photographerId}`);
          // The API returns an array of objects with {photographerId, availableDate, status}
          // Convert them to "YYYY-MM-DD" strings for easy matching
          this.availableDates = response.data
            .filter(av => av.status === "available")
            .map(av => av.availableDate); // e.g. "2025-05-09"
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      },
  
      async addAvailability() {
        if (this.selectedDate && !this.isDateAvailable(this.selectedDate)) {
          try {
            const photographerId = localStorage.getItem("userId");
            const formattedDate = this.formatDateForAPI(this.selectedDate);
            const payload = {
              photographerId: parseInt(photographerId),
              availableDate: formattedDate,
              status: "available",
            };
            // Create new availability record
            const response = await axios.post("http://localhost:8080/api/availability", payload);
            // The API should return the updated record with the same date
            this.availableDates.push(response.data.availableDate);
            console.log("Availability added:", response.data);
          } catch (error) {
            console.error("Error adding availability:", error);
          }
        }
      },
  
      async removeAvailability() {
        if (this.selectedDate && this.isDateAvailable(this.selectedDate)) {
          try {
            const photographerId = localStorage.getItem("userId");
            const formattedDate = this.formatDateForAPI(this.selectedDate);
            // Switch status to "unavailable" or you could DELETE the record entirely
            const payload = {
              availableDate: formattedDate,
              status: "unavailable",
            };
            const response = await axios.put(`http://localhost:8080/api/availability/${photographerId}`, payload);
            // Remove the date from local array
            this.availableDates = this.availableDates.filter(d => d !== formattedDate);
            console.log("Availability updated:", response.data);
          } catch (error) {
            console.error("Error updating availability:", error);
          }
        }
      },
  
      isDateAvailable(date) {
        if (!date) return false;
        const selected = this.formatDateForAPI(date);
        // Return true if the selected date is in the array
        return this.availableDates.includes(selected);
      },
    },
    mounted() {
      this.fetchAvailability();
      // If you want to highlight booked dates, fetch them similarly
      // this.fetchBookings();
    },
  };
  </script>
  
  <style scoped>
  .date-management {
    padding: 20px;
  }
  
  .calendar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .selected-date {
    margin-top: 20px;
    text-align: center;
  }
  
  .actions {
    margin-top: 10px;
  }
  
  .add-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .add-btn:hover {
    background-color: #45a049;
  }
  
  .remove-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .remove-btn:hover {
    background-color: #e53935;
  }
  </style>
  