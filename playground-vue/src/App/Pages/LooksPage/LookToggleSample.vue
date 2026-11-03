<script setup lang="ts">
import { shallowRef } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.vue";
import type { LookStateProps } from "./LooksPage.types";

const props = withDefaults(defineProps<LookStateProps>(), {
    isChecked: undefined,
    isDisabled: undefined,
    hasError: undefined,
});

const checked = shallowRef(props.isChecked ?? false);
</script>

<template>
    <Toggle v-model:checked="checked" :is-disabled="isDisabled" :has-error="hasError" :ariaLabel="state">
        <template #renderContent="flags">
            <PageToggleContent :flags="flags">{{ state }}</PageToggleContent>
        </template>
    </Toggle>
</template>
