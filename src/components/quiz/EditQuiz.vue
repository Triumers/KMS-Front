<template>
    <div class="edit-quiz">
      <h2>퀴즈 수정</h2>
      <form @submit.prevent="submitQuiz">
        <div class="form-group">
          <label for="quizTitle">퀴즈 제목</label>
          <input type="text" id="quizTitle" v-model="quizTitle" required />
        </div>
        <div class="form-group">
          <label for="questions">문제</label>
          <div v-for="(question, qIndex) in questions" :key="qIndex" class="question">
            <input type="text" v-model="question.text" placeholder="문제를 입력하세요" required />
            <input type="text" v-model="question.answer" placeholder="답안을 입력하세요" required />
            <input type="text" v-model="question.reference" placeholder="참조 내용을 입력하세요" />
            <label>
              <input type="checkbox" v-model="question.active" /> 활성화
            </label>
          </div>
        </div>
        <button type="submit">퀴즈 수정</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        quizId: null,
        quizTitle: '',
        questions: []
      };
    },
    created() {
      this.quizId = this.$route.params.id;
      // 여기에서 API 호출로 기존 퀴즈 데이터를 가져와서 설정합니다.
      // 예시:
      // axios.get(`/api/quiz/${this.quizId}`).then(response => {
      //   this.quizTitle = response.data.title;
      //   this.questions = response.data.questions;
      // });
    },
    methods: {
      submitQuiz() {
        const quizData = {
          title: this.quizTitle,
          questions: this.questions
        };
        // API 호출로 수정된 퀴즈 데이터를 제출합니다.
        console.log('퀴즈 수정 제출:', quizData);
      }
    }
  };
  </script>
  
  <style scoped>
  .edit-quiz {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .question {
    margin-bottom: 10px;
  }
  
  button {
    margin-top: 5px;
  }
  </style>
  