import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { SelectAllExample } from "./Examples/SelectAll";

const EXAMPLES_ROOT = "/src/App/Pages/CheckboxGroupPage/Examples";

const describe = (values: string[]) => (values.length > 0 ? values.join(", ") : "none");

export const CheckboxGroupPage = () => {
    const defaultSignal = createSignal<string[]>(["cheese"]);
    const selectAllSignal = createSignal<string[]>(["cheese", "olives"]);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${describe(defaultSignal[0]())} — one list, and each box is its own tab stop`,
            component: () => <DefaultExample valueSignal={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "selectAll",
            name: "With a select-all box",
            readout: () =>
                `value: ${describe(selectAllSignal[0]())} — the top box reads mixed while the toppings disagree, and pressing it ticks or clears every one still on sale`,
            component: () => <SelectAllExample valueSignal={selectAllSignal} />,
            path: `${EXAMPLES_ROOT}/SelectAll.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
