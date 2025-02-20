<template>
    <div class="photographer-page">
        <!-- App Header -->
        <app-header />

        <!-- Reusable MenuBar Component -->
        <menu-bar :menuItems="menuItems" />

        <!-- Main Content -->
        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import MenuBar from '@/components/MenuBar.vue';

export default {
    name: "PhotographerPage",
    components: {
        AppHeader,
        MenuBar,
    },
    data() {
        return {
            menuItems: [
                { text: "Booking Management", link: "/photographer/booking-management" },
                { text: "Date", link: "/photographer/date" },
                { text: "Profile", link: "/photographer/profile" },
            ],
        };
    },
};
</script>

<style scoped>
.photographer-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* Ensure the AppHeader and MenuBar stay at the top */
app-header {
    flex-shrink: 0;
    border-bottom: 1px solid #ddd;
}

menu-bar {
    flex-shrink: 0;
    background-color: #f8f9fa;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.main-content {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
}
</style>