<template>
    <header class="header">
        <div class="header-left">
            <div class="logo">
                <img src="@/assets/images/logo_header.png" alt="Logo" @click="navigateTo('')" />
            </div>
        </div>
        <div class="header-center">
            <input type="text" placeholder="Search..." class="search-input" />
        </div>
        <div class="header-right">
            <!-- Other header right content -->
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (path) => {
    router.push({ path });
};
</script>

<style>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
}

.header-center {
    flex: 1;
    display: flex;
    justify-content: center;
}

.logo {
    font-size: 24px;
    font-weight: bold;
}

.logo>img {
    width: 200px;
}

.search-input {
    width: 100%;
    max-width: 400px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
