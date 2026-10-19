import type { JSX } from "solid-js";
import { createEffect, createMemo, createSignal, on } from "solid-js";

import { FrameRateMonitorSolidUtils } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, SelectOption } from "@thewaver/ss-components-solid";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    PAGED_TOTAL,
    PAGE_DELAY_MS,
    PAGE_SIZE,
    STRESS_COUNT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { AirportsExample } from "./Examples/Airports";
import { AutocompleteExample } from "./Examples/Autocomplete";
import { AutocompleteOnDemandExample } from "./Examples/AutocompleteOnDemand";
import { ClearableExample } from "./Examples/Clearable";
import { CountriesExample } from "./Examples/Countries";
import { DeliveriesExample } from "./Examples/Deliveries";
import { HoursExample } from "./Examples/Hours";
import { LabeledExample } from "./Examples/Labeled";
import { OnDemandExample } from "./Examples/OnDemand";
import { ReachableExample } from "./Examples/Reachable";
import { VirtualizedExample } from "./Examples/Virtualized";
import type { Airport, Delivery, SelectVirtualizedExampleProps } from "./SelectPage.types";
import {
    AIRPORTS,
    COUNTRIES_WITH_DISABLED,
    COUNTRIES_WITH_REACHABLE,
    GROUPED_COUNTRIES,
    STRESS_GROUP_SIZE,
    createStressDeliveries,
    createStressDeliveryGroups,
} from "./SelectPageSolid.const";

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

