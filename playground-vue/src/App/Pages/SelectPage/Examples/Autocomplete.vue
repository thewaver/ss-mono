<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { SelectOption } from "@thewaver/ss-components-vue";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent, {
    computePageSelectTextStyle,
} from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER, QUERY_PADDING } from "../SelectPage.const";
import type { Airport } from "../SelectPage.types";

type Props = {
    "value": Airport | undefined;
    "onUpdate:value"?: (value: Airport | undefined) => void;
    "query": string;
    "onUpdate:query"?: (query: string) => void;
    "options": SelectOption<Airport>[];
};

const props = defineProps<Props>();

const value = useModel(props, "value");
const query = useModel(props, "query");
</script>

<template>
    <Select
        v-model:value="value"
        v-model:query="query"
        :options="options"
        ariaLabel="Airport"
        :padding="QUERY_PADDING"
        :compute-text-style="computePageSelectTextStyle"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value.city ?? PLACEHOLDER }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent :flags="flags">{{
                `${option.value.city} (${option.value.code})`
            }}</PageSelectOptionContent>
        </template>

        <template #renderPopup="{ renderOptions, visibilityTarget, transitionDurationMs, placement }">
            <PagePopoverSurface
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                :placement="placement"
            >
                <component v-if="options.length" :is="renderOptions" />

                <div v-else :class="popupStyles.popoverSurfaceEmpty">No airport matches that</div>
            </PagePopoverSurface>
        </template>
    </Select>
</template>
