<template>
    <div class="issues-view">
        <!-- Main Content -->
        <main class="main-content">
            <!-- Search Bar -->
            <div class="search-filter">
                <input v-model="searchQuery" type="text" placeholder="Search by ID, Customer, Photographer"
                    class="search-input" />
                <button @click="filterBy('status')" class="filter-btn">Status</button>
                <button @click="filterBy('type')" class="filter-btn">Type</button>
                <button @click="filterBy('date')" class="filter-btn">Date</button>
                <button @click="clearFilters" class="clear-btn">Clear Filter</button>
            </div>

            <!-- Issues Table -->
            <table>
                <thead>
                    <tr>
                        <th>Issue ID</th>
                        <th>Customer</th>
                        <th>Customer Email</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="issue in paginatedIssues" :key="issue.id">
                        <td>{{ issue.id }}</td>
                        <td>{{ issue.customer }}</td>
                        <td>{{ issue.email }}</td>
                        <td>{{ issue.type }}</td>
                        <td>{{ issue.status }}</td>
                        <td>{{ issue.date }}</td>
                        <td><button @click="viewIssue(issue)" class="view-btn">View</button></td>
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
        </main>
    </div>

    <!-- Issue Modal -->
    <div v-if="selectedIssue" class="issue-modal-overlay" @click="closeIssueModal">
        <div class="issue-modal-content" @click.stop>
            <header class="modal-header">
                <h2 class="modal-title">Issue Details</h2>
                <button class="close-btn" @click="closeIssueModal">✖</button>
            </header>

            <div class="modal-body">
                <!-- Details Section -->
                <div class="details-list">
                    <div class="detail-item">
                        <span class="detail-label">Issue ID:</span>
                        <span class="detail-value">{{ selectedIssue.id }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Customer:</span>
                        <span class="detail-value">{{ selectedIssue.customer }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">{{ selectedIssue.email }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Reported Date:</span>
                        <span class="detail-value">{{ selectedIssue.date }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">{{ selectedIssue.type }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <select v-model="selectedIssue.status" class="status-dropdown">
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                <!-- Description Section -->
                <div class="description-section">
                    <label for="description">Description of the Issue:</label>
                    <div id="description" class="description-textarea non-editable">
                        {{ selectedIssue.description }}
                    </div>
                    <button class="reply-btn">Reply</button>
                    <div class="checkbox-container">
                        <input type="checkbox" id="solvedCheckbox" v-model="selectedIssue.solved" />
                        <label for="solvedCheckbox">Solved the issue</label>
                    </div>
                </div>
            </div>

            <!-- Footer: Buttons -->
            <footer class="modal-footer">
                <button class="save-btn" @click="saveChanges">Save Changes</button>
                <button class="cancel-btn" @click="closeIssueModal">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "IssuesView",
    data() {
        return {
            issues: [],
            searchQuery: "",
            currentPage: 1,
            itemsPerPage: 5,
            filters: {
                status: null,
                type: null,
                date: null,
            },
            selectedIssue: null,
        };
    },
    computed: {
        filteredIssues() {
            let result = this.issues;
            if (this.searchQuery) {
                result = result.filter((issue) =>
                    issue.id.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    issue.customer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    issue.email.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            if (this.filters.status) {
                result = result.filter((issue) => issue.status === this.filters.status);
            }
            if (this.filters.type) {
                result = result.filter((issue) => issue.type === this.filters.type);
            }
            if (this.filters.date) {
                result = result.filter((issue) => issue.date === this.filters.date);
            }
            return result;
        },
        paginatedIssues() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredIssues.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredIssues.length / this.itemsPerPage);
        },
    },
    methods: {
        fetchIssues() {
            return axios.get("http://localhost:8080/api/issues")
                .then((response) => {
                    // Map IssueDTO to a local issue object using the provided customerName and customerEmail fields.
                    this.issues = response.data.map((issue) => ({
                        id: issue.issueId,
                        customer: issue.customerName || ("Customer #" + issue.reportedBy),
                        email: issue.customerEmail || "N/A",
                        type: issue.issueType,
                        status: issue.issueStatus,
                        date: issue.reportedAt ? issue.reportedAt : "N/A",
                        description: issue.description,
                        solved: false,
                    }));
                });
        },
        filterBy(filterType) {
            this.filters[filterType] = prompt(`Enter ${filterType} to filter by:`);
        },
        clearFilters() {
            this.filters = { status: null, type: null, date: null };
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
        viewIssue(issue) {
            this.selectedIssue = issue;
        },
        closeIssueModal() {
            this.selectedIssue = null;
        },
        saveChanges() {
            const payload = {
                // Map the locally bound status (from the dropdown) to issueStatus.
                issueStatus: this.selectedIssue.status,
                // Optionally, include other fields that you want to update:
                // resolutionDetail: this.selectedIssue.resolutionDetail,
                // resolutionDate: this.selectedIssue.resolutionDate,
            };
            axios
                .put(`http://localhost:8080/api/issues/${this.selectedIssue.id}`, payload)
                .then(() => {
                    alert("Issue updated successfully.");
                    this.closeIssueModal();
                })
                .catch((error) => {
                    console.error("Error updating issue:", error);
                    alert("Failed to update issue.");
                });
        }
        ,
        fetchData() {
            // Now we only need to fetch issues since customer details are included in each IssueDTO.
            this.fetchIssues().catch(error => {
                console.error("Error fetching issues:", error);
                alert("Failed to fetch issues.");
            });
        }
    },
    mounted() {
        this.fetchData();
    },
};
</script>


<style scoped>
/* (Your existing styles remain unchanged) */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    padding: 1rem;
    text-align: center;
    border: 1px solid #ddd;
}

th {
    background-color: #f4f4f4;
}

/* Layout */
.issues-view {
    display: flex;
    height: 100vh;
}

/* Main Content */
.main-content {
    flex: 1;
    padding: 20px;
}

/* Search Bar */
.search-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.search-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.filter-btn,
.clear-btn {
    padding: 10px;
    background: #ddd;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}

.clear-btn {
    background: #f0f0f0;
}

/* Table */
.issues-table th,
.issues-table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

.view-btn {
    padding: 5px 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.view-btn:hover {
    background: #0056b3;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-top: 20px;
}

.pagination button {
    padding: 5px 10px;
    border: 1px solid #ddd;
    background: #f0f0f0;
    border-radius: 4px;
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

/* Modal Overlay */
.issue-modal-overlay {
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

/* Modal Content */
.issue-modal-content {
    background: white;
    padding: 20px;
    width: 800px;
    max-width: 90%;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
}

/* Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: bold;
}

.modal-subtitle {
    font-size: 0.9rem;
    color: gray;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}

/* Modal Body */
.modal-body {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Details List */
.details-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.detail-label {
    text-align: left;
    font-weight: bold;
    width: 150px;
}

.detail-value {
    flex: 1;
    text-align: left;
}

/* Status Dropdown */
.status-dropdown {
    width: auto;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* Description Section */
.description-section {
    flex: 1;
}

.description-textarea.non-editable {
    width: auto;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    color: #333;
    white-space: pre-wrap;
    overflow-y: auto;
    cursor: not-allowed;
}

/* Reply Button */
.reply-btn {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.checkbox-container {
    margin-top: 10px;
}

/* Modal Footer */
.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
}

.save-btn,
.cancel-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.save-btn {
    background-color: #28a745;
    color: white;
}

.save-btn:hover {
    background-color: #218838;
}

.cancel-btn {
    background-color: #dc3545;
    color: white;
}

.cancel-btn:hover {
    background-color: #c82333;
}
</style>