<script setup lang="ts">
import type { ToastsFarDownNestingProps } from "../ToastsPageVue.types";
import FarDownProfileForm from "./FarDownProfileForm.vue";

defineProps<ToastsFarDownNestingProps>();
</script>

<template>
    <FarDownProfileForm @answer="onAnswer" />
</template>
