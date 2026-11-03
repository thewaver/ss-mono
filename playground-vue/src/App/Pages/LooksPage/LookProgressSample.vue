<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";
import { LOOK_SAMPLE_PROGRESS } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";

import PageProgressContent from "../../StyledComponents/ProgressContent/ProgressContent.vue";
import LookBarCell from "./LookBarCell.vue";
import type { LookStateProps } from "./LooksPage.types";

withDefaults(defineProps<LookStateProps>(), { hasError: undefined });
</script>

<template>
    <LookBarCell :state="state">
        <Progress :value="LOOK_SAMPLE_PROGRESS" :has-error="hasError" :ariaLabel="state">
            <template #renderContent="progressState">
                <PageProgressContent :state="progressState" />
            </template>
        </Progress>
    </LookBarCell>
</template>
