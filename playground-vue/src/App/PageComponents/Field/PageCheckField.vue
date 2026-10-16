<script setup lang="ts">
import { Toggle } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.vue";
import { useFieldReset } from "./FieldVue.context";
import type { PageCheckFieldProps } from "./FieldVue.types";

const props = defineProps<PageCheckFieldProps>();

useFieldReset(
    props.value,
    (value) => props.onChange(value),
    () => props.resetValue,
);
</script>

<template>
    <Toggle :checked="value" :is-disabled="isDisabled" :ariaLabel="ariaLabel" @update:checked="props.onChange">
        <template #renderContent="flags">
            <PageToggleContent :flags="flags" />
        </template>
    </Toggle>
</template>
