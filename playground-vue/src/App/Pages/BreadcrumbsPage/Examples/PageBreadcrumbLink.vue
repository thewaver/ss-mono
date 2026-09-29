<script setup lang="ts">
type Props = {
    href: string;
};

defineProps<Props>();
</script>

<template>
    <a :href="href" data-link-component=""><slot /></a>
</template>
