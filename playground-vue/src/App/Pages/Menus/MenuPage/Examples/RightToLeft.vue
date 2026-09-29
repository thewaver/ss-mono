<script setup lang="ts">
import type { MenuExampleProps } from "../MenuPage.types";
import SubmenusExample from "./Submenus.vue";

type Props = MenuExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div dir="rtl">
        <SubmenusExample @activate="props.onActivate" />
    </div>
</template>
