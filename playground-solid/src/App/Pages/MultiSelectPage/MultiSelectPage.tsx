import { createMemo, createSignal } from "solid-js";

import { SelectUtils } from "@thewaver/ss-components-solid";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { GROUPED_COUNTRIES } from "../SelectPage/SelectPageSolid.const";
import { MultiSelectClearableExample } from "./Examples/MultiSelectClearable";
import { MultiSelectCountriesExample } from "./Examples/MultiSelectCountries";
import { MultiSelectGroupedExample } from "./Examples/MultiSelectGrouped";

export const MultiSelectPage = () => {
    const countriesSignal = createSignal<string[]>(["Denmark"]);
    const groupedSignal = createSignal<string[]>([]);
    const querySignal = createSignal("");
    const clearableSignal = createSignal<string[]>(["Belgium", "Sweden"]);
    const [getClearableChange, setClearableChange] = createSignal("none yet");

    const getFilteredGroups = createMemo(() => {
        const query = querySignal[0]().toLocaleLowerCase();

        if (!query) return GROUPED_COUNTRIES;

        return GROUPED_COUNTRIES.map((item) =>
            SelectUtils.getIsGroup(item)
                ? {
                      ...item,
                      options: item.options.filter((option) => option.value.toLocaleLowerCase().includes(query)),
                  }
                : item,
        ).filter((item) =>
            SelectUtils.getIsGroup(item) ? item.options.length > 0 : item.value.toLocaleLowerCase().includes(query),
        );
    });

    const getExamples = createMemo(() => [
        {
            key: "multiSelect",
            name: EXAMPLE_NAMES.multiSelect,
            readout: () => `values: [${countriesSignal[0]().join(", ")}] — picking keeps the list open`,
            component: () => <MultiSelectCountriesExample values={countriesSignal} />,
            path: `${EXAMPLES_ROOT}/MultiSelectCountries.tsx`,
        },
        {
            key: "multiSelectGrouped",
            name: EXAMPLE_NAMES.multiSelectGrouped,
            readout: () =>
                `values: [${groupedSignal[0]().join(", ")}] | query: "${querySignal[0]()}" — the page drops groups it has emptied`,
            component: () => (
                <MultiSelectGroupedExample values={groupedSignal} query={querySignal} options={getFilteredGroups} />
            ),
            path: `${EXAMPLES_ROOT}/MultiSelectGrouped.tsx`,
        },
        {
            key: "multiSelectClearable",
            name: EXAMPLE_NAMES.multiSelectClearable,
            readout: () =>
                `values: [${clearableSignal[0]().join(", ")}] | last change: ${getClearableChange()} — the clear control empties every pick at once`,
            component: () => (
                <MultiSelectClearableExample
                    values={clearableSignal}
                    onSelectionChange={(values) => {
                        setClearableChange(`[${values.join(", ")}]`);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/MultiSelectClearable.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
