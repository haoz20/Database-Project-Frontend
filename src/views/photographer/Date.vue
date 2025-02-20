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
                <h3 v-if="selectedDate">Selected Date: {{ formatDate(selectedDate) }}</h3>
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

export default {
    name: "DateManagement",
    components: { VueDatePicker },
    data() {
        return {
            bookings: ["2024-07-12", "2024-07-15", "2024-07-20"], // Example booked dates
            availableDates: [], // To be stored in your database
            selectedDate: null, // Selected date from the calendar
        };
    },
    computed: {
        highlightedDates() {
            // Highlight both bookings and available dates
            return this.bookings.concat(this.availableDates);
        },
    },
    methods: {
        isDateAvailable(date) {
            // Check if the selected date is marked as available
            return this.availableDates.includes(date);
        },
        addAvailability() {
            // Add the selected date to availableDates and save to database
            if (this.selectedDate && !this.bookings.includes(this.selectedDate)) {
                this.availableDates.push(this.selectedDate);
                this.saveAvailabilityToDatabase(this.selectedDate, "available");
            }
        },
        removeAvailability() {
            // Remove the selected date from availableDates and update the database
            this.availableDates = this.availableDates.filter(
                (date) => date !== this.selectedDate
            );
            this.saveAvailabilityToDatabase(this.selectedDate, "unavailable");
        },
        toggleAvailability(date) {
            // Update the selectedDate when a date is clicked on the calendar
            this.selectedDate = date;
        },
        formatDate(date) {
            // Format the date as YYYY-MM-DD
            const options = { year: "numeric", month: "2-digit", day: "2-digit" };
            return new Date(date).toLocaleDateString("en-CA", options);
        },
        async saveAvailabilityToDatabase(date, status) {
            // Simulate saving to the database
            console.log(`Saving date: ${date}, status: ${status}`);
            try {
                // Simulate an API call to your database
                await new Promise((resolve) => setTimeout(resolve, 500));
                console.log("Availability updated in the database");
            } catch (error) {
                console.error("Failed to update availability:", error);
            }
        },
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
