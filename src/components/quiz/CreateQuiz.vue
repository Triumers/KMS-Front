<template>
  <div class="create-quiz">
    <h2>Create Quiz</h2>
    <form @submit.prevent="submitQuiz">
      <div class="form-group">
        <label for="questions">퀴즈</label>
        <div v-for="(question, qIndex) in questions" :key="qIndex" class="question">
          <input type="text" v-model="question.text" placeholder="문제를 입력하세요" required />
          <input type="text" v-model="question.answer" placeholder="답안을 입력하세요" required />
          <input type="text" v-model="question.reference" placeholder="참조 내용을 입력하세요" />
          <label>
            <input type="checkbox" v-model="question.active" /> 활성화
          </label>
        </div>
      </div>
      <button type="submit">퀴즈 생성</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    quizId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      questions: [
        {
          text: '',
          answer: '',
          reference: '',
          active: true,
        },
      ],
    };
  },
  methods: {
    async submitQuiz() {
      const quizData = {
        questions: this.questions,
        // postId: this.quizId, // 퀴즈를 특정 게시글에 연결하려는 경우
      };

      try {
        const response = await axios.post(`/quiz/regist`, quizData);
        console.log('퀴즈 제출 성공:', response.data);
        alert('퀴즈가 성공적으로 생성되었습니다.');
      } catch (error) {
        console.error('퀴즈 제출 실패:', error);
        alert('퀴즈 생성 중 오류가 발생했습니다.');
      }
    }
  },
};
</script>

<style scoped>
.create-quiz {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question {
  margin-bottom: 10px;
}

button {
  margin-top: 5px;
}
</style>
