<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { Airport } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent, {
    computePageSelectTextStyle,
} from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { AIRPORTS, PLACEHOLDER, QUERY_PADDING } from "../SelectPageVue.const";

const value = shallowRef<Airport | undefined>();
const query = shallowRef("");

const options = computed(() => {
    const needle = query.value.toLocaleLowerCase();

    if (!needle) return AIRPORTS;

    return AIRPORTS.filter(
        (option) =>
            option.value.city.toLocaleLowerCase().includes(needle) ||
            option.value.code.toLocaleLowerCase().includes(needle),
    );
});
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
            <PageSelectOptionContent is-gliding :flags="flags"
                >{{ option.value.city }} ({{ option.value.code }})</PageSelectOptionContent
            >
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
                <component :is="renderOptions" v-if="options.length" />

                <div v-else :class="popupStyles.popoverSurfaceEmpty">No airport matches that</div>
            </PagePopoverSurface>
        </template>
    </Select>
</template>
