<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>إدارة الملف الشخصي</h2>
    </div>

    <!-- Profile Management Form -->
    <div class="profile-section">
      <form @submit.prevent="saveChanges">
        <!-- Bio Field -->
        <div class="form-group">
          <label for="bio">نبذة عني</label>
          <textarea
            v-model="profile.bio"
            id="bio"
            class="form-control"
            placeholder="أدخل نبذة عنك"
            rows="4"
          ></textarea>
        </div>

        <!-- Instagram Field -->
        <div class="form-group">
          <label for="instagram">حساب إنستغرام</label>
          <div class="instagram-input-wrapper">
            <span class="instagram-prefix">@</span>
            <input
              id="instagram"
              v-model="profile.instagram"
              type="text"
              class="form-control instagram-input"
              placeholder="اسم المستخدم (مثال: foodie_owner)"
            />
          </div>
          <small class="text-muted">أدخل اسم المستخدم بدون @</small>
        </div>

        <!-- Image Upload Section -->
        <div class="form-group">
          <label for="logo">الشعار (رفع صورة)</label>
          <div class="file-input-wrapper">
            <input
              type="file"
              id="logo"
              accept="image/*"
              @change="handleImageUpload"
              class="file-input"
            />
            <label for="logo" class="file-label">اختر ملف</label>
            <span class="file-name">{{ fileName || 'لم يتم اختيار ملف' }}</span>
          </div>

          <!-- Logo Preview -->
          <div v-if="logoPreview" class="logo-preview">
            <img :src="logoPreview" alt="معاينة الشعار" />
          </div>
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          class="btn-save"
          :disabled="isLoading"
        >
          {{ isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
        </button>
      </form>
    </div>

    <!-- Reviews Section -->
    <div class="reviews-section">
      <h3>تقييمات العملاء</h3>

      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">جاري التحميل...</span>
        </div>
      </div>

      <div v-else-if="reviews.length === 0" class="no-reviews">
        لا توجد تقييمات لهذا المطعم
      </div>

      <div v-else class="reviews-list">
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <div class="reviewer-info">
              <h4>{{ review.reviewer_name || 'زائر' }}</h4>
              <div class="rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= review.rating }">★</span>
                <span class="rating-value">{{ review.rating }}/5</span>
              </div>
            </div>
            <span class="review-date">{{ formatDate(review.created_at) }}</span>
          </div>

          <p class="review-text">{{ review.comment }}</p>

          <!-- Owner's Response -->
          <div v-if="review.response_text" class="owner-response">
            <div class="response-header">
              <span class="owner-label">ردك:</span>
            </div>
            <p class="response-text">{{ review.response_text }}</p>
          </div>

          <!-- Response Input (only if no response yet) -->
          <div v-if="!review.response_text" class="response-form">
            <textarea
              v-model="review.responseInput"
              placeholder="اكتب ردك على هذا التقييم..."
              class="response-input"
              rows="3"
            ></textarea>
            <button
              class="btn-response"
              @click="submitResponse(review.id, review.responseInput)"
              :disabled="isLoading || !review.responseInput"
            >
              نشر الرد
            </button>
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
        instagram: '',
        bio: '',
        logo: null,
      },
      user: {
        id: null,
        username: '',
        email: ''
      },
      logoPreview: null,
      fileName: '',
      isLoading: false,
      reviews: [],
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        this.logoPreview = URL.createObjectURL(file);
        this.profile.logo = file;
      }
    },

    async fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('لا يوجد رمز دخول');
        return;
      }

      try {
        this.isLoading = true;
        const response = await axios.get('/auth/profile');

        this.profile.bio = response.data.bio || '';
        this.profile.instagram = response.data.instagram || '';
        this.profile.logo = response.data.logo || null;
        this.logoPreview = response.data.logo || null;

        this.user = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email
        };

        if (this.user.id) {
          await this.fetchReviews(this.user.id);
        }

      } catch (error) {
        console.error('خطأ في جلب الملف الشخصي:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReviews(ownerId) {
      try {
        const response = await axios.get(`/reviews/${ownerId}`);
        this.reviews = response.data.map(review => ({
          ...review,
          responseInput: ''
        })) || [];
      } catch (error) {
        console.error('خطأ في جلب التقييمات:', error);
      }
    },

    async saveChanges() {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('bio', this.profile.bio);
      formData.append('instagram', this.profile.instagram);

      if (this.profile.logo && this.profile.logo instanceof File) {
        formData.append('logo', this.profile.logo);
      }

      try {
        const response = await axios.put('/auth/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        await this.fetchProfile();
        alert('تم تحديث الملف الشخصي بنجاح!');
        this.fileName = '';

      } catch (error) {
        console.error('خطأ في تحديث الملف الشخصي:', error);
        alert(error.response?.data?.message || 'حدث خطأ أثناء التحديث');
      } finally {
        this.isLoading = false;
      }
    },

    async submitResponse(reviewId, responseText) {
      if (!responseText || !responseText.trim()) return;

      try {
        this.isLoading = true;

        const response = await axios.put(`/reviews/${reviewId}`, {
          response_text: responseText
        });

        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.response_text = responseText;
          review.responseInput = '';
        }

      } catch (error) {
        console.error('خطأ في حفظ الرد:', error);
      } finally {
        this.isLoading = false;
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
    },

    logout() {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  },

  async created() {
    await this.fetchProfile();
  }
};
</script>

<style scoped>
.instagram-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 5px;
  overflow: hidden;
}

