<script setup lang="ts">
import { computed } from "vue";

import { Button } from "@thewaver/ss-components-vue";

import PageEraCycleContent from "../../StyledComponents/EraCycleContent/EraCycleContent.vue";
import type { EraCycleProps } from "./EraCycle.types";

const SINGLE_ERA = 1;

const props = defineProps<EraCycleProps>();

const current = computed(() => props.options.find((option) => option.id === props.era));

const label = computed(() => current.value?.name ?? props.era);

const advance = () => {
    const index = props.options.findIndex((option) => option.id === props.era);

    props.onChange(props.options[(index + 1) % props.options.length].id);
};
</script>

<template>
    <Button v-if="options.length > SINGLE_ERA" :is-disabled="isDisabled" :ariaLabel="`Era: ${label}`" @click="advance">
        <template #renderContent="flags">
            <PageEraCycleContent :flags="flags">{{ current?.shortName ?? era }}</PageEraCycleContent>
        </template>
    </Button>
</template>
