import { useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { SelectAllExample } from "./Examples/SelectAll";

const EXAMPLES_ROOT = "/src/App/Pages/CheckboxGroupPage/Examples";

const describe = (values: string[]) => (values.length > 0 ? values.join(", ") : "none");

export const CheckboxGroupPage = () => {
    const defaultState = useState<string[]>(["cheese"]);
    const selectAllState = useState<string[]>(["cheese", "olives"]);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${describe(defaultState[0])} — one list, and each box is its own tab stop`,
            component: () => <DefaultExample value={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "selectAll",
            name: "With a select-all box",
            readout: () =>
                `value: ${describe(selectAllState[0])} — the top box reads mixed while the toppings disagree, and pressing it ticks or clears every one still on sale`,
            component: () => <SelectAllExample value={selectAllState} />,
            path: `${EXAMPLES_ROOT}/SelectAll.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
