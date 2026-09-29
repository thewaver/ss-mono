<script setup lang="ts">
defineProps<{ href: string }>();
</script>

<template>
    <a :href="href" data-link-component=""><slot /></a>
</template>
