<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>결재 상세 정보</h2>
      <button @click="goToApprovalList" class="list-button">목록으로</button>
    </div>
    <div class="approval-detail">
      <div class="section">
        <h3 class="section-title">{{ approvalDetail.approvalInfo?.type }}</h3>
        <div class="detail-item">
          <span class="label">요청일:</span>
          <span class="value">{{ formatDate(approvalDetail.approvalInfo?.createdAt) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">요청자:</span>
          <span class="value">{{ approvalDetail.requester?.team?.name }} {{ approvalDetail.requester?.position?.name }} {{ approvalDetail.requester?.name }} ({{ approvalDetail.requester?.phoneNumber }})</span>
        </div>
        <div class="detail-item">
          <span class="label">결재자:</span>
          <span class="value">{{ approvalDetail.approver?.team?.name }} {{ approvalDetail.approver?.position?.name }} {{ approvalDetail.approver?.name }} ({{ approvalDetail.approver?.phoneNumber }})</span>
        </div>
        <div class="detail-item">
          <span class="label">결재 상태:</span>
          <span :class="['value', getStatusClass(approvalDetail.approvalInfo?.isApproved)]">
            {{ formatStatus(approvalDetail.approvalInfo?.isApproved) }}
          </span>
        </div>
      </div>
      <div class="section">
        <h3 class="section-title">결재 내용</h3>
        <div class="content-box">
          {{ approvalDetail.approvalInfo?.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const approvalDetail = ref({});

onMounted(async () => {
  const approvalId = route.params.approvalId;
  await fetchApprovalDetail(approvalId);
});

async function fetchApprovalDetail(approvalId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await axios.get(`http://localhost:5000/approval/${approvalId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    approvalDetail.value = response.data;
  } catch (error) {
    console.error('Error fetching approval detail:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatStatus(status) {
  switch (status) {
    case 'WAITING':
      return '승인 대기 중';
    case 'APPROVED':
      return '승인 완료';
    case 'REJECTED':
      return '승인 거부';
    default:
      return status;
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'WAITING':
      return 'status-waiting';
    case 'APPROVED':
      return 'status-approved';
    case 'REJECTED':
      return 'status-rejected';
    default:
      return '';
  }
}

function formatType(typeId) {
  switch (typeId) {
    case 1:
      return '워크스페이스 생성 요청';
    case 2:
      return '스터디 생성 요청';
    case 3:
      return '속하지 않은 워크스페이스 열람 요청';
    default:
      return '기타';
  }
}

function goToApprovalList() {
  router.push('/approval/requested');
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.no-background {
  background-color: transparent;
}

.no-shadow {
  box-shadow: none;
}

.list-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-button:hover {
  background-color: #1b2cba;
}

.approval-detail {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  width: 120px;
  margin-right: 10px;
}

.value {
  flex-grow: 1;
}

.status-waiting {
  color: #2196f3;
}

.status-approved {
  color: #4caf50;
}

.status-rejected {
  color: #f44336;
}

.content-box {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-top: 10px;
  white-space: pre-wrap;
}
</style>