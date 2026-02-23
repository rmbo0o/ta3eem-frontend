<template>
  <div class="col-md-4 mb-4">
    <div class="card h-100">
      <img v-if="item.image" :src="item.image" class="card-img-top" :alt="item.name">
      <div class="card-body">
        <h5 class="card-title">{{ item.name }}</h5>
        <p class="card-text">{{ item.description }}</p>
        <p class="text-muted">{{ item.price.toFixed(2) }} ر.س</p>
      </div>
      <div class="card-footer bg-white">
        <button @click="$emit('add-to-cart', item)" class="btn btn-primary ml-2">
          أضف إلى السلة
        </button>
        <template v-if="$store.getters.isOwner">
          <button @click="$emit('edit', item.id)" class="btn btn-sm btn-outline-secondary ml-2">
            تعديل
          </button>
          <button @click="$emit('delete', item.id)" class="btn btn-sm btn-outline-danger">
            حذف
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
  direction: rtl;
  text-align: right;
}

.card:hover {
  transform: translateY(-5px);
}

.card-title {
  font-family: 'Cairo', sans-serif;
  font-weight: 600;
}

.card-text {
  font-family: 'Cairo', sans-serif;
}

.btn-primary {
  background-color: #333;
  border-color: #333;
  font-family: 'Cairo', sans-serif;
}

.btn-primary:hover {
  background-color: #555;
  border-color: #555;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>