.instagram-prefix {
  background-color: #444;
  color: #FFD700;
  padding: 0.75rem;
  font-weight: bold;
  border-left: 1px solid #555;
  border-right: none;
}

.instagram-input {
  border: none !important;
  border-radius: 0 !important;
  background-color: #333 !important;
}

.instagram-input:focus {
  box-shadow: none !important;
}

.text-muted {
  color: #999 !important;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.dashboard-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem;
  background-color: white;
  min-height: 100vh;
  color: #ffffff;
  direction: rtl;
  text-align: right;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #FFD700;
}

h2, h3 {
  color: #FFD700;
  margin: 0;
  font-family: 'Cairo', sans-serif;
}

h3 {
  margin-bottom: 1.5rem;
}

.profile-section {
  background-color: #2d2d2d;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.8rem;
}

label {
  font-weight: 600;
  color: #FFD700;
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'Cairo', sans-serif;
}

.form-control {
  background-color: #333;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 0.75rem;
  width: 100%;
  color: #fff;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
  text-align: right;
}

.form-control:focus {
  border-color: #FFD700;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.25);
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-label {
  background-color: #444;
  color: #FFD700;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid #FFD700;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.file-label:hover {
  background-color: #FFD700;
  color: #333;
}

.file-name {
  color: #999;
  font-family: 'Cairo', sans-serif;
}

.logo-preview {
  margin-top: 1rem;
  border: 2px solid #FFD700;
  border-radius: 10px;
  padding: 0.5rem;
  display: inline-block;
  background-color: #333;
}

.logo-preview img {
  max-width: 150px;
  max-height: 150px;
  border-radius: 5px;
}

.btn-save {
  background-color: #FFD700;
  color: #333;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 1.1rem;
  font-family: 'Cairo', sans-serif;
}

.btn-save:hover:not(:disabled) {
  background-color: #FFC107;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.btn-save:disabled {
  background-color: #666;
  color: #999;
  cursor: not-allowed;
}

.reviews-section {
  background-color: #2d2d2d;
  padding: 2rem;
  border-radius: 10px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background-color: #333;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #444;
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviewer-info h4 {
  color: #FFD700;
  margin: 0 0 0.5rem 0;
  font-family: 'Cairo', sans-serif;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star {
  color: #444;
  font-size: 1.2rem;
}

.star.filled {
  color: #FFD700;
}

.rating-value {
  margin-right: 0.5rem;
  margin-left: 0;
  color: #999;
  font-size: 0.9rem;
}

.review-date {
  color: #999;
  font-size: 0.9rem;
  font-family: 'Cairo', sans-serif;
}

.review-text {
  color: #fff;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-family: 'Cairo', sans-serif;
}

.owner-response {
  background-color: #2d2d2d;
  border-right: 3px solid #FFD700;
  border-left: none;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 5px 0 0 5px;
}

.response-header {
  margin-bottom: 0.5rem;
}

.owner-label {
  color: #FFD700;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: 'Cairo', sans-serif;
}

.response-text {
  color: #ddd;
  margin: 0;
  font-family: 'Cairo', sans-serif;
}

.response-form {
  margin-top: 1rem;
}

.response-input {
  width: 100%;
  background-color: #2d2d2d;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 0.75rem;
  color: #fff;
  margin-bottom: 0.5rem;
  font-family: 'Cairo', sans-serif;
  text-align: right;
}

.response-input:focus {
  border-color: #FFD700;
  outline: none;
}

.btn-response {
  background-color: transparent;
  color: #FFD700;
  border: 1px solid #FFD700;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.btn-response:hover:not(:disabled) {
  background-color: #FFD700;
  color: #333;
}

.btn-response:disabled {
  border-color: #666;
  color: #666;
  cursor: not-allowed;
}

.no-reviews {
  text-align: center;
  color: #999;
  padding: 2rem;
  background-color: #333;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
  color: #FFD700;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

.text-center {
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .profile-section,
  .reviews-section {
    padding: 1.5rem;
  }

  .review-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .file-input-wrapper {
    flex-wrap: wrap;
  }
}
</style>
