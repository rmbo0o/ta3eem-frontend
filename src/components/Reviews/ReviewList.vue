<template>
  <div v-if="reviews.length">
    <div v-for="review in reviews" :key="review.id" class="review-item">
      <div class="review-header">
        <h5>{{ review.reviewer_name }}</h5>
        <p>Rating: {{ review.rating }} / 5</p>
      </div>
      <p>{{ review.comment }}</p>

      <!-- Display the owner's response if it exists -->
      <div v-if="review.response">
        <h6>Your Response:</h6>
        <p>{{ review.response }}</p>
      </div>

      <!-- Add a response form if there's no response yet -->
      <ReviewForm v-if="!review.response" :reviewId="review.id" />
    </div>
  </div>
  <div v-else>
    <p>No reviews available.</p>
  </div>
</template>

<script>
import axios from '@/utils/api';
import ReviewForm from './ReviewForm.vue';  // Import the response form component

export default {
  components: {
    ReviewForm
  },
  props: ['ownerId'],
  data() {
    return {
      reviews: []
    };
  },
  created() {
    this.fetchReviews();
  },
  methods: {
    async fetchReviews() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${this.ownerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
  }
};
</script>
