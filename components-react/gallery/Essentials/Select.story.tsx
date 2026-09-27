import { useEffect, useMemo, useRef, useState } from "react";

import { Label, Select } from "../../src";
import type { SelectItem, SelectOption } from "../../src";
import {
    AIRPORTS,
    type Airport,
    COUNTRIES,
    COUNTRIES_WITH_DISABLED,
    COUNTRIES_WITH_REACHABLE,
    type Delivery,
    GROUPED_COUNTRIES,
    GroupContent,
    HOURS,
    OptionContent,
    PLACEHOLDER,
    PopupSurface,
    createDeliveries,
    createDeliveryGroups,
} from "./ListboxFixtures";

const LISTS: Record<string, SelectItem<string>[]> = {
    plain: COUNTRIES,
    disabled: COUNTRIES_WITH_DISABLED,
    reachable: COUNTRIES_WITH_REACHABLE,
    grouped: GROUPED_COUNTRIES,
    hours: HOURS,
};

const STRESS_COUNT = 10_000;
const STRESS_OPTION_HEIGHT = 100;
const STRESS_GROUP_HEIGHT = 32;
const PAGE_SIZE = 40;
const PAGED_TOTAL = 500;
const PAGE_DELAY_MS = 300;
const QUERY_PADDING = 6;
const CLEAR_ROOM = 40;

type DefaultProps = {
    list?: keyof typeof LISTS;
    initial?: string;
    isDisabled?: boolean;
    isReachable?: boolean;
    isClearable?: boolean;
};

export const Default = ({
    list = "plain",
    initial,
    isDisabled = false,
    isReachable = false,
    isClearable,
}: DefaultProps) => {
    const valueState = useState<string | undefined>(initial);
    const [changes, setChanges] = useState<string[]>([]);

    return (
        <>
            <div style={{ width: 240 }}>
                <Select
                    valueState={valueState}
                    options={LISTS[list]}
                    ariaLabel={"Country"}
                    isDisabled={isDisabled}
                    isReachableWhenDisabled={isReachable}
                    padding={
                        isClearable ? { paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: CLEAR_ROOM } : 0
                    }
                    clearAriaLabel={"Clear country"}
                    renderClear={isClearable ? () => <span aria-hidden="true">×</span> : undefined}
                    renderContent={(selected) => <span>{selected?.value ?? PLACEHOLDER}</span>}
                    renderGroup={(group, flags) => <GroupContent flags={flags}>{group.label}</GroupContent>}
                    renderOption={(option, flags) => <OptionContent flags={flags}>{option.value}</OptionContent>}
                    renderPopup={(renderOptions, visibilityTarget, durationMs) => (
                        <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {renderOptions()}
                        </PopupSurface>
                    )}
                    onSelectionChange={(value) => setChanges((previous) => [...previous, value ?? "undefined"])}
                />
            </div>
            <button type="button" data-testid="after">
                After
            </button>
            <output data-readout="value">{`value: ${valueState[0] ?? "undefined"}`}</output>
            <output data-readout="changes">{changes.join(",")}</output>
        </>
    );
};

export const Labeled = ({ listAriaLabel }: { listAriaLabel?: string }) => {
    const valueState = useState<string | undefined>();

    return (
        <Label>
            <span>Country</span>
            <Select
                valueState={valueState}
                options={COUNTRIES}
                listAriaLabel={listAriaLabel}
                renderContent={(selected) => <span>{selected?.value ?? PLACEHOLDER}</span>}
                renderOption={(option, flags) => <OptionContent flags={flags}>{option.value}</OptionContent>}
                renderPopup={(renderOptions, visibilityTarget, durationMs) => (
                    <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                        {renderOptions()}
                    </PopupSurface>
                )}
            />
        </Label>
    );
};

