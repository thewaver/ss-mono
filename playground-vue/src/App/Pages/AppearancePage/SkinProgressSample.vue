<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";
import { SKIN_SAMPLE_PROGRESS } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";

import PageProgressContent from "../../StyledComponents/ProgressContent/ProgressContent.vue";
import type { SkinStateProps } from "./AppearancePage.types";
import SkinBarCell from "./SkinBarCell.vue";

withDefaults(defineProps<SkinStateProps>(), { hasError: undefined });
</script>

<template>
    <SkinBarCell :state="state">
        <Progress :value="SKIN_SAMPLE_PROGRESS" :has-error="hasError" :ariaLabel="state">
            <template #renderContent="progressState">
                <PageProgressContent :state="progressState" />
            </template>
        </Progress>
    </SkinBarCell>
</template>
