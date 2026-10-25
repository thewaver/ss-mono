<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";
</script>

<template>
    <Progress ariaLabel="Reticulating splines">
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>
</template>
