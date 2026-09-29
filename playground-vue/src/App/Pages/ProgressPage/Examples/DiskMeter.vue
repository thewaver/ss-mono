<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";

const USED_GB = 412;
const TOTAL_GB = 512;
</script>

<template>
    <Progress
        role="meter"
        :value="USED_GB"
        :max="TOTAL_GB"
        ariaLabel="Disk usage"
        :ariaValueText="`${USED_GB} of ${TOTAL_GB} GB used`"
        sizing="fit-content"
    >
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>
</template>
