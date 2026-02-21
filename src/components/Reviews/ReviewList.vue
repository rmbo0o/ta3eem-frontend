<template>
  <div v-if="reviews.length" class="reviews-list">
    <div v-for="review in reviews" :key="review.id" class="review-card">
      <div class="review-header">
        <div class="reviewer-info">
          <strong class="reviewer-name">{{ review.reviewer_name || 'Anonymous' }}</strong>
          <span v-if="review.rating" class="rating-badge">
            <span class="stars">⭐</span> {{ review.rating }}/5
          </span>
        </div>
        <span class="review-date">{{ formatDate(review.created_at) }}</span>
      </div>

      <p class="review-text">{{ review.comment }}</p>

      <!-- Owner's Response - THIS IS THE IMPORTANT PART -->
      <div v-if="review.response_text" class="owner-response">
        <div class="response-header">
          <strong class="owner-label">Owner's Response:</strong>
        </div>
        <p class="response-text">{{ review.response_text }}</p>
      </div>
    </div>
  </div>

  <div v-else class="no-reviews">
    <p>No reviews yet. Be the first to review!</p>
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
        console.log('Reviews loaded:', response.data); // Debug log
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
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
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.review-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reviewer-name {
  font-size: 1.1rem;
  color: #2d333f;
}

.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #FFD700;
  color: #2d333f;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  width: fit-content;
}

.stars {
  color: #2d333f;
}

.review-date {
  color: #999;
  font-size: 0.85rem;
}

.review-text {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Owner Response Styles */
.owner-response {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-left: 4px solid #FFD700;
  border-radius: 0 8px 8px 0;
}

.response-header {
  margin-bottom: 0.5rem;
}

.owner-label {
  color: #FFD700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.response-text {
  color: #555;
  margin: 0;
  font-style: italic;
}

.no-reviews {
  text-align: center;
  color: #999;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .review-date {
    align-self: flex-start;
  }
}
</style>
