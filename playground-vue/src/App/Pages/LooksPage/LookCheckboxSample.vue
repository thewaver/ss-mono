<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import type { LookStateProps } from "./LooksPage.types";

const props = withDefaults(defineProps<LookStateProps>(), {
    isChecked: undefined,
    isMixed: undefined,
    isDisabled: undefined,
    hasError: undefined,
});

const checked = shallowRef(props.isChecked ?? false);
</script>

<template>
    <Checkbox
        v-model:checked="checked"
        :is-mixed="isMixed"
        :is-disabled="isDisabled"
        :has-error="hasError"
        :ariaLabel="state"
    >
        <template #renderContent="flags">
            <PageCheckboxContent :flags="flags">{{ state }}</PageCheckboxContent>
        </template>
    </Checkbox>
</template>
