<script setup>
import { ref, onMounted } from "vue";
const items = ref([]);
onMounted(async () => {
  const res = await fetch("/api/items");
  items.value = await res.json();
});
</script>
<template>
  <ul><li v-for="i in items" :key="i.id">{{ i.title }}</li></ul>
</template>
