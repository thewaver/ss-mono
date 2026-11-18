<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";
import { RETICULATING_SPLINES_LABEL } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";
</script>

<template>
    <Progress :ariaLabel="RETICULATING_SPLINES_LABEL">
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>
</template>
