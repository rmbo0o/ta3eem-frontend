<template>
  <div class="container mt-4">
    <!-- Debug banner - remove after confirming it works -->


    <div v-if="!ownerIdFromRoute" class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading owner data...</p>
    </div>

    <div v-else-if="ownerProfile">
      <!-- Enhanced Profile Header -->
      <div class="profile-header mb-5 p-4 rounded-3 shadow-sm" style="background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);">
        <div class="d-flex flex-column flex-md-row align-items-center">
          <div class="profile-logo mb-3 mb-md-0 me-md-4">
            <img
              v-if="ownerProfile.logo"
              :src="getLogoUrl(ownerProfile.logo)"
              alt="Owner Logo"
              class="img-fluid rounded-circle border border-4 border-white shadow"
              width="150"
            />
          </div>
          <div class="text-center text-md-start">
            <h2 class="mb-2 text-dark">{{ ownerProfile.username }}'s Profile</h2>
            <p class="lead mb-0 text-dark">{{ ownerProfile.bio }}</p>
          </div>
        </div>
      </div>

      <!-- Reviews Section with Enhanced Styling -->
      <div class="reviews-section mb-5">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">Customer Reviews</h3>
          <span class="badge rounded-pill" style="background-color: #FFD700; color: #333;">
            {{ reviews.length }} reviews
          </span>
        </div>

        <div v-if="reviews.length">
          <div v-for="review in reviews" :key="review.id" class="review-card mb-3 p-4 rounded-3 shadow-sm">
            <div class="d-flex justify-content-between mb-2">
              <h5 class="mb-0 text-dark">{{ review.reviewer_name || 'Anonymous' }}</h5>
              <div>
                <span v-for="n in 5" :key="n">
                  <i
                    class="fa-star"
                    :class="n <= review.rating ? 'fas text-warning' : 'far text-muted'"
                  ></i>
                </span>
              </div>
            </div>
            <p class="text-muted mb-2"><small>{{ formatDate(review.created_at) }}</small></p>
            <p class="mb-2">{{ review.comment }}</p>
            <!-- Owner Response - Now correctly displays -->
            <p v-if="review.response_text" class="owner-response p-2 rounded" style="background-color: rgba(255, 215, 0, 0.1);">
              <strong class="text-dark">Owner Response:</strong> {{ review.response_text }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <p class="text-muted">No reviews yet. Be the first to review!</p>
        </div>
      </div>

      <!-- Review Form for non-owners -->
      <div v-if="!isOwner" class="review-form p-4 mb-4 rounded-3 shadow-sm" style="background-color: #f8f9fa;">
        <h4 class="mb-3 text-center">Share Your Experience</h4>
        <form @submit.prevent="submitReview">
          <div class="mb-3">
            <label for="reviewer_name" class="form-label">Your Name</label>
            <input
              id="reviewer_name"
              v-model="newReview.reviewer_name"
              class="form-control"
              :class="{ 'is-invalid': errors.reviewer_name }"
              placeholder="Enter your name"
            />
            <div v-if="errors.reviewer_name" class="invalid-feedback">
              {{ errors.reviewer_name }}
            </div>
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">Your Review</label>
            <textarea
              id="comment"
              v-model="newReview.comment"
              class="form-control"
              :class="{ 'is-invalid': errors.comment }"
              rows="3"
              placeholder="Share your thoughts about this restaurant..."
            ></textarea>
            <div v-if="errors.comment" class="invalid-feedback">
              {{ errors.comment }}
            </div>
            <small class="text-muted">Minimum 10 characters required</small>
          </div>

          <div class="mb-3">
            <label class="form-label">Your Rating</label>
            <div class="star-rating">
              <i
                v-for="n in 5"
                :key="n"
                class="fa-star fa-lg me-1"
                :class="n <= newReview.rating ? 'fas text-warning' : 'far text-muted'"
                @click="newReview.rating = n"
              ></i>
            </div>
            <div v-if="errors.rating" class="invalid-feedback d-block">
              {{ errors.rating }}
            </div>
          </div>

          <button type="submit" class="btn w-100" style="background-color: #FFD700; color: #333; border: none;">
            Submit Review
          </button>
        </form>
      </div>

      <!-- Menu Button -->
      <div class="text-center mt-4">
        <router-link
          :to="`/owner/${ownerIdFromRoute}/menu`"
          class="btn btn-lg px-4"
          style="background-color: #333; color: #FFD700;"
        >
          <i class="fas fa-utensils me-2"></i> Explore Full Menu
        </router-link>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading profile...</p>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  // No props needed - we'll use $route.params.id directly
  data() {
    return {
      ownerProfile: null,
      reviews: [],
      newReview: {
        reviewer_name: '',
        comment: '',
        rating: 5,
      },
      errors: {
        reviewer_name: '',
        comment: '',
        rating: ''
      },
      isOwner: false,
    };
  },
  computed: {
    // Get owner ID directly from the route params
    ownerIdFromRoute() {
      return this.$route.params.id;
    }
  },
  watch: {
    // Watch for changes in the route ID
    ownerIdFromRoute: {
      immediate: true,
      handler(newId) {
        if (newId) {
          console.log('Loading data for owner:', newId);
          this.checkIfOwner();
          this.fetchOwnerProfile();
          this.fetchOwnerReviews();
        }
      }
    }
  },
  methods: {
    getLogoUrl(path) {
      if (!path) return '';
      return path.startsWith('http') ? path : `https://ta3eem-backend.onrender.com/${path}`;
    },

    checkIfOwner() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        this.isOwner = decoded.id == this.ownerIdFromRoute;
      } catch {
        this.isOwner = false;
      }
    },

    async fetchOwnerProfile() {
      const id = this.ownerIdFromRoute;
      if (!id) return;

      try {
        console.log('Fetching profile for owner:', id);
        const res = await axios.get(`https://ta3eem-backend.onrender.com/api/owners/${id}`);
        if (res.data.logo && !res.data.logo.startsWith('http')) {
          res.data.logo = `https://ta3eem-backend.onrender.com/${res.data.logo.startsWith('/') ? res.data.logo.slice(1) : res.data.logo}`;
        }
        this.ownerProfile = res.data;
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    },

    async fetchOwnerReviews() {
      const id = this.ownerIdFromRoute;
      if (!id) return;

      try {
        console.log('Fetching reviews for owner:', id);
        const res = await axios.get(`https://ta3eem-backend.onrender.com/api/reviews/${id}`);
        this.reviews = res.data;
        console.log('Reviews loaded:', this.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    async submitReview() {
      // Reset errors
      this.errors = {
        reviewer_name: '',
        comment: '',
        rating: ''
      };

      // Validate inputs
      let isValid = true;

      if (!this.newReview.reviewer_name.trim()) {
        this.errors.reviewer_name = 'Name is required';
        isValid = false;
      }

      if (this.newReview.comment.trim().length < 10) {
        this.errors.comment = 'Comment must be at least 10 characters';
        isValid = false;
      }

      if (this.newReview.rating < 1 || this.newReview.rating > 5) {
        this.errors.rating = 'Please select a rating between 1 and 5';
        isValid = false;
      }

      if (!isValid) return;

      try {
        const response = await axios.post('https://ta3eem-backend.onrender.com/api/reviews', {
          owner_id: this.ownerIdFromRoute,
          reviewer_name: this.newReview.reviewer_name,
          comment: this.newReview.comment,
          rating: this.newReview.rating
        });

        // Reset form on success
        this.newReview = {
          reviewer_name: '',
          comment: '',
          rating: 5
        };

        await this.fetchOwnerReviews();
        this.notify(response.data.message || 'Review submitted successfully');
      } catch (err) {
        console.error('Error submitting review:', err);
        this.notify(err.response?.data?.message || 'Failed to submit review');
      }
    },

    notify(message) {
      const toast = document.createElement('div');
      toast.innerText = message;
      toast.className = 'toast-message';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 50px;
}

.profile-header {
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.profile-logo img {
  transition: transform 0.3s ease;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-logo img:hover {
  transform: scale(1.05);
}

.review-card {
  background-color: white;
  transition: all 0.3s ease;
  border-left: 4px solid #FFD700;
}

.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.owner-response {
  border-left: 3px solid #FFD700;
}

.star-rating i {
  transition: all 0.2s ease;
  cursor: pointer;
}

.star-rating i:hover {
  transform: scale(1.2);
}

.toast-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #FFD700;
  padding: 12px 24px;
  border-radius: 30px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
}

.btn-view-menu {
  background-color: #333;
  color: #FFD700;
  border: none;
  padding: 8px 15px;
  margin-bottom: 40px;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-view-menu:hover {
  background-color: #555;
  color: #FFC107;
}

@media (max-width: 768px) {
  .profile-header {
    text-align: center;
  }

  .profile-logo {
    margin: 0 auto 1rem;
  }
}
</style>
