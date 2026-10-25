<script setup lang="ts">
import type { CustomTreeLinkProps } from "../TreePageVue.types";

type Props = CustomTreeLinkProps;

defineProps<Props>();
</script>

<template>
    <a :href="href" data-link-component=""><slot /></a>
</template>
