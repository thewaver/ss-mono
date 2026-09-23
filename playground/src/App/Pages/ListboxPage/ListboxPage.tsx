import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CountriesExample } from "./Examples/Countries";
import { GroupedExample } from "./Examples/Grouped";
import { SizesExample } from "./Examples/Sizes";

const EXAMPLES_ROOT = "/src/App/Pages/ListboxPage/Examples";

export const ListboxPage = () => {
    const singleSignal = createSignal<string | undefined>("Portugal");
    const multipleSignal = createSignal<string[]>(["Denmark"]);
    const sizeSignal = createSignal<string | undefined>();

    const getExamples = createMemo(() => [
        {
            key: "single",
            name: "One value",
            readout: () =>
                `value: ${singleSignal[0]() ?? "undefined"} — one tab stop; the arrows move focus between options and stop on Denmark and Finland, which hover explains`,
            component: () => <CountriesExample valueSignal={singleSignal} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "multiple",
            name: "Several values, in groups",
            readout: () =>
                `values: [${multipleSignal[0]().join(", ")}] — Enter or Space picks and drops, the arrows skip Finland and cross groups`,
            component: () => <GroupedExample valuesSignal={multipleSignal} />,
            path: `${EXAMPLES_ROOT}/Grouped.tsx`,
        },
        {
            key: "horizontalRightToLeft",
            name: "Horizontal, right to left",
            readout: () =>
                `value: ${sizeSignal[0]() ?? "undefined"} — the left arrow moves forward in a right-to-left page, and L is skipped`,
            component: () => <SizesExample valueSignal={sizeSignal} />,
            path: `${EXAMPLES_ROOT}/Sizes.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
