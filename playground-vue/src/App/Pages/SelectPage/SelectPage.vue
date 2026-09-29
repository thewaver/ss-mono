<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { FrameRateMonitorVueUtils } from "@thewaver/ss-components-vue";
import type { SelectOption } from "@thewaver/ss-components-vue";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import AirportsExample from "./Examples/Airports.vue";
import AutocompleteExample from "./Examples/Autocomplete.vue";
import AutocompleteOnDemandExample from "./Examples/AutocompleteOnDemand.vue";
import ClearableExample from "./Examples/Clearable.vue";
import CountriesExample from "./Examples/Countries.vue";
import DeliveriesExample from "./Examples/Deliveries.vue";
import HoursExample from "./Examples/Hours.vue";
import LabeledExample from "./Examples/Labeled.vue";
import OnDemandExample from "./Examples/OnDemand.vue";
import ReachableExample from "./Examples/Reachable.vue";
import VirtualizedExample from "./Examples/Virtualized.vue";
import {
    AIRPORTS,
    COUNTRIES_WITH_DISABLED,
    COUNTRIES_WITH_REACHABLE,
    GROUPED_COUNTRIES,
    STRESS_GROUP_SIZE,
    createStressDeliveries,
    createStressDeliveryGroups,
} from "./SelectPage.const";
import type { Airport, Delivery } from "./SelectPage.types";

const PAGE_SIZE = 40;
const PAGED_TOTAL = 500;
const PAGE_DELAY_MS = 600;
const EXAMPLES_ROOT = "/src/App/Pages/SelectPage/Examples";

const fetchRoutes = (offset: number) =>
    new Promise<SelectOption<Delivery>[]>((resolve) => {
        setTimeout(
            () => resolve(createStressDeliveries(Math.min(PAGE_SIZE, PAGED_TOTAL - offset), offset)),
            PAGE_DELAY_MS,
        );
    });

const SERVER_ROUTES = createStressDeliveries(PAGED_TOTAL);

const searchRoutes = (query: string, offset: number) =>
    new Promise<{ items: SelectOption<Delivery>[]; total: number }>((resolve) => {
        setTimeout(() => {
            const needle = query.toLocaleLowerCase();
            const matched = needle
                ? SERVER_ROUTES.filter((option) => option.value.name.toLocaleLowerCase().includes(needle))
                : SERVER_ROUTES;

            resolve({ items: matched.slice(offset, offset + PAGE_SIZE), total: matched.length });
        }, PAGE_DELAY_MS);
    });

const stressCount = shallowRef(SelectKnobs.STARTING_STRESS_COUNT);
const openMs = shallowRef<number>();

const filterQuery = shallowRef("");
const filterValue = shallowRef<Airport | undefined>();
const groupedValue = shallowRef<string | undefined>();
const defaultValue = shallowRef<string | undefined>();
const preselectedValue = shallowRef<string | undefined>("Portugal");
const disabledOptionValue = shallowRef<string | undefined>();
const reachableOptionValue = shallowRef<string | undefined>();
const longValue = shallowRef<string | undefined>("13:00");
const deliveryValue = shallowRef<Delivery | undefined>();
const recordValue = shallowRef<Airport | undefined>();
const erroredValue = shallowRef<string | undefined>();
const disabledValue = shallowRef<string | undefined>("Sweden");
const reachableValue = shallowRef<string | undefined>("Sweden");
const labeledValue = shallowRef<string | undefined>();
const clearableValue = shallowRef<string | undefined>("Estonia");
const clearableChange = shallowRef("none yet");
const stressValue = shallowRef<Delivery | undefined>();
const isStressOpen = shallowRef(false);
const groupedStressValue = shallowRef<Delivery | undefined>();
const isGroupedStressOpen = shallowRef(false);
const pagedValue = shallowRef<Delivery | undefined>();

const pagedRoutes = shallowRef<SelectOption<Delivery>[]>([]);
const isFetching = shallowRef(false);

const searchQuery = shallowRef("");
const searchValue = shallowRef<Delivery | undefined>();

const searchResults = shallowRef<SelectOption<Delivery>[]>([]);
const searchTotal = shallowRef(0);
const isSearching = shallowRef(false);

let searchRequest = 0;
let isFetchingNow = false;
let stressOpenedAt = 0;

const runSearch = async (query: string, offset: number) => {
    const request = ++searchRequest;

    isSearching.value = true;

    const page = await searchRoutes(query, offset);

    if (request !== searchRequest) return;

    searchResults.value = offset > 0 ? [...searchResults.value, ...page.items] : page.items;
    searchTotal.value = page.total;
    isSearching.value = false;
};

