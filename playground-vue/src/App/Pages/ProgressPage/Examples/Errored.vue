<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";

const STALLED_RATIO = 0.62;
</script>

<template>
    <Progress :value="STALLED_RATIO" has-error ariaLabel="Failed upload" sizing="fit-content">
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>
</template>
