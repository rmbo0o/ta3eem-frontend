<template>
  <div class="card mb-4">
    <div class="card-body">
      <h5 class="card-title">Owner Profile</h5>
      <p><strong>Username:</strong> {{ profile.username }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
    </div>
  </div>
</template>

<script>
import axios from '../../utils/axios'

export default {
  data() {
    return {
      profile: {}
    }
  },
  async mounted() {
    try {
      const res = await axios.get('/owner/profile')
      this.profile = res.data.owner
    } catch (error) {
      this.$toast.error('Failed to load profile')
      console.log(error)
    }
  }
}
</script>