watch(
    searchQuery,
    (query) => {
        searchResults.value = [];
        searchTotal.value = 0;

        void runSearch(query, 0);
    },
    { immediate: true },
);

const hasMoreResults = computed(() => searchResults.value.length < searchTotal.value || isSearching.value);

const hasMoreRoutes = computed(() => pagedRoutes.value.length < PAGED_TOTAL);

const fetchNextRoutes = async () => {
    if (isFetchingNow) return;

    isFetchingNow = true;
    isFetching.value = true;

    const page = await fetchRoutes(pagedRoutes.value.length);

    pagedRoutes.value = [...pagedRoutes.value, ...page];
    isFetchingNow = false;
    isFetching.value = false;
};

const frameRate = FrameRateMonitorVueUtils.useFrameRate(() => !isStressOpen.value);

const setIsStressOpen = (isOpen: boolean) => {
    if (isOpen && !isStressOpen.value) stressOpenedAt = performance.now();

    isStressOpen.value = isOpen;
};

watch(isStressOpen, (isOpen, _wasOpen, onCleanup) => {
    if (!isOpen) return;

    const startedAt = stressOpenedAt;

    let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (openMs.value = performance.now() - startedAt));
    });

    onCleanup(() => cancelAnimationFrame(frame));
});

const stressDeliveries = computed(() => createStressDeliveries(stressCount.value));

const stressDeliveryGroups = computed(() => createStressDeliveryGroups(stressCount.value));

const filteredAirports = computed(() => {
    const query = filterQuery.value.toLocaleLowerCase();

    if (!query) return AIRPORTS;

    return AIRPORTS.filter(
        (option) =>
            option.value.city.toLocaleLowerCase().includes(query) ||
            option.value.code.toLocaleLowerCase().includes(query),
    );
});

const setStressCount = (count: number) => {
    stressCount.value = count;
    openMs.value = undefined;
};

