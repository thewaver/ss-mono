import { useMemo, useState } from "react";

import { SelectUtils } from "@thewaver/ss-components-react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { GROUPED_COUNTRIES } from "../SelectPage/SelectPage.const";
import { MultiSelectClearableExample } from "./Examples/MultiSelectClearable";
import { MultiSelectCountriesExample } from "./Examples/MultiSelectCountries";
import { MultiSelectGroupedExample } from "./Examples/MultiSelectGrouped";

const EXAMPLES_ROOT = "/src/App/Pages/MultiSelectPage/Examples";

export const MultiSelectPage = () => {
    const countriesState = useState<string[]>(["Denmark"]);
    const groupedState = useState<string[]>([]);
    const queryState = useState("");
    const clearableState = useState<string[]>(["Belgium", "Sweden"]);
    const [clearableChange, setClearableChange] = useState("none yet");

    const query = queryState[0];

    const filteredGroups = useMemo(() => {
        const needle = query.toLocaleLowerCase();

        if (!needle) return GROUPED_COUNTRIES;

        return GROUPED_COUNTRIES.map((item) =>
            SelectUtils.getIsGroup(item)
                ? {
                      ...item,
                      options: item.options.filter((option) => option.value.toLocaleLowerCase().includes(needle)),
                  }
                : item,
        ).filter((item) =>
            SelectUtils.getIsGroup(item) ? item.options.length > 0 : item.value.toLocaleLowerCase().includes(needle),
        );
    }, [query]);

    const examples = [
        {
            key: "multiSelect",
            name: "Many at once",
            readout: () => `values: [${countriesState[0].join(", ")}] — picking keeps the list open`,
            component: () => <MultiSelectCountriesExample values={countriesState} />,
            path: `${EXAMPLES_ROOT}/MultiSelectCountries.tsx`,
        },
        {
            key: "multiSelectGrouped",
            name: "Grouped, with a query",
            readout: () =>
                `values: [${groupedState[0].join(", ")}] | query: "${query}" — the page drops groups it has emptied`,
            component: () => (
                <MultiSelectGroupedExample
                    values={groupedState}
                    query={queryState}
                    options={filteredGroups}
                />
            ),
            path: `${EXAMPLES_ROOT}/MultiSelectGrouped.tsx`,
        },
        {
            key: "multiSelectClearable",
            name: "Clearable",
            readout: () =>
                `values: [${clearableState[0].join(", ")}] | last change: ${clearableChange} — the clear control empties every pick at once`,
            component: () => (
                <MultiSelectClearableExample
                    values={clearableState}
                    onSelectionChange={(values) => {
                        setClearableChange(`[${values.join(", ")}]`);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/MultiSelectClearable.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
