<template>
    <div class="search-page">
        <!-- Search Panel -->
        <div class="search-panel">
            <select v-model="filters.available" class="dropdown">
                <option value="">Available to work in</option>
                <option value="Bangkok">Bangkok</option>
                <option value="Pattaya">Pattaya</option>
                <option value="Chiang Mai">Chiang Mai</option>
                <option value="Phuket">Phuket</option>
                <option value="Hua Hin">Hua Hin</option>
            </select>
            <select v-model="filters.speciality" class="dropdown">
                <option value="">Speciality</option>
                <option value="Photography">Photography</option>
                <option value="Videography">Videography</option>
            </select>
            <select v-model="filters.category" class="dropdown">
                <option value="">Category</option>
                <option value="Wedding">Wedding</option>
                <option value="Family Photo">Family Photo</option>
                <option value="Portrait">Portrait</option>
            </select>
            <button @click="filterResults" class="find-btn">Find Now</button>
        </div>

        <!-- Photographers Table -->
        <table class="photographers-table">
            <thead>
                <tr>
                    <th>Photographer Name</th>
                    <th>Email</th>
                    <th>Speciality</th>
                    <th>Available Locations</th>
                    <th>Categories</th>
                    <th>Rating</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="photographer in paginatedPhotographers" :key="photographer.photographerId">
                    <td>{{ photographer.name }}</td>
                    <td>{{ photographer.email }}</td>
                    <td>{{ photographer.speciality }}</td>
                    <td>{{ photographer.availableLocations.join(", ") }}</td>
                    <td>{{ photographer.categories.join(", ") }}</td>
                    <td>{{ photographer.rating }}</td>
                    <td>
                        <button @click="viewPhotographer(photographer)" class="action-btn">View</button>
                        <button @click="bookPhotographer(photographer)" class="action-btn">Book</button>
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

        <!-- View Photographer Modal -->
        <div v-if="selectedPhotographer" class="modal-overlay" @click="closeModals">
            <div class="modal-content" @click.stop>
                <h2>Photographer Details</h2>
                <ul class="details-list">
                    <li><strong>Name:</strong> {{ selectedPhotographer.name }}</li>
                    <li><strong>Email:</strong> {{ selectedPhotographer.email }}</li>
                    <li><strong>Speciality:</strong> {{ selectedPhotographer.speciality }}</li>
                    <li><strong>Available:</strong> {{ selectedPhotographer.availableLocations.join(", ") }}</li>
                    <li><strong>Categories:</strong> {{ selectedPhotographer.categories.join(", ") }}</li>
                    <li><strong>Rating:</strong> {{ selectedPhotographer.rating }}</li>
                </ul>
                <div class="modal-buttons">
                    <button @click="bookPhotographer(selectedPhotographer)" class="find-btn">Book</button>
                    <button @click="closeModals" class="cancel-btn">Close</button>
                </div>
            </div>
        </div>

        <!-- Book Photographer Modal -->
        <div v-if="bookingModal" class="modal-overlay" @click="closeModals">
            <div class="modal-content" @click.stop>
                <h2>Book Photographer</h2>
                <div class="form-group">
                    <label for="eventDate">Event Date:</label>
                    <input type="date" v-model="bookingDetails.date" id="eventDate" />
                </div>
                <div class="form-group">
                    <label for="eventLocation">Event Location:</label>
                    <select v-model="bookingDetails.location" class="book-dropdown">
                        <option v-for="location in selectedPhotographer.availableLocations" :key="location"
                            :value="location">
                            {{ location }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="eventCategory">Event Category:</label>
                    <select v-model="bookingDetails.category" class="book-dropdown">
                        <option v-for="cat in selectedPhotographer.categories" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                </div>
                <div class="modal-buttons">
                    <button @click="confirmBooking" class="find-btn">Confirm</button>
                    <button @click="closeModals" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            photographers: [],
            filters: { available: "", speciality: "", category: "" },
            currentPage: 1,
            itemsPerPage: 5,
            selectedPhotographer: null,
            bookingModal: false,
            bookingDetails: { date: "", location: "", category: "" }, // Add category here
        };
    },
    computed: {
        filteredPhotographers() {
            return this.photographers.filter((photographer) => {
                return (
                    (!this.filters.available || photographer.availableLocations.includes(this.filters.available)) &&
                    (!this.filters.speciality || photographer.speciality === this.filters.speciality) &&
                    (!this.filters.category || photographer.categories.includes(this.filters.category))
                );
            });
        },
        paginatedPhotographers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredPhotographers.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredPhotographers.length / this.itemsPerPage);
        },
    },
    methods: {
        async fetchPhotographers() {
            try {
                const response = await axios.get("http://localhost:8080/api/photographers");
                // Map the response so that availableToWorkIn becomes availableLocations and category becomes categories (array)
                this.photographers = response.data.map(photographer => ({
                    ...photographer,
                    availableLocations: photographer.availableToWorkIn || [],
                    categories: Array.isArray(photographer.category)
                        ? photographer.category
                        : photographer.category.split(", ")
                }));
                console.log("Fetched photographers:", this.photographers);
            } catch (error) {
                console.error("Error fetching photographers:", error);
            }
        },
        filterResults() {
            this.currentPage = 1;
        },
        viewPhotographer(photographer) {
            this.selectedPhotographer = photographer;
        },
        bookPhotographer(photographer) {
            this.selectedPhotographer = photographer;
            // Pre-select the first available location and first category
            this.bookingDetails.location = photographer.availableLocations[0] || "";
            this.bookingDetails.category = photographer.categories[0] || "";
            this.bookingModal = true;
        },
        async confirmBooking() {
            try {
                const payload = {
                    customerId: localStorage.getItem("userId"),
                    photographerId: this.selectedPhotographer.photographerId,
                    eventDate: this.bookingDetails.date,          // Should be in YYYY-MM-DD format
                    eventLocation: this.bookingDetails.location,
                    bookingStatus: "Pending",
                    speciality: this.selectedPhotographer.speciality, // Taken from photographer
                    category: this.bookingDetails.category             // Ensure this is not null
                };
                console.log("Booking Payload:", payload);
                await axios.post("http://localhost:8080/api/bookings", payload);
                alert("Booking confirmed!");
                this.closeModals();
            } catch (error) {
                
                console.error("Error booking photographer:", error);
                alert("Failed to create booking.");
            }
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
        closeModals() {
            this.selectedPhotographer = null;
            this.bookingModal = false;
        },
    },
    mounted() {
        this.fetchPhotographers();
    },
};
</script>

<style scoped>
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
}

.form-group label {
    font-weight: bold;
    margin-bottom: 5px;
}

.dropdown {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.book-dropdown {
    padding: 10px;
    width: 100%;
}

.search-panel {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.photographers-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.photographers-table th,
.photographers-table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

.photographers-table th {
    background-color: #f4f4f4;
}

.action-btn {
    padding: 5px 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 3%;
}

.action-btn:hover {
    background: #0056b3;
}

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

.details-list {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: left;
}

.details-list li {
    margin-bottom: 10px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.find-btn {
    background-color: #ff6600;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.find-btn:hover {
    background-color: #e55b00;
}

.cancel-btn {
    background-color: #ff132b;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #b02a37;
}
</style>