import { createMemo, createSignal } from "solid-js";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { SelectAllExample } from "./Examples/SelectAll";

const describe = (values: string[]) => (values.length > 0 ? values.join(", ") : "none");

export const CheckboxGroupPage = () => {
    const defaultSignal = createSignal<string[]>(["cheese"]);
    const selectAllSignal = createSignal<string[]>(["cheese", "olives"]);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${describe(defaultSignal[0]())} — one list, and each box is its own tab stop`,
            component: () => <DefaultExample value={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "selectAll",
            name: EXAMPLE_NAMES.selectAll,
            readout: () =>
                `value: ${describe(selectAllSignal[0]())} — the top box reads mixed while the toppings disagree, and pressing it ticks or clears every one still on sale`,
            component: () => <SelectAllExample value={selectAllSignal} />,
            path: `${EXAMPLES_ROOT}/SelectAll.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
