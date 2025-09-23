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
          required
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
          required
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
      <div v-if="reviews.length === 0">No reviews available.</div>
      <div v-else>
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div>
            <strong>{{ review.reviewer_name }}</strong>
            <span>Rating: {{ review.rating }} / 5</span>
            <p>{{ review.comment }}</p>
            <p v-if="review.response">
              <strong>Your response: </strong>{{ review.response }}
            </p>

            <!-- Response input -->
            <div v-if="!review.response">
              <textarea
                v-model="review.responseInput"
                placeholder="Write your response..."
                class="form-control"
                required
              ></textarea>
              <button
                class="btn btn-secondary mt-2"
                @click="submitResponse(review.id, review.responseInput)"
                :disabled="isLoading"
              >
                Save Response
              </button>
            </div>
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
      logoPreview: null,
      isLoading: false,
      reviews: [],
    };
  },
  methods: {
    // Handle the logo image upload
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.logoPreview = URL.createObjectURL(file);
        this.profile.logo = file;
      }
    },

    // Fetch the profile data and reviews on page load
    async fetchProfile() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://ta3eem-backend.onrender.com/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          this.profile.bio = response.data.bio;
          this.profile.logo = response.data.logo;
          this.logoPreview = response.data.logo;
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    },

    // Fetch the reviews of the owner
    async fetchReviews() {
      const token = localStorage.getItem('token');
      const ownerId = 3; // Replace with dynamic user id logic if needed

      try {
        const response = await axios.get(`https://ta3eem-backend.onrender.com/api/reviews/${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        this.reviews = response.data;  // Assuming data is an array of reviews
        this.reviews.forEach(review => {
          review.responseInput = review.response || '';  // Bind existing response (if any)
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },

    // Save the updated profile
    async saveChanges() {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('bio', this.profile.bio);

      if (this.profile.logo) {
        formData.append('logo', this.profile.logo); // Add logo if uploaded
      }

      try {
        const token = localStorage.getItem('token'); // Get token from localStorage

        const response = await axios.put('https://ta3eem-backend.onrender.com/api/auth/profile', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        await this.fetchProfile();
        console.log('Profile updated successfully:', response.data);
        this.$router.push('/profile'); // Redirect to the profile page or show success message
        this.profile.bio = ''; // Clear bio input
        this.profile.logo = ''; // Clear logo input
        this.logoPreview = null; // Clear logo preview

      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // Submit response to a review
    async submitResponse(reviewId, response) {
      const token = localStorage.getItem('token');
      if (!response) return; // If no response, do not submit

      try {
        this.isLoading = true;

        const responseData = { response };
        const result = await axios.put(`https://ta3eem-backend.onrender.com/api/reviews/${reviewId}`, responseData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response saved successfully:', result.data);

        // Update the review with the response
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.response = response;  // Update the response field in the UI
          review.responseInput = '';  // Clear the input field after saving the response
        }
      } catch (error) {
        console.error('Error saving response:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  created() {
    // this.fetchProfile();
    this.fetchReviews(); // Fetch reviews as well
  },
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
