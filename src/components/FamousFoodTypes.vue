<template>
  <div class="hero-section">
    <div class="hero-content">
      <h2 class="mb-3 text-center">أشهر أنواع الأكل</h2>

      <!-- Search and Filters -->
      <div class="row mb-4">
        <div class="col-md-6 mb-3">
          <input
            v-model="searchType"
            class="form-control"
            placeholder="ابحث عن نوع الأكل (مثل: مندي، سلطة، بيتزا)"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="col-md-3 mb-3">
          <input
            v-model.number="minPrice"
            class="form-control"
            placeholder="أقل سعر"
            type="number"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="col-md-3 mb-3">
          <input
            v-model.number="maxPrice"
            class="form-control"
            placeholder="أعلى سعر"
            type="number"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>

      <!-- Search and Clear Buttons -->
      <div class="d-flex justify-content-center mb-3">
        <button class="btn btn-primary me-2" @click="handleSearch">بحث</button>
        <button class="btn btn-clear btn-outline-primary me-2" @click="clearFilters">مسح</button>
      </div>

      <div class="d-flex flex-wrap justify-content-center mb-4">
        <button
          class="btn btn-outline-primary mb-2"
          @click="fetchAllFoodItems">
          عرض الكل
        </button>
      </div>
    </div>
  </div>

  <div class="container mt-4">
    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">جاري تحميل الأصناف...</p>
    </div>

    <!-- No Results Found -->
    <div v-if="foodItems.length === 0 && !loading" class="text-center mt-4">
      <p class="text-muted">لم يتم العثور على أصناف. جرب نوع آخر أو غير نطاق السعر.</p>
    </div>

    <!-- Food Items List -->
    <div class="row">
      <div class="col-md-4 mb-4" v-for="item in foodItems" :key="item.id">
        <div class="card h-100 shadow-sm">
          <img :src="getImageUrl(item.image_url)" class="card-img-top" :alt="item.food_name" />
          <div class="card-body">
            <h5 class="card-title">{{ item.food_name }}</h5>
            <p class="card-text">{{ item.description }}</p>
            <p class="card-text"><strong>السعر:</strong> {{ formatPrice(item.price) }} ر.س</p>
            <p class="card-text">
              <strong>صاحب المطعم:</strong> {{ item.owner_name || 'غير معروف' }}
            </p>
            <button class="btn btn-primary w-100" @click="viewOwnerMenu(item.owner_id)">
              عرض القائمة الكاملة
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchType: "",
      minPrice: null,
      maxPrice: null,
      foodItems: [],
      loading: false,
      popularTypes: ["مندي", "سلطة", "بيتزا", "برجر", "باستا", "مشروبات"],
    };
  },
  methods: {
    async fetchFoodItems() {
      this.loading = true;

      const params = new URLSearchParams();

      if (this.searchType && this.searchType.trim() !== '') {
        params.append('type', this.searchType.trim());
      }

      if (this.minPrice && this.minPrice > 0) {
        params.append('minPrice', this.minPrice);
      }

      if (this.maxPrice && this.maxPrice > 0) {
        params.append('maxPrice', this.maxPrice);
      }

      const apiUrl = `https://ta3eem-backend.onrender.com/api/menu/food-items${params.toString() ? '?' + params.toString() : ''}`;

      try {
        const response = await axios.get(apiUrl);
        this.foodItems = response.data;
      } catch (error) {
        console.error("خطأ في جلب الأصناف:", error);
        this.foodItems = [];
      } finally {
        this.loading = false;
      }

      setTimeout(() => {
        window.scrollBy({
          top: 500,
          behavior: 'smooth'
        });
      }, 100);
    },

    async fetchAllFoodItems() {
      this.loading = true;
      this.searchType = "";

      const params = new URLSearchParams();

      if (this.minPrice && this.minPrice > 0) {
        params.append('minPrice', this.minPrice);
      }

      if (this.maxPrice && this.maxPrice > 0) {
        params.append('maxPrice', this.maxPrice);
      }

      const apiUrl = `https://ta3eem-backend.onrender.com/api/menu/food-items${params.toString() ? '?' + params.toString() : ''}`;

      try {
        const response = await axios.get(apiUrl);
        this.foodItems = response.data;
      } catch (error) {
        console.error("خطأ في جلب جميع الأصناف:", error);
        this.foodItems = [];
      } finally {
        this.loading = false;
      }

      setTimeout(() => {
        window.scrollBy({
          top: 500,
          behavior: 'smooth'
        });
      }, 100);
    },

    handleSearch() {
      this.fetchFoodItems();
    },

    clearFilters() {
      this.searchType = "";
      this.minPrice = null;
      this.maxPrice = null;
      this.foodItems = [];
    },

    viewOwnerMenu(ownerId) {
      if (ownerId) {
        this.$router.push(`/owner/${ownerId}/menu`);
      } else {
        console.error("معرف صاحب المطعم مفقود");
      }
    },

    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith("http")) {
        return imagePath;
      }
      return `https://ta3eem-backend.onrender.com${imagePath}`;
    },

    formatPrice(price) {
      const num = parseFloat(price);
      return isNaN(num) ? '0.00' : num.toFixed(2);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  direction: rtl;
  text-align: right;
}

.hero-section {
  background-image: url('@/assets/background.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  height: 70vh;
  min-height: 600px;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: right;
  position: relative;
  color: #fff;
  padding: 0 5%;
}

.hero-content {
  max-width: 600px;
  margin: 0;
  padding-top: 80px;
}

.hero-content h2 {
  font-family: 'Cairo', sans-serif;
  font-weight: 700;
}

.card {
  transition: all 0.3s ease;
  border: none;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #333;
  text-align: right;
}

.card:hover {
  transform: translateY(-5px);
  background-color: #FFC107;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #222;
  font-family: 'Cairo', sans-serif;
}

.card-text {
  font-family: 'Cairo', sans-serif;
  line-height: 1.6;
}

.btn-primary {
  background-color: #333;
  border-color: #333;
  margin-top: 1rem;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.btn-primary:hover {
  background-color: #555;
  border-color: #555;
}

.spinner-border.text-primary {
  color: #FFD700 !important;
}

.btn-outline-primary {
  color: #333;
  border-color: #333;
  font-family: 'Cairo', sans-serif;
}

.btn-outline-primary:hover {
  background-color: #333;
  color: #FFD700;
}

.btn-clear {
  height: 38px;
  width: 72px;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .card {
    margin-bottom: 1.5rem;
  }

  .hero-section {
    height: 60vh;
    min-height: 500px;
  }
}
</style>
