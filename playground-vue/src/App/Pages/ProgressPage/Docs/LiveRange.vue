<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from "vue";

import { Progress } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    BYTES_PER_KB,
    UPLOAD_TICK_BYTES,
    UPLOAD_TICK_MS,
    UPLOAD_TOTAL_BYTES,
} from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";

const uploadedBytes = shallowRef(0);

const valueText = computed(
    () => `${Math.round(uploadedBytes.value / BYTES_PER_KB)} of ${Math.round(UPLOAD_TOTAL_BYTES / BYTES_PER_KB)} kB`,
);

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
    timer = setInterval(() => {
        uploadedBytes.value = uploadedBytes.value >= UPLOAD_TOTAL_BYTES ? 0 : uploadedBytes.value + UPLOAD_TICK_BYTES;
    }, UPLOAD_TICK_MS);
});

onBeforeUnmount(() => {
    clearInterval(timer);
});
</script>

<template>
    <Progress :value="uploadedBytes" :max="UPLOAD_TOTAL_BYTES" ariaLabel="Upload" :ariaValueText="valueText">
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Read out as: ${valueText}` }}</div>
</template>
