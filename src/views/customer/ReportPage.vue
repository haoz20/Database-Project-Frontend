<template>
  <div class="report-page">
    <h2>Report an Issue</h2>
    <form @submit.prevent="submitReport" class="report-form">
      <label for="reportType">Type of Issue:</label>
      <select v-model="report.type" id="reportType" required>
        <option value="Bug">Bug</option>
        <option value="Service Issue">Service Issue</option>
        <option value="Other">Other</option>
      </select>

      <label for="reportEmail">Email to Contact:</label>
      <input type="email" v-model="report.email" id="reportEmail" readonly />

      <label for="reportDescription">Description:</label>
      <textarea v-model="report.description" id="reportDescription" required></textarea>

      <button type="submit" class="submit-btn">Submit Report</button>
    </form>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Report Submitted</h3>
        <p>Your report has been successfully submitted.</p>
        <button @click="closeModal" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ReportPage",
  data() {
    return {
      report: {
        type: "",
        email: "",
        description: ""
      },
      showSuccessModal: false
    };
  },
  mounted() {
    // Pre-populate the email field with the logged in customer's email.
    // For example, assume it's stored in localStorage under "customerEmail".
    const customerEmail = localStorage.getItem("customerEmail");
    if (customerEmail) {
      this.report.email = customerEmail;
    }
  },
  methods: {
    submitReport() {
      // Create the payload. We include the logged-in customer's ID and the current date.
      const payload = {
        reportedBy: localStorage.getItem("userId"), // Customer's ID
        issueType: this.report.type,
        description: this.report.description,
      };

      axios
        .post("http://localhost:8080/api/issues", payload)
        .then(response => {
          this.showSuccessModal = true;
        })
        .catch(error => {
          console.error("Error reporting issue:", error);
          alert("Failed to submit report.");
        });
    },
    closeModal() {
      this.showSuccessModal = false;
      // Reset the form fields except for the email
      this.report.type = "";
      this.report.description = "";
    }
  }
};
</script>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.report-form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

label {
  margin-top: 10px;
  font-weight: bold;
}

textarea,
select,
input,
button {
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

textarea {
  height: 100px;
}

.submit-btn {
  background-color: #ff8818;
  color: white;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #ffc16f;
}

/* Modal Styles */
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
  text-align: center;
}

.close-btn {
  margin-top: 10px;
  background-color: #dc3545;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #b02a37;
}
</style>
