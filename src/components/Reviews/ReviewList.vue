<template>
  <div v-if="reviews.length" class="reviews-list">
    <div v-for="review in reviews" :key="review.id" class="review-card">
      <div class="review-header">
        <div class="reviewer-info">
          <strong class="reviewer-name">{{ review.reviewer_name || 'Anonymous' }}</strong>
          <span v-if="review.rating" class="rating-badge">
            ⭐ {{ review.rating }}/5
          </span>
        </div>
        <span class="review-date">{{ formatDate(review.created_at) }}</span>
      </div>

      <p class="review-text">{{ review.comment }}</p>

      <!-- Owner's Response - ALWAYS show if response_text exists -->
      <div v-if="review.response_text" class="owner-response">
        <div class="response-header">
          <strong class="owner-label">Owner's Response:</strong>
        </div>
        <p class="response-text">{{ review.response_text }}</p>
      </div>

      <!-- Debug info - shows if response exists but not displaying -->
      <div v-if="review.response_text" class="debug-success">
        ✅ Response found: "{{ review.response_text }}"
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
    // Fetch every 3 seconds to see updates (remove after fixing)
    setInterval(() => {
      this.fetchReviews();
    }, 3000);
  },
  methods: {
    async fetchReviews() {
      try {
        console.log('Fetching reviews for owner:', this.ownerId);
        const response = await axios.get(`/reviews/${this.ownerId}`);

        console.log('All reviews:', response.data);

        // Sort by date (newest first)
        this.reviews = response.data.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );

        // Log which reviews have responses
        this.reviews.forEach(review => {
          if (review.response_text) {
            console.log(`✅ Review ${review.id} by ${review.reviewer_name} has response:`, review.response_text);
          }
        });

      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
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
  padding: 1rem;
}

.review-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reviewer-name {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #FFD700;
  color: #333;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  width: fit-content;
}

.review-date {
  color: #999;
  font-size: 0.9rem;
}

.review-text {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 1rem;
}

/* Owner Response Styles - HIGHLY VISIBLE */
.owner-response {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background-color: #fafafa;
  border-left: 6px solid #FFD700;
  border-radius: 0 8px 8px 0;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

.response-header {
  margin-bottom: 0.75rem;
}

.owner-label {
  color: #FFD700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.response-text {
  color: #444;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  padding-left: 0.5rem;
  border-left: 2px solid #FFD700;
}

/* Debug styles */
.debug-success {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  border-radius: 4px;
  font-size: 0.9rem;
}

.no-reviews {
  text-align: center;
  color: #999;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 1.1rem;
}

/* Auto-refresh indicator */
.auto-refresh {
  font-size: 0.8rem;
  color: #999;
  text-align: right;
  margin-top: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .review-date {
    align-self: flex-start;
  }

  .review-card {
    padding: 1rem;
  }
}
</style>
