<template>
  <div class="take-quiz">
    <h2>{{ quiz.title }}</h2>
    <div v-for="(question, index) in quiz.questions" :key="index" class="question">
      <p>{{ index + 1 }}. {{ question.text }}</p>
      <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
        <label>
          <input
            type="radio"
            :name="'question-' + index"
            :value="option"
            v-model="userAnswers[index]"
          />
          {{ option }}
        </label>
      </div>
    </div>
    <button @click="submitQuiz">제출</button>
    <div v-if="showResults" class="results">
      <h3>결과</h3>
      <p>맞은 문제 수: {{ correctAnswersCount }} / {{ quiz.questions.length }}</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'TakeQuiz',
  props: {
    quizId: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const quiz = reactive({
      title: 'Sample Quiz',
      questions: [
        {
          text: 'What is 2 + 2?',
          options: ['3', '4', '5'],
          correctAnswer: '4',
        },
        {
          text: 'What is the capital of France?',
          options: ['Berlin', 'London', 'Paris'],
          correctAnswer: 'Paris',
        },
      ],
    });

    const userAnswers = ref([]);
    const showResults = ref(false);
    const correctAnswersCount = ref(0);

    const submitQuiz = () => {
      correctAnswersCount.value = quiz.questions.reduce((count, question, index) => {
        return count + (userAnswers.value[index] === question.correctAnswer ? 1 : 0);
      }, 0);
      showResults.value = true;
    };

    return {
      quiz,
      userAnswers,
      showResults,
      correctAnswersCount,
      submitQuiz,
    };
  },
};
</script>

<style scoped>
.take-quiz {
  max-width: 600px;
  margin: 0 auto;
}

.question {
  margin-bottom: 20px;
}

.results {
  margin-top: 20px;
}
</style>
