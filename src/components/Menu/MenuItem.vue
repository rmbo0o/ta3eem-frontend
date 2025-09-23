<template>
  <div class="col-md-4 mb-4">
    <div class="card h-100">
      <img v-if="item.image" :src="item.image" class="card-img-top" :alt="item.name">
      <div class="card-body">
        <h5 class="card-title">{{ item.name }}</h5>
        <p class="card-text">{{ item.description }}</p>
        <p class="text-muted">${{ item.price.toFixed(2) }}</p>
      </div>
      <div class="card-footer bg-white">
        <button @click="$emit('add-to-cart', item)" class="btn btn-primary mr-2">
          Add to Cart
        </button>
        <template v-if="$store.getters.isOwner">
          <button @click="$emit('edit', item.id)" class="btn btn-sm btn-outline-secondary mr-2">
            Edit
          </button>
          <button @click="$emit('delete', item.id)" class="btn btn-sm btn-outline-danger">
            Delete
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}
</style>
