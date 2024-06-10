<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header text-center">
              <h2>OTP Registration</h2>
            </div>
            <div class="card-body text-center">
              <button class="btn btn-primary" @click="registerOtp">
                Register OTP
              </button>
              <div v-if="qrCodeHtml" class="mt-4">
                <div v-html="qrCodeHtml"></div>
              </div>
              <div v-if="error" class="alert alert-danger mt-4">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        qrCodeHtml: '',
        error: ''
      };
    },
    methods: {
      async registerOtp() {
        try {
          const response = await axios.get('/otp/regist');
          this.qrCodeHtml = response.data;
          this.error = ''; // Clear any previous errors
        } catch (error) {
          console.error('Error registering OTP:', error);
          this.error = 'Failed to register OTP. Please try again.';
        }
      }
    }
  };
  </script>