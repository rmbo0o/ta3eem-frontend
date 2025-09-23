<template>
  <div class="featured-profiles-container">
    <h2 class="section-title">Featured Profiles</h2>

    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading profiles...</p>
    </div>

    <div class="profiles-grid">
      <div
        class="profile-card"
        v-for="profile in featuredProfiles"
        :key="profile.id"
      >
        <div class="card-image-container">
          <img
            :src="getImageUrl(profile.logo)"
            class="card-image"
            alt="Profile Image"
            @error="setFallbackImage($event)"
          />
        </div>
        <div class="card-content">
          <h3 class="profile-name">{{ profile.username }}</h3>
          <p class="info-text">
            <span>Average Rating: </span>
            <span class="gold-accent">{{ profile.average_rating ? parseFloat(profile.average_rating).toFixed(1) : "N/A" }}</span>
          </p>
          <p class="info-text">
            <span>Total Reviews: </span>
            <span class="gold-accent">{{ profile.total_reviews || 0 }}</span>
          </p>
          <button class="view-profile-btn" @click="viewProfile(profile.id)">
            VIEW PROFILE
          </button>
        </div>
      </div>
    </div>

    <div class="see-more-container">
      <button class="see-more-btn" @click="viewAllProfiles">
        See More Profiles
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
      featuredProfiles: [],
      loading: false,
      fallbackImage: FallbackImage,
    };
  },
  methods: {
    async fetchFeaturedProfiles() {
      this.loading = true;
      try {
        const response = await axios.get("https://ta3eem-backend.onrender.com/api/profiles/featured");
        this.featuredProfiles = response.data.slice(0, 3);
      } catch (error) {
        console.error("Error fetching featured profiles:", error);
      } finally {
        this.loading = false;
      }
    },
    viewProfile(ownerId) {
      this.$router.push(`/owner/${ownerId}`);
    },
    viewAllProfiles() {
      this.$router.push(`/owners`);
    },
    getImageUrl(imagePath) {
      if (imagePath && imagePath.startsWith("http")) {
        return imagePath;
      }
      return imagePath ? `https://ta3eem-backend.onrender.com${imagePath}` : this.fallbackImage;
    },
    setFallbackImage(event) {
      event.target.src = this.fallbackImage;
    }
  },
  mounted() {
    this.fetchFeaturedProfiles();
  }
};
</script>

<style scoped>
/* Container - No background color */
.featured-profiles-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  color: #FFD700;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

/* Loading Indicator */
.loading-indicator {
  text-align: center;
  color: #2d333f;
}

.spinner {
  border: 4px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  border-top: 4px solid #FFD700;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Profiles Grid - Equal height cards */
.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

/* Profile Card - Fixed size with background */
.profile-card {
  background-color: #3a4252;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  height: 400px; /* Fixed height */
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

.card-image-container {
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.profile-card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.profile-name {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-text {
  color: #e0e0e0;
  margin-bottom: 0.5rem;
}

.gold-accent {
  color: #FFD700;
  font-weight: 600;
}

/* Buttons */
.view-profile-btn {
  background-color: #FFD700;
  color: #2d333f;
  border: none;
  padding: 0.75rem;
  width: 100%;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: auto; /* Pushes button to bottom */
  transition: all 0.3s ease;
}

.view-profile-btn:hover {
  background-color: #ffdf33;
}

.see-more-container {
  text-align: center;
  margin-top: 2rem;
}

.see-more-btn {
  background-color: transparent;
  color: #2d333f;
  border: 2px solid #2d333f;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.see-more-btn:hover {
  background-color: #2d333f;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profiles-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 576px) {
  .section-title {
    font-size: 1.5rem;
  }

  .profile-card {
    width: 100%;
    max-width: 300px;
  }
}
</style>
