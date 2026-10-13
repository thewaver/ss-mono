import { useEffect, useMemo, useRef, useState } from "react";

import { FrameRateMonitorReactUtils } from "@thewaver/ss-components-react";
import type { SelectOption } from "@thewaver/ss-components-react";
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
} from "./SelectPageReact.const";

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
    props: SelectVirtualizedExampleProps & { count: number; onCountChange: (count: number) => void },
) => {
    return (
        <>
            <VirtualizedExample value={props.value} visibility={props.visibility} options={props.options} />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"stressCount"}
                    label={"Option count"}
                    hint={
                        "How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."
                    }
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
    const [stressCount, setStressCount] = useState(SelectKnobs.STARTING_STRESS_COUNT);
    const [openMs, setOpenMs] = useState<number>();

    const filterQueryState = useState("");
    const filterState = useState<Airport | undefined>();
    const groupedState = useState<string | undefined>();
    const defaultState = useState<string | undefined>();
    const preselectedState = useState<string | undefined>("Portugal");
    const disabledOptionState = useState<string | undefined>();
    const reachableOptionState = useState<string | undefined>();
    const longState = useState<string | undefined>("13:00");
    const deliveryState = useState<Delivery | undefined>();
    const recordState = useState<Airport | undefined>();
    const erroredState = useState<string | undefined>();
    const disabledState = useState<string | undefined>("Sweden");
    const reachableState = useState<string | undefined>("Sweden");
    const labeledState = useState<string | undefined>();
    const clearableState = useState<string | undefined>("Estonia");
    const [clearableChange, setClearableChange] = useState("none yet");
    const stressState = useState<Delivery | undefined>();
    const [isStressOpen, setIsStressOpen] = useState(false);
    const groupedStressState = useState<Delivery | undefined>();
    const groupedStressVisibility = useState(false);
    const pagedState = useState<Delivery | undefined>();

    const [pagedRoutes, setPagedRoutes] = useState<SelectOption<Delivery>[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    const searchQueryState = useState("");
    const searchState = useState<Delivery | undefined>();

    const [searchResults, setSearchResults] = useState<SelectOption<Delivery>[]>([]);
    const [searchTotal, setSearchTotal] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const searchRequestRef = useRef(0);
    const isFetchingRef = useRef(false);
    const stressOpenedAtRef = useRef(0);

    const searchQuery = searchQueryState[0];

    const runSearch = async (query: string, offset: number) => {
        const request = ++searchRequestRef.current;

        setIsSearching(true);

        const page = await searchRoutes(query, offset);

        if (request !== searchRequestRef.current) return;

        setSearchResults((results) => (offset > 0 ? [...results, ...page.items] : page.items));
        setSearchTotal(page.total);
        setIsSearching(false);
    };

    useEffect(() => {
        setSearchResults([]);
        setSearchTotal(0);

        void runSearch(searchQuery, 0);
    }, [searchQuery]);

    const hasMoreResults = searchResults.length < searchTotal || isSearching;

    const hasMoreRoutes = pagedRoutes.length < PAGED_TOTAL;

    const fetchNextRoutes = async () => {
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        setIsFetching(true);

        const page = await fetchRoutes(pagedRoutes.length);

        setPagedRoutes((routes) => [...routes, ...page]);
        isFetchingRef.current = false;
        setIsFetching(false);
    };

    const frameRate = FrameRateMonitorReactUtils.useFrameRate(!isStressOpen);

    const stressVisibility = [
        isStressOpen,
        (isOpen: boolean) => {
            if (isOpen && !isStressOpen) stressOpenedAtRef.current = performance.now();

            setIsStressOpen(isOpen);
        },
    ] as const;

    useEffect(() => {
        if (!isStressOpen) return;

        const startedAt = stressOpenedAtRef.current;

        let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => setOpenMs(performance.now() - startedAt));
        });

        return () => cancelAnimationFrame(frame);
    }, [isStressOpen]);

    const stressDeliveries = useMemo(() => createStressDeliveries(stressCount), [stressCount]);

    const stressDeliveryGroups = useMemo(() => createStressDeliveryGroups(stressCount), [stressCount]);

    const filterQuery = filterQueryState[0];

    const filteredAirports = useMemo(() => {
        const query = filterQuery.toLocaleLowerCase();

        if (!query) return AIRPORTS;

        return AIRPORTS.filter(
            (option) =>
                option.value.city.toLocaleLowerCase().includes(query) ||
                option.value.code.toLocaleLowerCase().includes(query),
        );
    }, [filterQuery]);

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${defaultState[0] ?? "undefined"}`,
            component: () => <CountriesExample value={defaultState} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "preselected",
            name: EXAMPLE_NAMES.preselected,
            readout: () => `value: ${preselectedState[0] ?? "undefined"} — reopening highlights it`,
            component: () => <CountriesExample value={preselectedState} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "clearable",
            name: EXAMPLE_NAMES.clearable,
            readout: () =>
                `value: ${clearableState[0] ?? "undefined"} | last change: ${clearableChange} — the clear control is its own tab stop after the field, drawn only while something is picked`,
            component: () => (
                <ClearableExample
                    value={clearableState}
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
            readout: () => `value: ${recordState[0]?.code ?? "undefined"}`,
            component: () => <AirportsExample value={recordState} />,
            path: `${EXAMPLES_ROOT}/Airports.tsx`,
        },
        {
            key: "titleDescription",
            name: EXAMPLE_NAMES.titleDescription,
            readout: () =>
                `value: ${deliveryState[0]?.name ?? "undefined"} — the descriptions wrap, so no two rows are the same height`,
            component: () => <DeliveriesExample value={deliveryState} />,
            path: `${EXAMPLES_ROOT}/Deliveries.tsx`,
        },
        {
            key: "optionGroups",
            name: EXAMPLE_NAMES.optionGroups,
            readout: () => `value: ${groupedState[0] ?? "undefined"} — arrows cross group boundaries and skip Finland`,
            component: () => <CountriesExample value={groupedState} options={GROUPED_COUNTRIES} hasGroups={true} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "disabledOptions",
            name: EXAMPLE_NAMES.disabledOptions,
            readout: () => `value: ${disabledOptionState[0] ?? "undefined"} — arrows skip Denmark and Finland`,
            component: () => <CountriesExample value={disabledOptionState} options={COUNTRIES_WITH_DISABLED} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "disabledOptionsReachable",
            name: EXAMPLE_NAMES.disabledOptionsReachable,
            readout: () => `value: ${reachableOptionState[0] ?? "undefined"} — arrows stop on them, hover explains why`,
            component: () => <CountriesExample value={reachableOptionState} options={COUNTRIES_WITH_REACHABLE} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "scrollingList",
            name: EXAMPLE_NAMES.scrollingList,
            readout: () => `value: ${longState[0] ?? "undefined"} — Home and End reach both ends`,
            component: () => <HoursExample value={longState} />,
            path: `${EXAMPLES_ROOT}/Hours.tsx`,
        },
        {
            key: "virtualized",
            name: EXAMPLE_NAMES.virtualized,
            readout: () =>
                `${stressCount.toLocaleString("en-GB")} options — ${
                    openMs === undefined
                        ? "never opened"
                        : `${Math.round(openMs)} ms from click to the first painted frame`
                }, ${isStressOpen ? `${frameRate.current.toFixed(0)} fps while open` : "closed"}`,
            component: () => (
                <VirtualizedExampleWrapper
                    value={stressState}
                    visibility={stressVisibility}
                    options={stressDeliveries}
                    count={stressCount}
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
                `${stressCount.toLocaleString("en-GB")} options in ${Math.ceil(stressCount / STRESS_GROUP_SIZE).toLocaleString("en-GB")} groups — ${
                    groupedStressVisibility[0] ? "open" : "closed"
                }`,
            component: () => (
                <VirtualizedExampleWrapper
                    value={groupedStressState}
                    visibility={groupedStressVisibility}
                    options={stressDeliveryGroups}
                    count={stressCount}
                    onCountChange={(count) => setStressCount(count)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "onDemand",
            name: EXAMPLE_NAMES.onDemand,
            readout: () =>
                `${pagedRoutes.length} of ${PAGED_TOTAL} routes fetched${
                    isFetching ? ", another batch in flight" : ""
                } — reaching the end asks for ${PAGE_SIZE} more, and the arrows stop at the last one held`,
            component: () => (
                <OnDemandExample
                    value={pagedState}
                    options={pagedRoutes}
                    hasMore={hasMoreRoutes}
                    isFetching={isFetching}
                    onReachEnd={() => void fetchNextRoutes()}
                />
            ),
            path: `${EXAMPLES_ROOT}/OnDemand.tsx`,
        },
        {
            key: "autocomplete",
            name: EXAMPLE_NAMES.autocomplete,
            readout: () =>
                `value: ${filterState[0]?.code ?? "undefined"} | query: "${filterQuery}" — ${filteredAirports.length} of ${AIRPORTS.length} shown; the page matches on city or code, which only it knows about`,
            component: () => (
                <AutocompleteExample value={filterState} query={filterQueryState} options={filteredAirports} />
            ),
            path: `${EXAMPLES_ROOT}/Autocomplete.tsx`,
        },
        {
            key: "autocompleteOnDemand",
            name: EXAMPLE_NAMES.autocompleteOnDemand,
            readout: () =>
                `value: ${searchState[0]?.name ?? "undefined"} | query: "${searchQuery}" — ${searchResults.length} of ${searchTotal} matches held${
                    isSearching ? ", asking the server" : ""
                }; typing starts a new search rather than filtering what arrived`,
            component: () => (
                <AutocompleteOnDemandExample
                    value={searchState}
                    query={searchQueryState}
                    options={searchResults}
                    hasMore={hasMoreResults}
                    isSearching={isSearching}
                    total={searchTotal}
                    onReachEnd={() => {
                        if (isSearching) return;

                        void runSearch(searchQuery, searchResults.length);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/AutocompleteOnDemand.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${erroredState[0] ?? "undefined"} — required, nothing picked yet`,
            component: () => <CountriesExample value={erroredState} hasError={erroredState[0] === undefined} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabledState[0] ?? "undefined"}`,
            component: () => <CountriesExample value={disabledState} isDisabled={true} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachableState[0] ?? "undefined"}`,
            component: () => <ReachableExample value={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "label",
            name: EXAMPLE_NAMES.label,
            readout: () => `value: ${labeledState[0] ?? "undefined"} — the caption opens the list`,
            component: () => <LabeledExample value={labeledState} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
