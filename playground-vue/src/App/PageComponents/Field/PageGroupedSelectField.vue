<script setup lang="ts" generic="T">
import { computed } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent from "../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectGroupContent from "../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { useFieldReset } from "./Field.context";
import type { PageGroupedSelectFieldProps } from "./Field.types";

const DEFAULT_SELECT_FIELD_WIDTH = 150;
const EMPTY_TEXT = "";

const props = defineProps<PageGroupedSelectFieldProps<T>>();

useFieldReset(props.value, (value) => props.onChange(value));

const options = computed(() =>
    props.groups.map(([label, values]) => ({ label, options: values.map((value) => ({ value })) })),
);

const setValue = (value: T | undefined) => {
    if (value === undefined) return;

    props.onChange(value);
};
</script>

<template>
    <Select :value="value" :options="options" :is-disabled="isDisabled" :ariaLabel="ariaLabel" @update:value="setValue">
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags" :width="width ?? DEFAULT_SELECT_FIELD_WIDTH">{{
                selectedOption !== undefined
                    ? (computeLabel?.(selectedOption.value) ?? String(selectedOption.value))
                    : EMPTY_TEXT
            }}</PageSelectContent>
        </template>

        <template #renderGroup="{ group }">
            <PageSelectGroupContent>{{ group.label }}</PageSelectGroupContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent :flags="flags">{{
                computeLabel?.(option.value) ?? String(option.value)
            }}</PageSelectOptionContent>
        </template>

        <template #renderPopup="{ renderOptions, visibilityTarget, transitionDurationMs, placement }">
            <PagePopoverSurface
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                :placement="placement"
            >
                <component :is="renderOptions" />
            </PagePopoverSurface>
        </template>
    </Select>
</template>
