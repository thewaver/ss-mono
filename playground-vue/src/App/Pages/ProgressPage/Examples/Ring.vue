<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressRing from "../../../StyledComponents/ProgressRing/ProgressRing.vue";
import type { ProgressExampleProps } from "../ProgressPage.types";

const BYTES_PER_KB = 1000;

type Props = ProgressExampleProps;

defineProps<Props>();
</script>

<template>
    <Progress
        :value="uploadedBytes"
        :max="uploadTotalBytes"
        ariaLabel="Upload, drawn as a ring"
        :ariaValueText="`${Math.round(uploadedBytes / BYTES_PER_KB)} of ${Math.round(uploadTotalBytes / BYTES_PER_KB)} kB`"
        sizing="fit-content"
    >
        <template #renderContent="state">
            <PageProgressRing :state="state" />
        </template>
    </Progress>
</template>
