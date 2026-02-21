<template>
  <div class="reviews-container">
    <h3>Customer Reviews</h3>

    <div v-if="loading" class="loading">
      Loading reviews...
    </div>

    <div v-else-if="reviews.length === 0" class="no-reviews">
      No reviews yet.
    </div>

    <div v-else class="reviews-list">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="review-item"
        :class="{ 'has-response': review.response_text }"
      >
        <!-- Review Header -->
        <div class="review-header">
          <strong>{{ review.reviewer_name || 'Anonymous' }}</strong>
          <span class="review-date">{{ formatDate(review.created_at) }}</span>
        </div>

        <!-- Rating -->
        <div v-if="review.rating" class="rating">
          Rating: {{ review.rating }}/5
        </div>

        <!-- Review Text -->
        <p class="review-text">{{ review.comment }}</p>

        <!-- OWNER RESPONSE - FORCED VISIBLE -->
        <div v-if="review.response_text" class="response-section">
          <div class="response-label">Owner's Response:</div>
          <div class="response-content">{{ review.response_text }}</div>
        </div>

        <!-- DEBUG INFO - REMOVE LATER -->
        <div class="debug-info">
          Response text: "{{ review.response_text || 'empty' }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  props: {
    ownerId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      loading: true
    };
  },
  async created() {
    await this.fetchReviews();
  },
  methods: {
    async fetchReviews() {
      this.loading = true;
      try {
        console.log('Fetching reviews for owner:', this.ownerId);
        const response = await axios.get(`/reviews/${this.ownerId}`);

        console.log('API Response:', response.data);

        // Store reviews
        this.reviews = response.data;

        // Log each review's response status
        this.reviews.forEach((review, index) => {
          console.log(`Review ${index + 1}:`, {
            id: review.id,
            reviewer: review.reviewer_name,
            hasResponse: !!review.response_text,
            responseText: review.response_text
          });
        });

      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.reviews-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: #f9f9f9;
}

.review-item.has-response {
  border-left: 5px solid #FFD700;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.review-date {
  color: #666;
  font-size: 0.9em;
}

.rating {
  color: #FFD700;
  font-weight: bold;
  margin-bottom: 10px;
}

.review-text {
  color: #333;
  line-height: 1.5;
  margin-bottom: 15px;
}

/* Response Section - VERY VISIBLE */
.response-section {
  margin-top: 15px;
  padding: 15px;
  background-color: #fff3cd;
  border: 2px solid #FFD700;
  border-radius: 8px;
}

.response-label {
  font-weight: bold;
  color: #856404;
  margin-bottom: 8px;
  font-size: 0.95em;
  text-transform: uppercase;
}

.response-content {
  color: #333;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #FFD700;
}

/* Debug Info */
.debug-info {
  margin-top: 10px;
  padding: 8px;
  background: #e7f3ff;
  border: 1px dashed #2196F3;
  font-family: monospace;
  font-size: 0.9em;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.no-reviews {
  text-align: center;
  padding: 30px;
  color: #999;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
