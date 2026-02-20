<template>
  <div v-if="reviews.length">
    <div v-for="review in reviews" :key="review.id" class="review-item">
      <!-- Review content -->
      <div class="review-header">
        <h5>{{ review.reviewer_name }}</h5>
        <p>Rating: {{ review.rating }} / 5</p>
      </div>
      <p>{{ review.review_text }}</p>

      <!-- Display owner's response if exists -->
      <div v-if="review.response_text" class="owner-response">
        <h6>Owner's Response:</h6>
        <p>{{ review.response_text }}</p>
      </div>

      <!-- Response form for owners -->
      <ReviewForm
        v-if="!review.response_text && isOwner"
        :reviewId="review.id"
        @response-submitted="fetchReviews"
      />
    </div>
  </div>
  <div v-else>
    <p>No reviews yet. Be the first to review!</p>
  </div>
</template>

<script>
import axios from '@/utils/api';
import ReviewForm from './ReviewForm.vue';

export default {
  components: { ReviewForm },
  props: {
    ownerId: {
      type: [String, Number],
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
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
      try {
        const response = await axios.get(`/reviews/${this.ownerId}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
  }
};
</script>
