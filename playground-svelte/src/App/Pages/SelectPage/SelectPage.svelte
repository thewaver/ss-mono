<script lang="ts">
    import { untrack } from "svelte";

    import { FrameRateMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import type { SelectOption } from "@thewaver/ss-components-svelte";
    import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import AirportsExample from "./Examples/Airports.svelte";
    import AutocompleteExample from "./Examples/Autocomplete.svelte";
    import AutocompleteOnDemandExample from "./Examples/AutocompleteOnDemand.svelte";
    import ClearableExample from "./Examples/Clearable.svelte";
    import CountriesExample from "./Examples/Countries.svelte";
    import DeliveriesExample from "./Examples/Deliveries.svelte";
    import HoursExample from "./Examples/Hours.svelte";
    import LabeledExample from "./Examples/Labeled.svelte";
    import OnDemandExample from "./Examples/OnDemand.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import VirtualizedExample from "./Examples/Virtualized.svelte";
    import {
        AIRPORTS,
        COUNTRIES_WITH_DISABLED,
        COUNTRIES_WITH_REACHABLE,
        GROUPED_COUNTRIES,
        STRESS_GROUP_SIZE,
        createStressDeliveries,
        createStressDeliveryGroups,
    } from "./SelectPage.const.svelte";
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

    let stressCount = $state(SelectKnobs.STARTING_STRESS_COUNT);
    let openMs = $state<number>();

    let filterQuery = $state("");
    let filterValue = $state.raw<Airport | undefined>();
    let groupedValue = $state<string | undefined>();
    let defaultValue = $state<string | undefined>();
    let preselectedValue = $state<string | undefined>("Portugal");
    let disabledOptionValue = $state<string | undefined>();
    let reachableOptionValue = $state<string | undefined>();
    let longValue = $state<string | undefined>("13:00");
    let deliveryValue = $state.raw<Delivery | undefined>();
    let recordValue = $state.raw<Airport | undefined>();
    let erroredValue = $state<string | undefined>();
    let disabledValue = $state<string | undefined>("Sweden");
    let reachableValue = $state<string | undefined>("Sweden");
    let labeledValue = $state<string | undefined>();
    let clearableValue = $state<string | undefined>("Estonia");
    let clearableChange = $state("none yet");
    let stressValue = $state.raw<Delivery | undefined>();
    let isStressOpen = $state(false);
    let groupedStressValue = $state.raw<Delivery | undefined>();
    let isGroupedStressOpen = $state(false);
    let pagedValue = $state.raw<Delivery | undefined>();

    let pagedRoutes = $state.raw<SelectOption<Delivery>[]>([]);
    let isFetching = $state(false);

    let searchQuery = $state("");
    let searchValue = $state.raw<Delivery | undefined>();

    let searchResults = $state.raw<SelectOption<Delivery>[]>([]);
    let searchTotal = $state(0);
    let isSearching = $state(false);

    let searchRequest = 0;
    let isFetchingNow = false;
    let stressOpenedAt = 0;

    const runSearch = async (query: string, offset: number) => {
        const request = ++searchRequest;

        isSearching = true;

        const page = await searchRoutes(query, offset);

        if (request !== searchRequest) return;

        searchResults = offset > 0 ? [...searchResults, ...page.items] : page.items;
        searchTotal = page.total;
        isSearching = false;
    };

    $effect(() => {
        const query = searchQuery;

        untrack(() => {
            searchResults = [];
            searchTotal = 0;

            void runSearch(query, 0);
        });
    });

    const hasMoreResults = $derived(searchResults.length < searchTotal || isSearching);

    const hasMoreRoutes = $derived(pagedRoutes.length < PAGED_TOTAL);

    const fetchNextRoutes = async () => {
        if (isFetchingNow) return;

        isFetchingNow = true;
        isFetching = true;

        const page = await fetchRoutes(pagedRoutes.length);

        pagedRoutes = [...pagedRoutes, ...page];
        isFetchingNow = false;
        isFetching = false;
    };

    const { getFrameRate } = FrameRateMonitorSvelteUtils.create(() => !isStressOpen);

    const setIsStressOpen = (isOpen: boolean) => {
        if (isOpen && !isStressOpen) stressOpenedAt = performance.now();

        isStressOpen = isOpen;
    };

    $effect(() => {
        if (!isStressOpen) return;

        const startedAt = stressOpenedAt;

        let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
                openMs = performance.now() - startedAt;
            });
        });

        return () => cancelAnimationFrame(frame);
    });

    const stressDeliveries = $derived(createStressDeliveries(stressCount));

    const stressDeliveryGroups = $derived(createStressDeliveryGroups(stressCount));

    const filteredAirports = $derived.by(() => {
        const query = filterQuery.toLocaleLowerCase();

        if (!query) return AIRPORTS;

        return AIRPORTS.filter(
            (option) =>
                option.value.city.toLocaleLowerCase().includes(query) ||
                option.value.code.toLocaleLowerCase().includes(query),
        );
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${defaultValue ?? "undefined"}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "preselected",
            name: "Preselected",
            readout: () => `value: ${preselectedValue ?? "undefined"} — reopening highlights it`,
            component: preselectedExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "clearable",
            name: "Clearable",
            readout: () =>
                `value: ${clearableValue ?? "undefined"} | last change: ${clearableChange} — the clear control is its own tab stop after the field, drawn only while something is picked`,
            component: clearableExample,
            path: `${EXAMPLES_ROOT}/Clearable.svelte`,
        },
        {
            key: "recordValues",
            name: "Record values",
            readout: () => `value: ${recordValue?.code ?? "undefined"}`,
            component: recordValuesExample,
            path: `${EXAMPLES_ROOT}/Airports.svelte`,
        },
        {
            key: "titleDescription",
            name: "Title and description",
            readout: () =>
                `value: ${deliveryValue?.name ?? "undefined"} — the descriptions wrap, so no two rows are the same height`,
            component: titleDescriptionExample,
            path: `${EXAMPLES_ROOT}/Deliveries.svelte`,
        },
        {
            key: "optionGroups",
            name: "Option groups",
            readout: () => `value: ${groupedValue ?? "undefined"} — arrows cross group boundaries and skip Finland`,
            component: optionGroupsExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "disabledOptions",
            name: "Disabled options",
            readout: () => `value: ${disabledOptionValue ?? "undefined"} — arrows skip Denmark and Finland`,
            component: disabledOptionsExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "disabledOptionsReachable",
            name: "Disabled options + reachable",
            readout: () => `value: ${reachableOptionValue ?? "undefined"} — arrows stop on them, hover explains why`,
            component: disabledOptionsReachableExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "scrollingList",
            name: "Scrolling list",
            readout: () => `value: ${longValue ?? "undefined"} — Home and End reach both ends`,
            component: scrollingListExample,
            path: `${EXAMPLES_ROOT}/Hours.svelte`,
        },
        {
            key: "virtualized",
            name: "Virtualized",
            readout: () =>
                `${stressCount.toLocaleString("en-GB")} options — ${
                    openMs === undefined
                        ? "never opened"
                        : `${Math.round(openMs)} ms from click to the first painted frame`
                }, ${isStressOpen ? `${getFrameRate().current.toFixed(0)} fps while open` : "closed"}`,
            component: virtualizedExample,
            path: `${EXAMPLES_ROOT}/Virtualized.svelte`,
        },
        {
            key: "virtualizedGroups",
            name: "Virtualized, in groups",
            readout: () =>
                `${stressCount.toLocaleString("en-GB")} options in ${Math.ceil(stressCount / STRESS_GROUP_SIZE).toLocaleString("en-GB")} groups — ${
                    isGroupedStressOpen ? "open" : "closed"
                }`,
            component: virtualizedGroupsExample,
            path: `${EXAMPLES_ROOT}/Virtualized.svelte`,
        },
        {
            key: "onDemand",
            name: "Loaded on demand",
            readout: () =>
                `${pagedRoutes.length} of ${PAGED_TOTAL} routes fetched${
                    isFetching ? ", another batch in flight" : ""
                } — reaching the end asks for ${PAGE_SIZE} more, and the arrows stop at the last one held`,
            component: onDemandExample,
            path: `${EXAMPLES_ROOT}/OnDemand.svelte`,
        },
        {
            key: "autocomplete",
            name: "Autocomplete",
            readout: () =>
                `value: ${filterValue?.code ?? "undefined"} | query: "${filterQuery}" — ${filteredAirports.length} of ${AIRPORTS.length} shown; the page matches on city or code, which only it knows about`,
            component: autocompleteExample,
            path: `${EXAMPLES_ROOT}/Autocomplete.svelte`,
        },
        {
            key: "autocompleteOnDemand",
            name: "Autocomplete, loaded on demand",
            readout: () =>
                `value: ${searchValue?.name ?? "undefined"} | query: "${searchQuery}" — ${searchResults.length} of ${searchTotal} matches held${
                    isSearching ? ", asking the server" : ""
                }; typing starts a new search rather than filtering what arrived`,
            component: autocompleteOnDemandExample,
            path: `${EXAMPLES_ROOT}/AutocompleteOnDemand.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredValue ?? "undefined"} — required, nothing picked yet`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledValue ?? "undefined"}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableValue ?? "undefined"}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `value: ${labeledValue ?? "undefined"} — the caption opens the list`,
            component: labelExample,
            path: `${EXAMPLES_ROOT}/Labeled.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <CountriesExample bind:value={defaultValue} />
{/snippet}

{#snippet preselectedExample()}
    <CountriesExample bind:value={preselectedValue} />
{/snippet}

{#snippet clearableExample()}
    <ClearableExample
        bind:value={clearableValue}
        onSelectionChange={(value) => {
            clearableChange = value ?? "undefined";
        }}
    />
{/snippet}

{#snippet recordValuesExample()}
    <AirportsExample bind:value={recordValue} />
{/snippet}

{#snippet titleDescriptionExample()}
    <DeliveriesExample bind:value={deliveryValue} />
{/snippet}

{#snippet optionGroupsExample()}
    <CountriesExample bind:value={groupedValue} options={GROUPED_COUNTRIES} hasGroups={true} />
{/snippet}

{#snippet disabledOptionsExample()}
    <CountriesExample bind:value={disabledOptionValue} options={COUNTRIES_WITH_DISABLED} />
{/snippet}

{#snippet disabledOptionsReachableExample()}
    <CountriesExample bind:value={reachableOptionValue} options={COUNTRIES_WITH_REACHABLE} />
{/snippet}

{#snippet scrollingListExample()}
    <HoursExample bind:value={longValue} />
{/snippet}

{#snippet virtualizedExample()}
    <VirtualizedExample
        bind:value={stressValue}
        bind:visibility={() => isStressOpen, setIsStressOpen}
        options={stressDeliveries}
        count={stressCount}
        onCountChange={(count) => {
            stressCount = count;
            openMs = undefined;
        }}
    />
{/snippet}

{#snippet virtualizedGroupsExample()}
    <VirtualizedExample
        bind:value={groupedStressValue}
        bind:visibility={isGroupedStressOpen}
        options={stressDeliveryGroups}
        count={stressCount}
        onCountChange={(count) => {
            stressCount = count;
        }}
    />
{/snippet}

{#snippet onDemandExample()}
    <OnDemandExample
        bind:value={pagedValue}
        options={pagedRoutes}
        hasMore={hasMoreRoutes}
        {isFetching}
        onReachEnd={() => void fetchNextRoutes()}
    />
{/snippet}

{#snippet autocompleteExample()}
    <AutocompleteExample bind:value={filterValue} bind:query={filterQuery} options={filteredAirports} />
{/snippet}

{#snippet autocompleteOnDemandExample()}
    <AutocompleteOnDemandExample
        bind:value={searchValue}
        bind:query={searchQuery}
        options={searchResults}
        hasMore={hasMoreResults}
        {isSearching}
        total={searchTotal}
        onReachEnd={() => {
            if (isSearching) return;

            void runSearch(searchQuery, searchResults.length);
        }}
    />
{/snippet}

{#snippet erroredExample()}
    <CountriesExample bind:value={erroredValue} hasError={erroredValue === undefined} />
{/snippet}

{#snippet disabledExample()}
    <CountriesExample bind:value={disabledValue} isDisabled={true} />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample bind:value={reachableValue} />
{/snippet}

{#snippet labelExample()}
    <LabeledExample bind:value={labeledValue} />
{/snippet}

<PageExamples items={examples} />
