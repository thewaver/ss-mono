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
import type { Delivery } from "../SelectPage.types";

type Props = {
    "value": Delivery | undefined;
    "onUpdate:value"?: (value: Delivery | undefined) => void;
    "query": string;
    "onUpdate:query"?: (query: string) => void;
    "options": SelectOption<Delivery>[];
    "hasMore": boolean;
    "isSearching": boolean;
    "total": number;
    "onReachEnd": () => void;
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
        :has-more-options="hasMore"
        ariaLabel="Route"
        :padding="QUERY_PADDING"
        :compute-text-style="computePageSelectTextStyle"
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

                <div v-if="isSearching" :class="popupStyles.popoverSurfaceEmpty">Searching…</div>

                <div v-if="!isSearching && total < 1" :class="popupStyles.popoverSurfaceEmpty">
                    No route matches that
                </div>
            </PagePopoverSurface>
        </template>
    </Select>
</template>
