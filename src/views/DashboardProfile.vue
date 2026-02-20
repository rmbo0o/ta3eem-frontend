<template>
  <div class="container mt-4">
    <h2>Manage Your Profile</h2>

    <!-- Profile Management Form -->
    <form @submit.prevent="saveChanges">
      <!-- Bio Field -->
      <div class="form-group">
        <label for="bio">Bio</label>
        <textarea
          v-model="profile.bio"
          id="bio"
          class="form-control"
          placeholder="Enter your bio"
        ></textarea>
      </div>

      <!-- Image Upload Section -->
      <div class="form-group">
        <label for="logo">Logo (Image Upload)</label>
        <input
          type="file"
          id="logo"
          accept="image/*"
          class="form-control-file"
          @change="handleImageUpload"
        />

        <!-- Logo Preview -->
        <div v-if="logoPreview" class="mt-2">
          <img :src="logoPreview" alt="Logo Preview" class="img-fluid" width="150" />
        </div>
      </div>

      <!-- Save Button -->
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>

    <!-- Reviews Section -->
    <div class="mt-4">
      <h3>Your Reviews</h3>

      <!-- Debug info - remove after fixing -->
      <div v-if="debug" class="alert alert-info">
        User ID: {{ user.id }}<br>
        Reviews count: {{ reviews.length }}
      </div>

      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div v-else-if="reviews.length === 0">
        No reviews available for this owner.
      </div>

      <div v-else>
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div>
            <strong>{{ review.reviewer_name || 'Anonymous' }}</strong>
            <span v-if="review.rating" class="badge bg-warning ms-2">
              Rating: {{ review.rating }}/5
            </span>
            <p class="mt-2">{{ review.comment }}</p>
            <small class="text-muted">
              {{ formatDate(review.created_at) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  data() {
    return {
      profile: {
        bio: '',
        logo: null,
      },
      user: {
        id: null,
        username: '',
        email: ''
      },
      logoPreview: null,
      isLoading: false,
      reviews: [],
      debug: true // Set to false in production
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.logoPreview = URL.createObjectURL(file);
        this.profile.logo = file;
      }
    },

    async fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        this.isLoading = true;
        const response = await axios.get('/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Profile response:', response.data);

        this.profile.bio = response.data.bio || '';
        this.profile.logo = response.data.logo || null;
        this.logoPreview = response.data.logo || null;

        // Store user info
        this.user = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email
        };

        // After getting user ID, fetch their reviews
        if (this.user.id) {
          await this.fetchReviews(this.user.id);
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReviews(ownerId) {
      const token = localStorage.getItem('token');

      console.log('Fetching reviews for owner ID:', ownerId);

      try {
        const response = await axios.get(`/reviews/${ownerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Reviews API response:', response.data);
        this.reviews = response.data || [];

      } catch (error) {
        console.error('Error fetching reviews:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      }
    },

    async saveChanges() {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('bio', this.profile.bio);
      if (this.profile.logo) {
        formData.append('logo', this.profile.logo);
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.put('/auth/profile', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Profile updated:', response.data);
        await this.fetchProfile(); // Refresh profile data

      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        this.isLoading = false;
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
  },

  async created() {
    await this.fetchProfile(); // Uncommented and added await
  }
};
</script>

<style scoped>
/* Base Styles */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2, h3 {
  color: #2d333f;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.8rem;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 0.5rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.8rem;
}

label {
  font-weight: 600;
  color: #2d333f;
  display: block;
  margin-bottom: 0.5rem;
}

.form-control {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.75rem;
  width: 100%;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #FFD700;
  box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.25);
}

textarea.form-control {
  height: 150px;
  resize: vertical;
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #FFD700;
  color: #2d333f;
}

.btn-primary:hover:not(:disabled) {
  background-color: #FFC107;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #2d333f;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e9ecef;
}

button:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Image Upload Preview */
.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 4px;
  background: white;
}

/* Reviews Section */
.review-item {
  padding: 1.25rem;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
  transition: all 0.3s ease;
}

.review-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.review-item strong {
  color: #2d333f;
  font-weight: 600;
}

.review-item span {
  color: #6c757d;
  margin-left: 1rem;
  font-size: 0.9rem;
}

.review-item p {
  color: #495057;
  margin: 0.5rem 0;
}

/* Loading State (if you want to add a spinner later) */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-top: 3px solid #FFD700;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
  }

  .review-item {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 1rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
