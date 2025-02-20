<template>
    <nav class="menu-bar">
        <ul class="menu-list">
            <li v-for="(menuItem, index) in menuItems" :key="index" class="menu-item">
                <router-link :to="menuItem.link">{{ menuItem.text }}</router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: "MenuBar",
    props: {
        menuItems: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped>
.menu-bar {
    display: flex;
    justify-content: center;
    background-color: #ff8818;
    padding: 10px 0;
}

.menu-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.menu-item {
    margin: 0;
    padding: 0 20px;
    position: relative;
    text-align: center;
    font-size: 0.9rem; /* Smaller font size */
    font-weight: bold;
    color: white;
}

.menu-item:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 50%;
    width: 1px;
    background-color: white; /* Divider line color */
}

.menu-item a {
    color: white;
    text-decoration: none;
}

.menu-item a:hover {
    text-decoration: underline;
}
</style>
