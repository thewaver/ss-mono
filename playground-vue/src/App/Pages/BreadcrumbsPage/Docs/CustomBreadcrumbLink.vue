<script setup lang="ts">
import type { CustomBreadcrumbLinkProps } from "../BreadcrumbsPageVue.types";

type Props = CustomBreadcrumbLinkProps;

defineProps<Props>();
</script>

<template>
    <a :href="href" data-link-component=""><slot /></a>
</template>
