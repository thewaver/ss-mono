<script setup lang="ts">
import PageRouterLink from "../RouterLink/RouterLink.vue";

defineOptions({ inheritAttrs: false });

defineProps<{ href: string }>();
</script>

<template>
    <PageRouterLink v-bind="$attrs" :href="href" :data-view-tab="href"><slot /></PageRouterLink>
</template>
