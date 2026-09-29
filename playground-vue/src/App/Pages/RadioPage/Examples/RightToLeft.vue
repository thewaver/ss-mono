<script setup lang="ts">
import { useModel } from "vue";

import type { RadioOptionalExampleProps } from "../RadioPage.types";
import DefaultExample from "./Default.vue";

type Props = RadioOptionalExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <div dir="rtl">
        <DefaultExample v-model:value="value" />
    </div>
</template>
