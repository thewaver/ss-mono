<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER } from "../SelectPage.const";
import type { SelectRoutesExampleProps } from "../SelectPage.types";

type Props = SelectRoutesExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Select
        v-model:value="value"
        :options="options"
        :has-more-options="hasMore"
        ariaLabel="Route"
        @reach-end="props.onReachEnd"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value.name ?? PLACEHOLDER }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent :flags="flags" :description="option.value.description">{{
                option.value.name
            }}</PageSelectOptionContent>
        </template>

        <template #renderPopup="{ renderOptions, visibilityTarget, transitionDurationMs, placement }">
            <PagePopoverSurface
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                :placement="placement"
            >
                <component :is="renderOptions" />

                <div v-if="isFetching" :class="popupStyles.popoverSurfaceEmpty">Fetching more routes…</div>
            </PagePopoverSurface>
        </template>
    </Select>
</template>
