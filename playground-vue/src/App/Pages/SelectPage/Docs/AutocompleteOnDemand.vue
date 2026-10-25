<script setup lang="ts">
import { shallowRef, watch } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { SelectOption } from "@thewaver/ss-components-vue";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent, {
    computePageSelectTextStyle,
} from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER, QUERY_PADDING, searchRoutes } from "../SelectPageVue.const";

const value = shallowRef<Delivery | undefined>();
const query = shallowRef("");
const results = shallowRef<SelectOption<Delivery>[]>([]);
const total = shallowRef(0);
const isSearching = shallowRef(false);

let latestRequest = 0;

const search = async (offset: number) => {
    const request = ++latestRequest;

    isSearching.value = true;

    const page = await searchRoutes(query.value, offset);

    if (request !== latestRequest) return;

    results.value = offset > 0 ? [...results.value, ...page.items] : page.items;
    total.value = page.total;
    isSearching.value = false;
};

watch(
    query,
    () => {
        results.value = [];
        total.value = 0;

        void search(0);
    },
    { immediate: true },
);

const searchMore = () => {
    if (isSearching.value) return;

    void search(results.value.length);
};
</script>

<template>
    <Select
        v-model:value="value"
        v-model:query="query"
        :options="results"
        :has-more-options="results.length < total || isSearching"
        ariaLabel="Route"
        :padding="QUERY_PADDING"
        :compute-text-style="computePageSelectTextStyle"
        @reach-end="searchMore"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value.name ?? PLACEHOLDER }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags" :description="option.value.description">{{
                option.value.name
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

                <div v-if="isSearching" :class="popupStyles.popoverSurfaceEmpty">Searching…</div>

                <div v-if="!isSearching && total < 1" :class="popupStyles.popoverSurfaceEmpty">
                    No route matches that
                </div>
            </PagePopoverSurface>
        </template>
    </Select>
</template>