export const Virtualized = ({ isGrouped = false }: { isGrouped?: boolean }) => {
    const valueState = useState<Delivery | undefined>();
    const visibilityState = useState(false);
    const options = useMemo(
        () => (isGrouped ? createDeliveryGroups(STRESS_COUNT) : createDeliveries(STRESS_COUNT)),
        [isGrouped],
    );

    return (
        <>
            <div style={{ width: 320 }}>
                <Select
                    valueState={valueState}
                    visibilityState={visibilityState}
                    options={options}
                    ariaLabel={"Route"}
                    computeEstimatedOptionHeight={() => STRESS_OPTION_HEIGHT}
                    computeEstimatedGroupHeight={() => STRESS_GROUP_HEIGHT}
                    computeCustomText={(option) => option.value.name}
                    renderContent={(selected) => <span>{selected?.value.name ?? PLACEHOLDER}</span>}
                    renderGroup={(group, flags) => <GroupContent flags={flags}>{group.label}</GroupContent>}
                    renderOption={(option, flags) => (
                        <OptionContent flags={flags} description={option.value.description}>
                            {option.value.name}
                        </OptionContent>
                    )}
                    renderPopup={(renderOptions, visibilityTarget, durationMs) => (
                        <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {renderOptions()}
                        </PopupSurface>
                    )}
                />
            </div>
            <output data-readout="count">{`${STRESS_COUNT.toLocaleString("en-GB")} options`}</output>
            <output data-readout="visibility">{visibilityState[0] ? "open" : "closed"}</output>
            <output data-readout="value">{`value: ${valueState[0]?.name ?? "undefined"}`}</output>
        </>
    );
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const OnDemand = () => {
    const valueState = useState<Delivery | undefined>();
    const [routes, setRoutes] = useState<SelectOption<Delivery>[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const isFetchingRef = useRef(false);

    const fetchNext = async () => {
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        setIsFetching(true);

        await wait(PAGE_DELAY_MS);

        setRoutes((previous) => [
            ...previous,
            ...createDeliveries(Math.min(PAGE_SIZE, PAGED_TOTAL - previous.length), previous.length),
        ]);
        isFetchingRef.current = false;
        setIsFetching(false);
    };

    return (
        <>
            <div style={{ width: 320 }}>
                <Select
                    valueState={valueState}
                    options={routes}
                    ariaLabel={"Route"}
                    hasMoreOptions={routes.length < PAGED_TOTAL}
                    computeCustomText={(option) => option.value.name}
                    renderContent={(selected) => <span>{selected?.value.name ?? PLACEHOLDER}</span>}
                    renderOption={(option, flags) => <OptionContent flags={flags}>{option.value.name}</OptionContent>}
                    renderPopup={(renderOptions, visibilityTarget, durationMs) => (
                        <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {renderOptions()}
                        </PopupSurface>
                    )}
                    onReachEnd={() => void fetchNext()}
                />
            </div>
            <output data-readout="fetched">{`${routes.length} of ${PAGED_TOTAL} routes fetched${isFetching ? ", another batch in flight" : ""}`}</output>
        </>
    );
};

export const Autocomplete = () => {
    const valueState = useState<Airport | undefined>();
    const queryState = useState("");

    const options = useMemo(() => {
        const query = queryState[0].toLocaleLowerCase();

        if (!query) return AIRPORTS;

        return AIRPORTS.filter(
            (option) =>
                option.value.city.toLocaleLowerCase().includes(query) ||
                option.value.code.toLocaleLowerCase().includes(query),
        );
    }, [queryState[0]]);

    return (
        <>
            <div style={{ width: 240, position: "relative" }}>
                <Select
                    valueState={valueState}
                    queryState={queryState}
                    options={options}
                    ariaLabel={"Airport"}
                    padding={QUERY_PADDING}
                    renderContent={(selected, flags) => (
                        <span style={{ display: "block", padding: QUERY_PADDING, opacity: flags.isFiltering ? 0 : 1 }}>
                            {selected?.value.city ?? PLACEHOLDER}
                        </span>
                    )}
                    renderOption={(option, flags) => (
                        <OptionContent flags={flags}>
                            {option.value.city} ({option.value.code})
                        </OptionContent>
                    )}
                    renderPopup={(renderOptions, visibilityTarget, durationMs) => (
                        <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {options.length ? renderOptions() : <div>No airport matches that</div>}
                        </PopupSurface>
                    )}
                />
            </div>
            <output data-readout="value">{`value: ${valueState[0]?.code ?? "undefined"} | query: "${queryState[0]}"`}</output>
        </>
    );
};

const SERVER_ROUTES = createDeliveries(PAGED_TOTAL);

const searchRoutes = async (query: string, offset: number) => {
    await wait(PAGE_DELAY_MS);

    const needle = query.toLocaleLowerCase();
    const matched = needle
        ? SERVER_ROUTES.filter((option) => option.value.name.toLocaleLowerCase().includes(needle))
        : SERVER_ROUTES;

    return { items: matched.slice(offset, offset + PAGE_SIZE), total: matched.length };
};

export const AutocompleteOnDemand = () => {
    const valueState = useState<Delivery | undefined>();
    const queryState = useState("");
    const [results, setResults] = useState<SelectOption<Delivery>[]>([]);
    const [total, setTotal] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const requestRef = useRef(0);
    const resultsRef = useRef(results);

    resultsRef.current = results;

    const runSearch = async (query: string, offset: number) => {
        const request = ++requestRef.current;

        setIsSearching(true);

        const page = await searchRoutes(query, offset);

        if (request !== requestRef.current) return;

        setResults((previous) => (offset > 0 ? [...previous, ...page.items] : page.items));
        setTotal(page.total);
        setIsSearching(false);
    };

    const query = queryState[0];

    useEffect(() => {
        setResults([]);
        setTotal(0);

        void runSearch(query, 0);
    }, [query]);

    return (
        <>
            <div style={{ width: 320, position: "relative" }}>
                <Select
                    valueState={valueState}
                    queryState={queryState}
                    options={results}
                    ariaLabel={"Route"}
                    padding={QUERY_PADDING}
                    hasMoreOptions={results.length < total || isSearching}
                    computeCustomText={(option) => option.value.name}
                    renderContent={(selected, flags) => (
                        <span style={{ display: "block", padding: QUERY_PADDING, opacity: flags.isFiltering ? 0 : 1 }}>
                            {selected?.value.name ?? PLACEHOLDER}
                        </span>
                    )}
                    renderOption={(option, flags) => <OptionContent flags={flags}>{option.value.name}</OptionContent>}
                    renderPopup={(renderOptions, visibilityTarget, durationMs) => (
                        <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {renderOptions()}
                        </PopupSurface>
                    )}
                    onReachEnd={() => {
                        if (isSearching) return;

                        void runSearch(query, resultsRef.current.length);
                    }}
                />
            </div>
            <output data-readout="searched">{`${results.length} of ${total} matches held${isSearching ? ", asking the server" : ""}`}</output>
        </>
    );
};
