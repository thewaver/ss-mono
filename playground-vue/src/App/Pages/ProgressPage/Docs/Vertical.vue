<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";

const RATIO = 0.6;
</script>

<template>
    <Progress :value="RATIO" ariaLabel="Battery charge">
        <template #renderContent="state">
            <PageProgressContent :state="state" orientation="vertical" />
        </template>
    </Progress>
</template>
