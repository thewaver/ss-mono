<script setup lang="ts">
import { useModel } from "vue";

import type { TimeValue } from "@thewaver/ss-utils";

import DefaultExample from "./Default.vue";

type Props = {
    "value": TimeValue | undefined;
    "onUpdate:value"?: (value: TimeValue | undefined) => void;
};

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <div dir="rtl">
        <DefaultExample v-model:value="value" ariaLabel="Time in a right-to-left box" />
    </div>
</template>
