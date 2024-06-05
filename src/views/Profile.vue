<template>
    <!-- 관리자 탭 추가 (권한 있는 경우) -->
    <div>
        <button v-if="isManager" type="button" class="btn btn-secondary" data-bs-toggle="modal"
            data-bs-target="#addTab">
            탭 추가
        </button>

        <div class="modal fade" id="addTab" tabindex="-1" aria-labelledby="addTabLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="addTabLabel">탭 추가하기</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="form-container">
                            <div id="tab-select" class="d-flex align-items-center mb-3">
                                <b-form-select v-model="tabForm.topTab" :options="options"></b-form-select>
                                <input v-if="tabForm.topTab === '스터디'" type="text" v-model="tabForm.bottomTab"
                                    placeholder="스터디명을 입력하세요." class="form-control ms-2" />
                            </div>
                            <div class="form-group d-flex flex-column">
                                <label class="form-label fw-bold">대표회원 선택</label>
                                <p v-if="tabForm.leader"> ○ {{ tabForm.leader.name }} ({{ tabForm.leader.team.name }} {{
                                    tabForm.leader.position.name }} {{
                                    tabForm.leader.rank.name }})</p>
                                <div class="d-flex mb-2">
                                    <input v-model="search" type="text" placeholder="직원 이름 검색" class="form-control" />

                                    <button class="search-button" id="search-post" @click="searchEmployees">
                                        <img src="@/assets/icons/search_icon.png" alt="Search" />
                                    </button>
                                </div>
                                <div v-if="searchEmployeeList && searchEmployeeList.length > 0" class="list-group">
                                    <button v-for="employee in searchEmployeeList" :key="employee.id"
                                        class="list-group-item list-group-item-action"
                                        @click="selectEmployee(employee)">
                                        {{ employee.name }} ({{ employee.team.name }} {{ employee.position.name }} {{
                                        employee.rank.name }})
                                    </button>
                                </div>
                                <div v-else-if="searchEmployeeList && search" class="text-danger">
                                    검색 결과가 없습니다.
                                </div>
                                <button v-if="searchEmployeeList" class="btn btn-secondary mt-2"
                                    @click="selectLeader">선택</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                        <button type="button" class="btn btn-outline-dark" @click="saveNewTab">저장</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const options = ["워크스페이스", "스터디"];

const search = ref('');
const searchEmployeeList = ref(null);
const selected = ref(null);
const isManager = (localStorage.getItem('role') == 'ROLE_HR_MANAGER' ? true : false);

const tabForm = ref({
    topTab: '워크스페이스',
    bottomTab: null,
    leader: null,
    teamId: null
});

function selectEmployee(employee) {
    selected.value = employee;
}

function selectLeader() {
    tabForm.value.leader = selected.value;
}

async function saveNewTab() {
    if (tabForm.value.topTab === "워크스페이스") {
        tabForm.value.teamId = tabForm.value.leader.team.id;
    }

    const requestData = {
        topTab: {
            name: tabForm.value.topTab
        },
        bottomTab: {
            name: tabForm.value.bottomTab
        },
        teamId: tabForm.value.teamId,
        isPublic: false
    };

    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5000/tab/regist/new/${tabForm.value.leader.id}`, requestData);
            
            alert("탭 저장 완료")
            location.reload(true);
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        console.log("탭 저장에 실패했습니다:", error);
    }finally{
    }
}


async function searchEmployees() {
    if (search.value.trim() === '') {
        searchEmployeeList.value = [];
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const requestBody = { name: search.value };
        const response = await axios.post('http://localhost:5000/employee/find/name', requestBody, {
            headers: {
                Authorization: `${token}`,
            },
        });
        searchEmployeeList.value = response.data.employee;
    } catch (error) {
        console.error('Error searching employees:', error);
        if (error.response && error.response.status === 401) {
            router.push('/login');
        }
    }
}
</script>

<style>
#tab-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
}

#tab-select .form-control {
    margin-left: 10px;
}

.search-input {
    display: flex;
    margin-bottom: 10px;
}

.tab-select>input{
    width: max-content;
}


.no-results {
    color: #042444;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

#form-container{
    width: 100%;
}
</style>
