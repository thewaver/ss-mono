<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";

import PageMeridiemToggleContent from "../../StyledComponents/MeridiemToggleContent/MeridiemToggleContent.vue";
import type { MeridiemToggleProps } from "./MeridiemToggle.types";

const props = defineProps<MeridiemToggleProps>();
</script>

<template>
    <Button
        :is-disabled="isDisabled"
        :ariaLabel="`Before or after noon: ${meridiem === 'am' ? 'AM' : 'PM'}`"
        @click="props.onToggle"
    >
        <template #renderContent="flags">
            <PageMeridiemToggleContent :flags="flags" :meridiem="meridiem" />
        </template>
    </Button>
</template>