const searchMore = () => {
    if (isSearching.value) return;

    void runSearch(searchQuery.value, searchResults.value.length);
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${defaultValue.value ?? "undefined"}`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "preselected",
        name: "Preselected",
        readout: () => `value: ${preselectedValue.value ?? "undefined"} — reopening highlights it`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "clearable",
        name: "Clearable",
        readout: () =>
            `value: ${clearableValue.value ?? "undefined"} | last change: ${clearableChange.value} — the clear control is its own tab stop after the field, drawn only while something is picked`,
        path: `${EXAMPLES_ROOT}/Clearable.vue`,
    },
    {
        key: "recordValues",
        name: "Record values",
        readout: () => `value: ${recordValue.value?.code ?? "undefined"}`,
        path: `${EXAMPLES_ROOT}/Airports.vue`,
    },
    {
        key: "titleDescription",
        name: "Title and description",
        readout: () =>
            `value: ${deliveryValue.value?.name ?? "undefined"} — the descriptions wrap, so no two rows are the same height`,
        path: `${EXAMPLES_ROOT}/Deliveries.vue`,
    },
    {
        key: "optionGroups",
        name: "Option groups",
        readout: () => `value: ${groupedValue.value ?? "undefined"} — arrows cross group boundaries and skip Finland`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "disabledOptions",
        name: "Disabled options",
        readout: () => `value: ${disabledOptionValue.value ?? "undefined"} — arrows skip Denmark and Finland`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "disabledOptionsReachable",
        name: "Disabled options + reachable",
        readout: () => `value: ${reachableOptionValue.value ?? "undefined"} — arrows stop on them, hover explains why`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "scrollingList",
        name: "Scrolling list",
        readout: () => `value: ${longValue.value ?? "undefined"} — Home and End reach both ends`,
        path: `${EXAMPLES_ROOT}/Hours.vue`,
    },
    {
        key: "virtualized",
        name: "Virtualized",
        readout: () =>
            `${stressCount.value.toLocaleString("en-GB")} options — ${
                openMs.value === undefined
                    ? "never opened"
                    : `${Math.round(openMs.value)} ms from click to the first painted frame`
            }, ${isStressOpen.value ? `${frameRate.value.current.toFixed(0)} fps while open` : "closed"}`,
        path: `${EXAMPLES_ROOT}/Virtualized.vue`,
    },
    {
        key: "virtualizedGroups",
        name: "Virtualized, in groups",
        readout: () =>
            `${stressCount.value.toLocaleString("en-GB")} options in ${Math.ceil(stressCount.value / STRESS_GROUP_SIZE).toLocaleString("en-GB")} groups — ${
                isGroupedStressOpen.value ? "open" : "closed"
            }`,
        path: `${EXAMPLES_ROOT}/Virtualized.vue`,
    },
    {
        key: "onDemand",
        name: "Loaded on demand",
        readout: () =>
            `${pagedRoutes.value.length} of ${PAGED_TOTAL} routes fetched${
                isFetching.value ? ", another batch in flight" : ""
            } — reaching the end asks for ${PAGE_SIZE} more, and the arrows stop at the last one held`,
        path: `${EXAMPLES_ROOT}/OnDemand.vue`,
    },
    {
        key: "autocomplete",
        name: "Autocomplete",
        readout: () =>
            `value: ${filterValue.value?.code ?? "undefined"} | query: "${filterQuery.value}" — ${filteredAirports.value.length} of ${AIRPORTS.length} shown; the page matches on city or code, which only it knows about`,
        path: `${EXAMPLES_ROOT}/Autocomplete.vue`,
    },
    {
        key: "autocompleteOnDemand",
        name: "Autocomplete, loaded on demand",
        readout: () =>
            `value: ${searchValue.value?.name ?? "undefined"} | query: "${searchQuery.value}" — ${searchResults.value.length} of ${searchTotal.value} matches held${
                isSearching.value ? ", asking the server" : ""
            }; typing starts a new search rather than filtering what arrived`,
        path: `${EXAMPLES_ROOT}/AutocompleteOnDemand.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `value: ${erroredValue.value ?? "undefined"} — required, nothing picked yet`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `value: ${disabledValue.value ?? "undefined"}`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `value: ${reachableValue.value ?? "undefined"}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "label",
        name: "In a Label",
        readout: () => `value: ${labeledValue.value ?? "undefined"} — the caption opens the list`,
        path: `${EXAMPLES_ROOT}/Labeled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <CountriesExample v-model:value="defaultValue" />
        </template>

        <template #preselected>
            <CountriesExample v-model:value="preselectedValue" />
        </template>

        <template #clearable>
            <ClearableExample
                v-model:value="clearableValue"
                @selection-change="(value: string | undefined) => (clearableChange = value ?? 'undefined')"
            />
        </template>

        <template #recordValues>
            <AirportsExample v-model:value="recordValue" />
        </template>

        <template #titleDescription>
            <DeliveriesExample v-model:value="deliveryValue" />
        </template>

        <template #optionGroups>
            <CountriesExample v-model:value="groupedValue" :options="GROUPED_COUNTRIES" has-groups />
        </template>

        <template #disabledOptions>
            <CountriesExample v-model:value="disabledOptionValue" :options="COUNTRIES_WITH_DISABLED" />
        </template>

        <template #disabledOptionsReachable>
            <CountriesExample v-model:value="reachableOptionValue" :options="COUNTRIES_WITH_REACHABLE" />
        </template>

        <template #scrollingList>
            <HoursExample v-model:value="longValue" />
        </template>

        <template #virtualized>
            <VirtualizedExample
                v-model:value="stressValue"
                :visibility="isStressOpen"
                :options="stressDeliveries"
                :count="stressCount"
                @update:visibility="setIsStressOpen"
                @count-change="setStressCount"
            />
        </template>

        <template #virtualizedGroups>
            <VirtualizedExample
                v-model:value="groupedStressValue"
                v-model:visibility="isGroupedStressOpen"
                :options="stressDeliveryGroups"
                :count="stressCount"
                @count-change="(count: number) => (stressCount = count)"
            />
        </template>

        <template #onDemand>
            <OnDemandExample
                v-model:value="pagedValue"
                :options="pagedRoutes"
                :has-more="hasMoreRoutes"
                :is-fetching="isFetching"
                @reach-end="() => void fetchNextRoutes()"
            />
        </template>

        <template #autocomplete>
            <AutocompleteExample v-model:value="filterValue" v-model:query="filterQuery" :options="filteredAirports" />
        </template>

        <template #autocompleteOnDemand>
            <AutocompleteOnDemandExample
                v-model:value="searchValue"
                v-model:query="searchQuery"
                :options="searchResults"
                :has-more="hasMoreResults"
                :is-searching="isSearching"
                :total="searchTotal"
                @reach-end="searchMore"
            />
        </template>

        <template #errored>
            <CountriesExample v-model:value="erroredValue" :has-error="erroredValue === undefined" />
        </template>

        <template #disabled>
            <CountriesExample v-model:value="disabledValue" is-disabled />
        </template>

        <template #reachable>
            <ReachableExample v-model:value="reachableValue" />
        </template>

        <template #label>
            <LabeledExample v-model:value="labeledValue" />
        </template>
    </PageExamples>
</template>
