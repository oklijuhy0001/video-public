<template>
  <a :href="`/n/${slug}`" class="name-link">Xem thêm về {{ name }}</a>
</template>

<script setup>
defineProps({ name: String, slug: String })
</script>

<style scoped>
.name-link {
  display: inline-block;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  margin-top: 4px;
  padding: 3px 8px;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 12px;
  transition: color .2s, border-color .2s;
}
.name-link:hover { color: #fff; border-color: rgba(255,255,255,0.7); }
</style>
