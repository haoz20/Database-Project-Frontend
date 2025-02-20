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
                <tr v-for="booking in filteredBookings" :key="booking.id">
                    <td>{{ booking.id }}</td>
                    <td>{{ booking.date }}</td>
                    <td>{{ booking.customerName }}</td>
                    <td>{{ booking.speciality }}</td>
                    <td>{{ booking.category }}</td>
                    <td>{{ booking.eventLocation }}</td>
                    <td>
                        <span :class="getStatusClass(booking.status)">{{ booking.status }}</span>
                    </td>
                    <td class="buttons" >
                        <button v-if="booking.status === 'Pending'" @click="confirmBooking(booking.id)" class="confirm-btn">Confirm</button>
                        <button v-if="booking.status === 'Pending'" @click="cancelBooking(booking.id)" class="cancel-btn">Cancel</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "BookingManagement",
    data() {
        return {
            bookings: [
                {
                    id: "#B001",
                    date: "2024-07-12",
                    customerName: "Chaiyut Boonmee",
                    speciality: "Photography",
                    category: "Wedding",
                    eventLocation: "Bangkok",
                    status: "Pending",
                },
                {
                    id: "#B002",
                    date: "2024-07-15",
                    customerName: "Natee Srisawat",
                    speciality: "Videography",
                    category: "Portrait",
                    eventLocation: "Chiang Mai",
                    status: "Booked",
                },
                {
                    id: "#B003",
                    date: "2024-07-20",
                    customerName: "Supatra Chaichana",
                    speciality: "Photography",
                    category: "Family",
                    eventLocation: "Phuket",
                    status: "Cancelled",
                },
            ],
            selectedStatus: "All",
        };
    },
    computed: {
        filteredBookings() {
            if (this.selectedStatus === "All") return this.bookings;
            return this.bookings.filter((booking) => booking.status === this.selectedStatus);
        },
    },
    methods: {
        filterByStatus(status) {
            this.selectedStatus = status;
        },
        confirmBooking(id) {
            const booking = this.bookings.find((b) => b.id === id);
            if (booking) booking.status = "Booked";
        },
        cancelBooking(id) {
            const booking = this.bookings.find((b) => b.id === id);
            if (booking) booking.status = "Cancelled";
        },
        getStatusClass(status) {
            switch (status) {
                case "Pending":
                    return "status-pending";
                case "Booked":
                    return "status-booked";
                case "Cancelled":
                    return "status-cancelled";
            }
        },
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
.buttons{
    text-align: center;
}

.buttons button{
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
