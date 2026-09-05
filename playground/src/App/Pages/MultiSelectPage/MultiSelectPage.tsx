import { createMemo, createSignal } from "solid-js";

import { SelectUtils } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { GROUPED_COUNTRIES } from "../SelectPage/SelectPage.const";
import { MultiSelectCountriesExample } from "./Examples/MultiSelectCountries";
import { MultiSelectGroupedExample } from "./Examples/MultiSelectGrouped";

const EXAMPLES_ROOT = "/src/App/Pages/MultiSelectPage/Examples";

export const MultiSelectPage = () => {
    const countriesSignal = createSignal<string[]>(["Denmark"]);
    const groupedSignal = createSignal<string[]>([]);
    const querySignal = createSignal("");

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
            name: "Many at once",
            readout: () => `values: [${countriesSignal[0]().join(", ")}] — picking keeps the list open`,
            component: () => <MultiSelectCountriesExample valuesSignal={countriesSignal} />,
            path: `${EXAMPLES_ROOT}/MultiSelectCountries.tsx`,
        },
        {
            key: "multiSelectGrouped",
            name: "Grouped, with a query",
            readout: () =>
                `values: [${groupedSignal[0]().join(", ")}] | query: "${querySignal[0]()}" — the page drops groups it has emptied`,
            component: () => (
                <MultiSelectGroupedExample
                    valuesSignal={groupedSignal}
                    querySignal={querySignal}
                    options={getFilteredGroups}
                />
            ),
            path: `${EXAMPLES_ROOT}/MultiSelectGrouped.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