const VirtualizedExampleWrapper = (
    props: SelectVirtualizedExampleProps & { count: MaybeAccessor<number>; onCountChange: (count: number) => void },
) => {
    return (
        <>
            <VirtualizedExample
                value={props.value}
                visibility={props.visibility}
                options={props.options}
                hasGroups={props.hasGroups}
                measureOpen={props.measureOpen}
            />

            <PageExampleKnobs>
                <PageProp
                    key={"stressCount"}
                    label={"Option count"}
                    hint={
                        "How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."
                    }
                    controls={"Sets the number of example options sent to SelectProps.options"}
                >
                    <PageNumberField
                        value={props.count}
                        min={SelectKnobs.MIN_STRESS_COUNT}
                        max={SelectKnobs.MAX_STRESS_COUNT}
                        step={SelectKnobs.STRESS_COUNT_STEP}
                        width={STRESS_COUNT_FIELD_WIDTH}
                        ariaLabel={"Option count"}
                        onInput={props.onCountChange}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

export const SelectPage = () => {
    const [getStressCount, setStressCount] = createSignal(SelectKnobs.STARTING_STRESS_COUNT);
    const [getOpenMs, setOpenMs] = createSignal<number>();

    const filterQuerySignal = createSignal("");
    const filterSignal = createSignal<Airport | undefined>();
    const groupedSignal = createSignal<string | undefined>();
    const defaultSignal = createSignal<string | undefined>();
    const preselectedSignal = createSignal<string | undefined>("Portugal");
    const disabledOptionSignal = createSignal<string | undefined>();
    const reachableOptionSignal = createSignal<string | undefined>();
    const longSignal = createSignal<string | undefined>("13:00");
    const deliverySignal = createSignal<Delivery | undefined>();
    const recordSignal = createSignal<Airport | undefined>();
    const erroredSignal = createSignal<string | undefined>();
    const disabledSignal = createSignal<string | undefined>("Sweden");
    const reachableSignal = createSignal<string | undefined>("Sweden");
    const labeledSignal = createSignal<string | undefined>();
    const clearableSignal = createSignal<string | undefined>("Estonia");
    const [getClearableChange, setClearableChange] = createSignal("none yet");
    const stressSignal = createSignal<Delivery | undefined>();
    const stressVisibility = createSignal(false);
    const groupedStressSignal = createSignal<Delivery | undefined>();
    const groupedStressVisibility = createSignal(false);
    const pagedSignal = createSignal<Delivery | undefined>();

    const [getPagedRoutes, setPagedRoutes] = createSignal<SelectOption<Delivery>[]>([]);
    const [getIsFetching, setIsFetching] = createSignal(false);

    const searchQuerySignal = createSignal("");
    const searchSignal = createSignal<Delivery | undefined>();

    const [getSearchResults, setSearchResults] = createSignal<SelectOption<Delivery>[]>([]);
    const [getSearchTotal, setSearchTotal] = createSignal(0);
    const [getIsSearching, setIsSearching] = createSignal(false);

    let searchRequest = 0;

    const runSearch = async (offset: number) => {
        const request = ++searchRequest;

        setIsSearching(true);

        const page = await searchRoutes(searchQuerySignal[0](), offset);

        if (request !== searchRequest) return;

        setSearchResults((results) => (offset > 0 ? [...results, ...page.items] : page.items));
        setSearchTotal(page.total);
        setIsSearching(false);
    };

    createEffect(
        on(
            () => searchQuerySignal[0](),
            () => {
                setSearchResults([]);
                setSearchTotal(0);

                void runSearch(0);
            },
        ),
    );

    const getHasMoreResults = () => getSearchResults().length < getSearchTotal() || getIsSearching();

    const getHasMoreRoutes = () => getPagedRoutes().length < PAGED_TOTAL;

    const fetchNextRoutes = async () => {
        if (getIsFetching()) return;

        setIsFetching(true);

        const page = await fetchRoutes(getPagedRoutes().length);

        setPagedRoutes((routes) => [...routes, ...page]);
        setIsFetching(false);
    };

    const { getFrameRate } = FrameRateMonitorSolidUtils.create(() => !stressVisibility[0]());

    const getStressDeliveries = createMemo(() => createStressDeliveries(getStressCount()));

    const getStressDeliveryGroups = createMemo(() => createStressDeliveryGroups(getStressCount()));

    const measureOpen = (renderOptions: () => JSX.Element) => {
        const startedAt = performance.now();
        const options = renderOptions();

        requestAnimationFrame(() => requestAnimationFrame(() => setOpenMs(performance.now() - startedAt)));

        return options;
    };

    const getFilteredAirports = createMemo(() => {
        const query = filterQuerySignal[0]().toLocaleLowerCase();

        if (!query) return AIRPORTS;

        return AIRPORTS.filter(
            (option) =>
                option.value.city.toLocaleLowerCase().includes(query) ||
                option.value.code.toLocaleLowerCase().includes(query),
        );
    });

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${defaultSignal[0]() ?? "undefined"}`,
            component: () => <CountriesExample value={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "preselected",
            name: EXAMPLE_NAMES.preselected,
            readout: () => `value: ${preselectedSignal[0]() ?? "undefined"} — reopening highlights it`,
            component: () => <CountriesExample value={preselectedSignal} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "clearable",
            name: EXAMPLE_NAMES.clearable,
            readout: () =>
                `value: ${clearableSignal[0]() ?? "undefined"} | last change: ${getClearableChange()} — the clear control is its own tab stop after the field, drawn only while something is picked`,
            component: () => (
                <ClearableExample
                    value={clearableSignal}
                    onSelectionChange={(value) => {
                        setClearableChange(value ?? "undefined");
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Clearable.tsx`,
        },
        {
            key: "recordValues",
            name: EXAMPLE_NAMES.recordValues,
            readout: () => `value: ${recordSignal[0]()?.code ?? "undefined"}`,
            component: () => <AirportsExample value={recordSignal} />,
            path: `${EXAMPLES_ROOT}/Airports.tsx`,
        },
        {
            key: "titleDescription",
            name: EXAMPLE_NAMES.titleDescription,
            readout: () =>
                `value: ${deliverySignal[0]()?.name ?? "undefined"} — the descriptions wrap, so no two rows are the same height`,
            component: () => <DeliveriesExample value={deliverySignal} />,
            path: `${EXAMPLES_ROOT}/Deliveries.tsx`,
        },
        {
            key: "optionGroups",
            name: EXAMPLE_NAMES.optionGroups,
            readout: () =>
                `value: ${groupedSignal[0]() ?? "undefined"} — arrows cross group boundaries and skip Finland`,
            component: () => <CountriesExample value={groupedSignal} options={GROUPED_COUNTRIES} hasGroups={true} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "disabledOptions",
            name: EXAMPLE_NAMES.disabledOptions,
            readout: () => `value: ${disabledOptionSignal[0]() ?? "undefined"} — arrows skip Denmark and Finland`,
            component: () => <CountriesExample value={disabledOptionSignal} options={COUNTRIES_WITH_DISABLED} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "disabledOptionsReachable",
            name: EXAMPLE_NAMES.disabledOptionsReachable,
            readout: () =>
                `value: ${reachableOptionSignal[0]() ?? "undefined"} — arrows stop on them, hover explains why`,
            component: () => <CountriesExample value={reachableOptionSignal} options={COUNTRIES_WITH_REACHABLE} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "scrollingList",
            name: EXAMPLE_NAMES.scrollingList,
            readout: () => `value: ${longSignal[0]() ?? "undefined"} — Home and End reach both ends`,
            component: () => <HoursExample value={longSignal} />,
            path: `${EXAMPLES_ROOT}/Hours.tsx`,
        },
        {
            key: "virtualized",
            name: EXAMPLE_NAMES.virtualized,
            readout: () =>
                `${getStressCount().toLocaleString("en-GB")} options — ${
                    getOpenMs() === undefined
                        ? "never opened"
                        : `${Math.round(getOpenMs()!)} ms from click to the first painted frame`
                }, ${stressVisibility[0]() ? `${getFrameRate().current.toFixed(0)} fps while open` : "closed"}`,
            component: () => (
                <VirtualizedExampleWrapper
                    value={stressSignal}
                    visibility={stressVisibility}
                    options={getStressDeliveries}
                    count={getStressCount}
                    measureOpen={measureOpen}
                    onCountChange={(count) => {
                        setStressCount(count);
                        setOpenMs(undefined);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "virtualizedGroups",
            name: EXAMPLE_NAMES.virtualizedGroups,
            readout: () =>
                `${getStressCount().toLocaleString("en-GB")} options in ${Math.ceil(getStressCount() / STRESS_GROUP_SIZE).toLocaleString("en-GB")} groups — ${
                    groupedStressVisibility[0]() ? "open" : "closed"
                }`,
            component: () => (
                <VirtualizedExampleWrapper
                    value={groupedStressSignal}
                    visibility={groupedStressVisibility}
                    options={getStressDeliveryGroups}
                    count={getStressCount}
                    measureOpen={(renderOptions) => renderOptions()}
                    onCountChange={(count) => setStressCount(count)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "onDemand",
            name: EXAMPLE_NAMES.onDemand,
            readout: () =>
                `${getPagedRoutes().length} of ${PAGED_TOTAL} routes fetched${
                    getIsFetching() ? ", another batch in flight" : ""
                } — reaching the end asks for ${PAGE_SIZE} more, and the arrows stop at the last one held`,
            component: () => (
                <OnDemandExample
                    value={pagedSignal}
                    options={getPagedRoutes}
                    hasMore={getHasMoreRoutes}
                    isFetching={getIsFetching}
                    onReachEnd={() => void fetchNextRoutes()}
                />
            ),
            path: `${EXAMPLES_ROOT}/OnDemand.tsx`,
        },
        {
            key: "autocomplete",
            name: EXAMPLE_NAMES.autocomplete,
            readout: () =>
                `value: ${filterSignal[0]()?.code ?? "undefined"} | query: "${filterQuerySignal[0]()}" — ${getFilteredAirports().length} of ${AIRPORTS.length} shown; the page matches on city or code, which only it knows about`,
            component: () => (
                <AutocompleteExample value={filterSignal} query={filterQuerySignal} options={getFilteredAirports} />
            ),
            path: `${EXAMPLES_ROOT}/Autocomplete.tsx`,
        },
        {
            key: "autocompleteOnDemand",
            name: EXAMPLE_NAMES.autocompleteOnDemand,
            readout: () =>
                `value: ${searchSignal[0]()?.name ?? "undefined"} | query: "${searchQuerySignal[0]()}" — ${getSearchResults().length} of ${getSearchTotal()} matches held${
                    getIsSearching() ? ", asking the server" : ""
                }; typing starts a new search rather than filtering what arrived`,
            component: () => (
                <AutocompleteOnDemandExample
                    value={searchSignal}
                    query={searchQuerySignal}
                    options={getSearchResults}
                    hasMore={getHasMoreResults}
                    isSearching={getIsSearching}
                    total={getSearchTotal}
                    onReachEnd={() => {
                        if (getIsSearching()) return;

                        void runSearch(getSearchResults().length);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/AutocompleteOnDemand.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${erroredSignal[0]() ?? "undefined"} — required, nothing picked yet`,
            component: () => (
                <CountriesExample value={erroredSignal} hasError={() => erroredSignal[0]() === undefined} />
            ),
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabledSignal[0]() ?? "undefined"}`,
            component: () => <CountriesExample value={disabledSignal} isDisabled={true} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachableSignal[0]() ?? "undefined"}`,
            component: () => <ReachableExample value={reachableSignal} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "label",
            name: EXAMPLE_NAMES.label,
            readout: () => `value: ${labeledSignal[0]() ?? "undefined"} — the caption opens the list`,
            component: () => <LabeledExample value={labeledSignal} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
