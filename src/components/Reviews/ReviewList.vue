<template>
  <div class="reviews-container">
    <h3>تقييمات العملاء</h3>

    <div v-if="loading" class="loading">
      جاري تحميل التقييمات...
    </div>

    <div v-else-if="reviews.length === 0" class="no-reviews">
      لا توجد تقييمات بعد
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
          <strong>{{ review.reviewer_name || 'زائر' }}</strong>
          <span class="review-date">{{ formatDate(review.created_at) }}</span>
        </div>

        <!-- Rating -->
        <div v-if="review.rating" class="rating">
          التقييم: {{ review.rating }}/5
        </div>

        <!-- Review Text -->
        <p class="review-text">{{ review.comment }}</p>

        <!-- Owner Response -->
        <div v-if="review.response_text" class="response-section">
          <div class="response-label">رد صاحب المطعم:</div>
          <div class="response-content">{{ review.response_text }}</div>
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
        const response = await axios.get(`/reviews/${this.ownerId}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('خطأ في جلب التقييمات:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
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
  direction: rtl;
  text-align: right;
}

.reviews-container h3 {
  font-family: 'Cairo', sans-serif;
  color: #333;
  margin-bottom: 1.5rem;
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
  border-right: 5px solid #FFD700;
  border-left: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.review-header strong {
  font-family: 'Cairo', sans-serif;
  color: #333;
}

.review-date {
  color: #666;
  font-size: 0.9em;
  font-family: 'Cairo', sans-serif;
}

.rating {
  color: #FFD700;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Cairo', sans-serif;
}

.review-text {
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
  font-family: 'Cairo', sans-serif;
}

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
  font-family: 'Cairo', sans-serif;
}

.response-content {
  color: #333;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-right: 3px solid #FFD700;
  border-left: none;
  font-family: 'Cairo', sans-serif;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
  font-family: 'Cairo', sans-serif;
}

.no-reviews {
  text-align: center;
  padding: 30px;
  color: #999;
  background: #f5f5f5;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
}
</style>
