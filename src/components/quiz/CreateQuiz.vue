<template>
  <div class="create-quiz">
    <h2>Create a New Quiz</h2>
    <form @submit.prevent="submitQuiz">
      <div class="form-group">
        <label for="quizTitle">Quiz Title</label>
        <input type="text" id="quizTitle" v-model="quizTitle" required />
      </div>
      <div class="form-group">
        <label for="questions">Questions</label>
        <div v-for="(question, index) in questions" :key="index" class="question">
          <input type="text" v-model="question.text" placeholder="Enter question text" required />
          <div v-for="(option, optIndex) in question.options" :key="optIndex">
            <input type="text" :value="option" @input="updateOption(index, optIndex, $event.target.value)"
              placeholder="Enter option text" required />
          </div>
          <button type="button" @click="addOption(index)">Add Option</button>
          <button type="button" @click="removeOption(index)">Remove Option</button>
        </div>
        <button type="button" @click="addQuestion">Add Question</button>
        <button type="button" @click="removeQuestion">Remove Question</button>
      </div>
      <button type="submit">Create Quiz</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quizTitle: '',
      questions: [
        {
          text: '',
          options: ['']
        }
      ]
    };
  },
  methods: {
    addQuestion() {
      this.questions.push({ text: '', options: [''] });
    },
    removeQuestion(index) {
      if (this.questions.length > 1) {
        this.questions.splice(index, 1);
      }
    },
    addOption(questionIndex) {
      this.questions[questionIndex].options.push('');
    },
    removeOption(questionIndex, optionIndex) {
      if (this.questions[questionIndex].options.length > 1) {
        this.questions[questionIndex].options.splice(optionIndex, 1);
      }
    },
    updateOption(questionIndex, optionIndex, value) {
      this.questions[questionIndex].options[optionIndex] = value;
    },
    submitQuiz() {
      const quizData = {
        title: this.quizTitle,
        questions: this.questions
      };
      // API call to submit the quiz data
      console.log('Quiz Submitted:', quizData);
    }
  }
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

.form-group {
  margin-bottom: 20px;
}

.question {
  margin-bottom: 10px;
}
</style>