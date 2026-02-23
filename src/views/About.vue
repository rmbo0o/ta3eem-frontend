<template>
  <div class="container mt-5 text-center">
    <h2 class="mb-4">عن طعم</h2>
    <p class="mb-3">
      طعم هو منصة تربط أصحاب المطاعم المنزلية بالعملاء. يساعد أصحاب المطاعم الصغيرة على عرض قوائمهم،
      ومشاركة روابط وسائل التواصل الاجتماعي، وتلقي التقييمات من المستخدمين الحقيقيين.
    </p>
    <p class="mb-4">
      كن جزءًا من عائلتنا وافتح متجرك الخاص اليوم!
    </p>
    <router-link to="/register" class="btn btn-primary btn-lg">
      سجل الآن
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.container {
  direction: rtl;
  text-align: center;
  padding: 2rem;
}

h2 {
  font-family: 'Cairo', sans-serif;
  color: #333;
  font-weight: 700;
}

p {
  font-family: 'Cairo', sans-serif;
  color: #666;
  line-height: 1.8;
}

.btn-primary {
  background-color: #333;
  border-color: #333;
  font-family: 'Cairo', sans-serif;
  padding: 0.75rem 2rem;
}

.btn-primary:hover {
  background-color: #555;
  border-color: #555;
}
</style>
