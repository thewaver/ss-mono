<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";

const OVERSHOOTING_VALUE = 5;
</script>

<template>
    <Progress :value="OVERSHOOTING_VALUE" ariaLabel="Clamped progress" sizing="fit-content">
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>
</template>
