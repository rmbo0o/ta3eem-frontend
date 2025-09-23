<template>
  <div class="form-group">
    <textarea
      v-model="response"
      class="form-control"
      placeholder="Type your response here..."
      required
    ></textarea>
    <button @click="submitResponse" class="btn btn-primary mt-2">Submit Response</button>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  props: ['reviewId'], // Review ID to respond to
  data() {
    return {
      response: ''
    };
  },
  methods: {
    async submitResponse() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:5000/api/reviews/response', {
          reviewId: this.reviewId,
          response: this.response
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Response added:', response.data);
        this.response = '';  // Clear input after submission
      } catch (error) {
        console.error('Error submitting response:', error);
      }
    }
  }
};
</script>
