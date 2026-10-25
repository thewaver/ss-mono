<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";
import type { ProgressBasicDocsExampleProps } from "../ProgressPageVue.types";

type Props = ProgressBasicDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <Progress :value="value" :has-error="hasError" ariaLabel="Setup progress">
        <template #renderContent="state">
            <PageProgressContent :state="state" />
        </template>
    </Progress>
</template>
