<script setup lang="ts">
import type { CustomPaginatorLinkProps } from "../PaginatorPageVue.types";

type Props = CustomPaginatorLinkProps;

defineProps<Props>();
</script>

<template>
    <a :href="href" data-link-component=""><slot /></a>
</template>
