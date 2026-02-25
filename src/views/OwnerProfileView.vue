<template>
  <div class="container mt-4">
    <div v-if="!ownerIdFromRoute" class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-2">جاري تحميل بيانات صاحب المطعم...</p>
    </div>

    <div v-else-if="ownerProfile">
      <!-- Enhanced Profile Header -->
      <div class="profile-header mb-5 p-4 rounded-3 shadow-sm" style="background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);">
        <div class="d-flex flex-column flex-md-row align-items-center">
          <div class="profile-logo mb-3 mb-md-0 me-md-4">
            <img
              v-if="ownerProfile.logo"
              :src="getLogoUrl(ownerProfile.logo)"
              alt="شعار المطعم"
              class="img-fluid rounded-circle border border-4 border-white shadow"
              width="150"
            />
          </div>

          <div class="text-center text-md-start">
            <h2 class="mb-2 text-dark"> {{ ownerProfile.username }} </h2>
            <p class="lead mb-0 text-dark">{{ ownerProfile.bio }}</p>
            <div v-if="instagramDisplay" class="instagram-link mt-3">
              <a
                :href="`https://instagram.com/${instagramDisplay}`"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm"
                style="background-color: #E1306C; color: white;"
              >
                <i class="fab fa-instagram me-2"></i>
                @{{ instagramDisplay }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section mb-5">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">تقييمات العملاء</h3>
          <span class="badge rounded-pill" style="background-color: #FFD700; color: #333;">
            {{ reviews.length }} تقييم
          </span>
        </div>

        <div v-if="reviews.length">
          <div v-for="review in reviews" :key="review.id" class="review-card mb-3 p-4 rounded-3 shadow-sm">
            <div class="d-flex justify-content-between mb-2">
              <h5 class="mb-0 text-dark">{{ review.reviewer_name || 'زائر' }}</h5>
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
            <p v-if="review.response_text" class="owner-response p-2 rounded" style="background-color: rgba(255, 215, 0, 0.1);">
              <strong class="text-dark">رد صاحب المطعم:</strong> {{ review.response_text }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <p class="text-muted">لا توجد تقييمات بعد. كن أول من يقيم!</p>
        </div>
      </div>

      <!-- Review Form for non-owners -->
      <div v-if="!isOwner" class="review-form p-4 mb-4 rounded-3 shadow-sm" style="background-color: #f8f9fa;">
        <h4 class="mb-3 text-center">شاركنا تجربتك</h4>
        <form @submit.prevent="submitReview">
          <div class="mb-3">
            <label for="reviewer_name" class="form-label">اسمك</label>
            <input
              id="reviewer_name"
              v-model="newReview.reviewer_name"
              class="form-control"
              :class="{ 'is-invalid': errors.reviewer_name }"
              placeholder="أدخل اسمك"
            />
            <div v-if="errors.reviewer_name" class="invalid-feedback">
              {{ errors.reviewer_name }}
            </div>
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">تقييمك</label>
            <textarea
              id="comment"
              v-model="newReview.comment"
              class="form-control"
              :class="{ 'is-invalid': errors.comment }"
              rows="3"
              placeholder="شاركنا رأيك في هذا المطعم..."
            ></textarea>
            <div v-if="errors.comment" class="invalid-feedback">
              {{ errors.comment }}
            </div>
            <small class="text-muted">الحد الأدنى 10 أحرف</small>
          </div>

          <div class="mb-3">
            <label class="form-label">تقييمك بالنجوم</label>
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
            إرسال التقييم
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
          <i class="fas fa-utensils me-2"></i> استعرض القائمة الكاملة
        </router-link>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-2">جاري تحميل الملف الشخصي...</p>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
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
    ownerIdFromRoute() {
      return this.$route.params.id;
    },
    instagramDisplay() {
      return this.ownerProfile?.instagram || null;
    }
  },
  watch: {
    ownerIdFromRoute: {
      immediate: true,
      handler(newId) {
        if (newId) {
          console.log('جاري تحميل بيانات صاحب المطعم:', newId);
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
        const res = await axios.get(`https://ta3eem-backend.onrender.com/api/owners/${id}`);

        const profileData = {
          ...res.data,
          logo: res.data.logo && !res.data.logo.startsWith('http')
            ? `https://ta3eem-backend.onrender.com/${res.data.logo.startsWith('/') ? res.data.logo.slice(1) : res.data.logo}`
            : res.data.logo
        };

        this.ownerProfile = null;
        this.$nextTick(() => {
          this.ownerProfile = profileData;
        });

      } catch (err) {
        console.error('خطأ في جلب الملف الشخصي:', err);
      }
    },

    async fetchOwnerReviews() {
      const id = this.ownerIdFromRoute;
      if (!id) return;

      try {
        const res = await axios.get(`https://ta3eem-backend.onrender.com/api/reviews/${id}`);
        this.reviews = res.data;
      } catch (err) {
        console.error('خطأ في جلب التقييمات:', err);
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    async submitReview() {
      this.errors = {
        reviewer_name: '',
        comment: '',
        rating: ''
      };

      let isValid = true;

      if (!this.newReview.reviewer_name.trim()) {
        this.errors.reviewer_name = 'الاسم مطلوب';
        isValid = false;
      }

      if (this.newReview.comment.trim().length < 10) {
        this.errors.comment = 'التعليق يجب أن يكون 10 أحرف على الأقل';
        isValid = false;
      }

      if (this.newReview.rating < 1 || this.newReview.rating > 5) {
        this.errors.rating = 'الرجاء اختيار تقييم بين 1 و 5';
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

        this.newReview = {
          reviewer_name: '',
          comment: '',
          rating: 5
        };

        await this.fetchOwnerReviews();
        this.notify('تم إرسال التقييم بنجاح');
      } catch (err) {
        console.error('خطأ في إرسال التقييم:', err);
        this.notify(err.response?.data?.message || 'فشل إرسال التقييم');
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
.instagram-link a {
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 500;
  font-family: 'Cairo', sans-serif;
}

.instagram-link a:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.container {
  padding-top: 50px;
  direction: rtl;
  text-align: right;
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
  border-right: 4px solid #FFD700;
  border-left: none;
}

.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.owner-response {
  border-right: 3px solid #FFD700;
  border-left: none;
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
  font-family: 'Cairo', sans-serif;
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
  font-family: 'Cairo', sans-serif;
}

.btn-view-menu:hover {
  background-color: #555;
  color: #FFC107;
}

h2, h3, h4, h5 {
  font-family: 'Cairo', sans-serif;
}

p, label, small, .form-control, .btn {
  font-family: 'Cairo', sans-serif;
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
