<script setup lang="ts">
import type { CustomTabLinkProps } from "../TabsPageVue.types";

type Props = CustomTabLinkProps;

defineProps<Props>();
</script>

<template>
    <a :href="href" data-link-component=""><slot /></a>
</template>
