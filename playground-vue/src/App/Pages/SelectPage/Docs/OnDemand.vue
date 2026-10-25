<script setup lang="ts">
import { shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { SelectOption } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PAGED_TOTAL } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER, fetchRoutes } from "../SelectPageVue.const";

const value = shallowRef<Delivery | undefined>();
const routes = shallowRef<SelectOption<Delivery>[]>([]);
const isFetching = shallowRef(false);

const fetchNext = async () => {
    if (isFetching.value) return;

    isFetching.value = true;

    const page = await fetchRoutes(routes.value.length);

    routes.value = [...routes.value, ...page];
    isFetching.value = false;
};
</script>

<template>
    <Select
        v-model:value="value"
        :options="routes"
        :has-more-options="routes.length < PAGED_TOTAL"
        ariaLabel="Route"
        @reach-end="() => void fetchNext()"
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

                <div v-if="isFetching" :class="popupStyles.popoverSurfaceEmpty">Fetching more routes…</div>
            </PagePopoverSurface>
        </template>
    </Select>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `${routes.length} of ${PAGED_TOTAL} routes fetched${isFetching ? ", more on the way" : ""}` }}
    </div>
</template>
