<script setup lang="ts">
import { useModel } from "vue";

import type { TagInputExampleProps } from "../TagInputPage.types";
import DefaultExample from "./Default.vue";

type Props = TagInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <div dir="rtl">
        <DefaultExample
            v-model:value="value"
            :is-disabled="isDisabled"
            :has-error="hasError"
            ariaLabel="Topics in a right-to-left box"
        />
    </div>
</template>
