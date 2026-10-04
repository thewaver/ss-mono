<script setup lang="ts" generic="T">
import { computed } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent from "../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { useFieldReset } from "./Field.context";
import type { PageSelectFieldProps } from "./Field.types";

const DEFAULT_SELECT_FIELD_WIDTH = 150;
const EMPTY_TEXT = "";

const props = defineProps<PageSelectFieldProps<T>>();

useFieldReset(props.value, (value) => props.onChange(value));

const options = computed(() => props.values.map((value) => ({ value })));

const setValue = (value: T | undefined) => {
    if (value === undefined) return;

    props.onChange(value);
};
</script>

<template>
    <Select
        :id="id"
        :value="value"
        :options="options"
        :is-disabled="isDisabled"
        :ariaLabel="ariaLabel"
        @update:value="setValue"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags" :width="width ?? DEFAULT_SELECT_FIELD_WIDTH">{{
                selectedOption !== undefined
                    ? (computeLabel?.(selectedOption.value) ?? String(selectedOption.value))
                    : EMPTY_TEXT
            }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags">{{
                computeLabel?.(option.value) ?? String(option.value)
            }}</PageSelectOptionContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
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
