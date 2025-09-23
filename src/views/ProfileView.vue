<template>
  <div class="profile-view">
    <!-- Profile Card -->
    <div class="card mb-4 shadow">
      <div class="card-body text-center">
        <img
          :src="owner.logo || '/default-logo.jpg'"
          class="rounded-circle mb-3"
          width="150"
          height="150"
        >
        <h2>{{ owner.username }}</h2>
        <p class="text-muted" v-if="owner.bio">{{ owner.bio }}</p>
        <router-link
          v-if="isOwner"
          to="/dashboard/profile"
          class="btn btn-sm btn-outline-primary"
        >
          <i class="fas fa-edit me-1"></i>Edit Profile
        </router-link>
      </div>
    </div>

    <!-- Menu Button (Only for owner) -->
    <div v-if="isOwner" class="mb-4">
      <router-link
        to="/dashboard/menu"
        class="btn btn-primary w-100"
      >
        <i class="fas fa-utensils me-2"></i>Manage Menu
      </router-link>
    </div>

    <!-- Menu Preview -->
    <div class="card mb-4 shadow">
      <div class="card-header bg-white">
        <h5 class="mb-0">Menu</h5>
      </div>
      <div class="card-body">
        <MenuList :ownerId="ownerId" :limit="3" />
        <router-link
          v-if="menuItems.length > 3"
          :to="`/owners/${ownerId}/menu`"
          class="btn btn-link"
        >
          View Full Menu
        </router-link>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="card shadow">
      <div class="card-header bg-white">
        <h5 class="mb-0">Customer Reviews</h5>
      </div>
      <div class="card-body">
        <ReviewForm v-if="!isOwner" :ownerId="ownerId" />
        <ReviewList :ownerId="ownerId" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api';
import MenuList from '@/components/Menu/MenuList.vue';
import ReviewForm from '@/components/Reviews/ReviewForm.vue';
import ReviewList from '@/components/Reviews/ReviewList.vue';

export default {
  components: { MenuList, ReviewForm, ReviewList },
  props: ['ownerId'],
  data() {
    return {
      owner: {},
      menuItems: []
    };
  },
  async created() {
    await this.fetchOwnerProfile();
  },
  methods: {
    async fetchOwnerProfile() {
      try {
        const res = await api.get(`/owners/${this.ownerId}`);
        this.owner = res.data;
      } catch (error) {
        this.$toast.error('Failed to load profile');
        console.log(error)
      }
    }
  }
};
</script>


<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
