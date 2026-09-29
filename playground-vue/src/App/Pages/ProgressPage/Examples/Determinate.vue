<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";

const RATIO = 0.4;
</script>

<template>
    <Progress :value="RATIO" ariaLabel="Setup progress" sizing="fit-content">
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>
</template>
