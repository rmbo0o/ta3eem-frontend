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
// async submitResponse() {
//   const token = localStorage.getItem('token');
//   try {
//     // ✅ CORRECT: Use PUT request with review ID in URL
//     const response = await axios.put(
//       `https://ta3eem-backend.onrender.com/api/reviews/${this.reviewId}`,
//       { response_text: this.response },  // Changed from 'response' to 'response_text'
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     console.log('Response added:', response.data);
//     this.response = '';  // Clear input after submission
//     // Optionally emit an event to refresh the reviews list
//     this.$emit('response-submitted');
//   } catch (error) {
//     console.error('Error submitting response:', error);
//     if (error.response) {
//       alert(`Error: ${error.response.data.message || 'Failed to submit response'}`);
//     }
//   }
// },

// In your review submission method
async submitReview() {
  try {
    const response = await axios.post('/api/reviews', {
      owner_id: this.ownerId,
      reviewer_name: this.reviewer_name || 'Anonymous',
      comment: this.review_text, // Send as 'comment' not 'review_text'
      rating: this.rating
    });
    // Handle success
  } catch (error) {
    console.error('Error:', error);
  }
}
  }
};
</script>
