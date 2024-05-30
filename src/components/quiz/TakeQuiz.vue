<template>
  <div>
    <div v-if="isQuizModalVisible" class="quiz-modal">
      <div class="quiz-modal-content">
        <div class="quiz-header">
          <h2>QUIZ</h2>
          <button @click="closeQuiz" class="close-btn">&times;</button>
        </div>
        <div class="quiz-body">
          <div class="quiz-question" v-if="quiz">
            <p>{{ quiz.content }}</p>
            <input type="text" v-model="answer" class="answer-input" placeholder="문제의 답을 입력해주세요." />
            <button @click="submitQuestion" class="submit-btn">Submit</button>
            <div v-if="showResult" class="quiz-results">
              <p v-if="answer === quiz.answer">
                정답 입니다!
              </p>
              <p v-else>
                틀렸습니다..
                (답: {{ quiz.answer }})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="showQuizModal" class="open-quiz-btn">Show Quiz</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { defineProps } from 'vue';

const props = defineProps({
  quizId: {
    type: Number,
    required: true,
  }
});

const isQuizModalVisible = ref(false);
const quiz = ref(null);
const answer = ref('');
const showResult = ref(false);

const showQuizModal = async () => {
  isQuizModalVisible.value = true;
  try {
    const response = await axios.get(`/quiz/contents?id=${props.quizId}`);
    if (response.status === 200) {
      quiz.value = response.data;
    } else {
      console.error('Can not find quiz...');
    }
  } catch (error) {
    console.error('Failed to fetch quiz:', error);
  }
};

const closeQuiz = () => {
  isQuizModalVisible.value = false;
};

const submitQuestion = () => {
  showResult.value = true;
};
</script>

<style scoped>
.quiz-modal {
  position: fixed;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quiz-modal-content {
  background: white;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #05172a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.quiz-body {
  margin-top: 20px;
}

.quiz-question {
  margin-bottom: 20px;
}

.quiz-results {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}

.answer-input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.open-quiz-btn {
  padding: 10px 20px;
  background-color: #05172a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
</style>
