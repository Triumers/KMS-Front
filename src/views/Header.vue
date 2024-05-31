<template>
    <header class="header">
        <div class="header-left">
            <div class="logo">
                <img src="@/assets/images/logo_header.png" alt="Logo" @click="navigateTo('')" />
            </div>
        </div>
        <div class="header-center">
            <input type="text" placeholder="검색어를 입력하세요" class="search-input" />
            <button class="search-button">
                <img src="@/assets/icons/search_icon.png" alt="Search" />
            </button>
        </div>
        <div class="header-right">
            <!-- 프로필 예정 -->
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// path 추가 예정
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
    align-items: center;
}

.logo {
    font-size: 24px;
    font-weight: bold;
}

.logo > img {
    width: 200px;
}

.search-input {
    width: 100%;
    max-width: 800px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px 4px 4px 4px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    outline: none;
}

.search-button {
    background-color: #042444;
    border: none;
    border-radius: 4px 4px 4px 4px;
    padding: 5px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-button > img {
    width: 25px;
    height: 25px;
    filter: invert(100%);
}
</style>
