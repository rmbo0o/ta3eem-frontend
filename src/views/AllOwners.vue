<template>
  <div class="owners-container">
    <h2 class="section-title">جميع أصحاب المطاعم</h2>

    <!-- Search Field -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        class="search-input"
        placeholder="ابحث عن اسم صاحب المطعم..."
        @input="debouncedSearch"
      />
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-2">جاري تحميل أصحاب المطاعم...</p>
    </div>

    <!-- Owner List -->
    <div v-else class="owners-grid">
      <div class="owner-card" v-for="owner in owners" :key="owner.id">
        <div class="card-image-wrapper">
          <img
            :src="getImageUrl(owner.logo)"
            class="card-image"
            alt="صورة صاحب المطعم"
            @error="setFallbackImage($event)"
          />
        </div>
        <div class="card-content">
          <h3 class="owner-name">{{ owner.username }}</h3>
          <button class="view-profile-btn" @click="viewProfile(owner.id)">
            عرض الملف الشخصي
          </button>
        </div>
      </div>
    </div>

    <!-- No Results Found -->
    <div v-if="!loading && owners.length === 0" class="text-center mt-4">
      <p class="text-muted">لا يوجد أصحاب مطاعم يطابقون "{{ searchQuery }}"</p>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls" v-if="!loading && owners.length > 0">
      <button
        class="pagination-btn"
        @click="prevPage"
        :disabled="page <= 1">
        السابق
      </button>
      <span class="page-indicator">صفحة {{ page }}</span>
      <button class="pagination-btn" @click="nextPage">
        التالي
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FallbackImage from "@/assets/no-image.png";

export default {
  data() {
    return {
      owners: [],
      searchQuery: "",
      page: 1,
      limit: 6,
      fallbackImage: FallbackImage,
      loading: false,
      searchTimeout: null
    };
  },
  methods: {
    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.page = 1;
        this.fetchOwners();
      }, 500);
    },

    async fetchOwners() {
      this.loading = true;

      const params = new URLSearchParams();

      if (this.searchQuery && this.searchQuery.trim() !== '') {
        params.append('search', this.searchQuery.trim());
      }

      params.append('page', this.page);
      params.append('limit', this.limit);

      const apiUrl = `https://ta3eem-backend.onrender.com/api/owners?${params.toString()}`;

      try {
        const response = await axios.get(apiUrl);
        this.owners = response.data;
      } catch (error) {
        console.error("خطأ في جلب أصحاب المطاعم:", error);
        this.owners = [];
      } finally {
        this.loading = false;
      }
    },

    viewProfile(ownerId) {
      this.$router.push(`/owner/${ownerId}`);
    },

    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchOwners();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextPage() {
      this.page++;
      this.fetchOwners();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    getImageUrl(imagePath) {
      if (!imagePath) return this.fallbackImage;
      if (imagePath.startsWith("http")) {
        return imagePath;
      }
      return imagePath ? `https://ta3eem-backend.onrender.com${imagePath}` : this.fallbackImage;
    },

    setFallbackImage(event) {
      event.target.src = this.fallbackImage;
    }
  },
  mounted() {
    this.fetchOwners();
  }
};
</script>

<style scoped>
.owners-container {
  padding: 2rem;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 100px;
  direction: rtl;
  text-align: right;
}

.section-title {
  color: #FFD700;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-family: 'Cairo', sans-serif;
  font-weight: 700;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #FFD700;
  background-color: #3a4252;
  color: #ffffff;
  font-family: 'Cairo', sans-serif;
  text-align: right;
}

.search-input::placeholder {
  color: #e0e0e0;
}

.owners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.owner-card {
  background-color: #3a4252;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.owner-card:hover {
  transform: translateY(-5px);
}

.card-image-wrapper {
  height: 200px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.owner-card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
  text-align: center;
}

.owner-name {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-family: 'Cairo', sans-serif;
}

.view-profile-btn {
  background-color: #FFD700;
  color: #2d333f;
  border: none;
  padding: 0.75rem;
  width: 100%;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.view-profile-btn:hover {
  background-color: #ffdf33;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  background-color: transparent;
  color: #FFD700;
  border: 2px solid #FFD700;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #FFD700;
  color: #2d333f;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  color: #ffffff;
  font-weight: 500;
  font-family: 'Cairo', sans-serif;
}

.spinner-border.text-warning {
  color: #FFD700 !important;
}

.text-muted {
  font-family: 'Cairo', sans-serif;
}

@media (max-width: 768px) {
  .owners-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 576px) {
  .owners-container {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
