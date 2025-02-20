<template>
    <div class="bookings-page">
        <h2>Your Bookings</h2>
        <p class="total-bookings">Total bookings: {{ bookings.length }}</p>

        <!-- Bookings Table -->
        <table class="bookings-table">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Booking Information</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="booking in paginatedBookings" :key="booking.id">
                    <td>{{ booking.id }}</td>
                    <td>
                        <div><strong>Photographer:</strong> {{ booking.photographer }}</div>
                        <div><strong>Date:</strong> {{ booking.date }}</div>
                        <div><strong>Event Location:</strong> {{ booking.location }}</div>
                        <div><strong>Speciality:</strong> {{ booking.speciality }}</div>
                        <div><strong>Category:</strong> {{ booking.category }}</div>
                    </td>
                    <td>{{ booking.status }}</td>
                    <td>
                        <button v-if="booking.status === 'Pending'" @click="cancelBooking(booking)" class="cancel-btn">
                            Cancel
                        </button>
                        <button v-else class="cancel-btn disabled" disabled>
                            Cancel
                        </button>
                        <button v-if="booking.status === 'Booked'" @click="openRateModal(booking)" class="rate-btn">
                            Rate
                        </button>
                        <button v-else class="cancel-btn disabled" disabled>
                            Rate
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
            <button v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
                @click="goToPage(page)">
                {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>

        <!-- Rate Booking Modal -->
        <div v-if="showRateModal" class="modal-overlay" @click="closeRateModal">
            <div class="modal-content" @click.stop>
                <h2>Rate Booking</h2>
                <div class="form-group">
                    <label for="rating">Rate:</label>
                    <select id="rating" v-model="rating" required>
                        <option value="">Select</option>
                        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="feedback">Feedback:</label>
                    <textarea id="feedback" v-model="feedback" required></textarea>
                </div>
                <div class="modal-buttons">
                    <button @click="submitRating" class="rate-btn">Submit</button>
                    <button @click="closeRateModal" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BookingsPage",
    data() {
        return {
            bookings: [
                { id: "B1001", photographer: "Somchai Suksawat", date: "2025-02-15", location: "Bangkok", speciality: "Photography", category: "Wedding", status: "Pending" },
                { id: "B1002", photographer: "Prasert Boonyarit", date: "2025-03-01", location: "Pattaya", speciality: "Videography", category: "Portrait", status: "Booked" },
                { id: "B1003", photographer: "Anan Boonmak", date: "2025-02-20", location: "Chiang Mai", speciality: "Photography", category: "Family Photo", status: "Cancelled" },
                { id: "B1004", photographer: "Nopparat Meesuk", date: "2025-04-05", location: "Phuket", speciality: "Photography", category: "Wedding", status: "Pending" },
                { id: "B1005", photographer: "Jaruwan Inthanon", date: "2025-04-10", location: "Hua Hin", speciality: "Videography", category: "Portrait", status: "Booked" }
            ],
            currentPage: 1,
            itemsPerPage: 3,
            showRateModal: false,
            rating: "",
            feedback: "",
            selectedBooking: null,
        };
    },
    computed: {
        paginatedBookings() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.bookings.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.bookings.length / this.itemsPerPage);
        },
    },
    methods: {
        cancelBooking(booking) {
            if (confirm(`Are you sure you want to cancel booking ID: ${booking.id}?`)) {
                booking.status = "Cancelled";
                alert(`Booking ID: ${booking.id} has been cancelled.`);
            }
        },
        openRateModal(booking) {
            this.selectedBooking = booking;
            this.showRateModal = true;
        },
        closeRateModal() {
            this.showRateModal = false;
            this.rating = "";
            this.feedback = "";
        },
        submitRating() {
            if (!this.rating) {
                alert("Please select a rating.");
                return;
            }
            alert(`Thank you for rating booking ID: ${this.selectedBooking.id} with ${this.rating} stars.`);
            this.closeRateModal();
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        goToPage(page) {
            this.currentPage = page;
        },
    },
};
</script>

<style scoped>
.bookings-page {
    padding: 20px;
}

h2 {
    margin-bottom: 20px;
}

.total-bookings {
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.bookings-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.bookings-table th,
.bookings-table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

.bookings-table th {
    background-color: #f4f4f4;
}

/* Cancel Button */
.cancel-btn {
    background-color: #dc3545;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
}

.cancel-btn:hover {
    background-color: #b02a37;
}

/* Disabled Cancel Button */
.cancel-btn.disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

/* Rate Button */
.rate-btn {
    background-color: #007bff;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.rate-btn:hover {
    background-color: #0056b3;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    padding: 5px 10px;
    margin: 0 5px;
    border: 1px solid #ddd;
    background: #f0f0f0;
    cursor: pointer;
}

.pagination button.active {
    background: #007bff;
    color: white;
}

.pagination button:hover {
    background: #0056b3;
    color: white;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

textarea {
    width: 100%;
    height: 80px;
}
</style>
