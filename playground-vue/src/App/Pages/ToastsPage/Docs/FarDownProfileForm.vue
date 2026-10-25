<script setup lang="ts">
import type { ToastsFarDownNestingProps } from "../ToastsPageVue.types";
import FarDownSaveButton from "./FarDownSaveButton.vue";

defineProps<ToastsFarDownNestingProps>();
</script>

<template>
    <FarDownSaveButton id="farDownInside" caption="Save inside" @answer="onAnswer" />
</template>
