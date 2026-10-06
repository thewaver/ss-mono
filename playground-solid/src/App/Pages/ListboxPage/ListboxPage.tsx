import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CountriesExample } from "./Examples/Countries";
import { GlideExample } from "./Examples/Glide";
import { GroupedExample } from "./Examples/Grouped";
import { SizesExample } from "./Examples/Sizes";

const EXAMPLES_ROOT = "/src/App/Pages/ListboxPage/Examples";

export const ListboxPage = () => {
    const singleSignal = createSignal<string | undefined>("Portugal");
    const multipleSignal = createSignal<string[]>(["Denmark"]);
    const sizeSignal = createSignal<string | undefined>();
    const glideSignal = createSignal<string | undefined>("Portugal");

    const getExamples = createMemo(() => [
        {
            key: "single",
            name: "One value",
            readout: () =>
                `value: ${singleSignal[0]() ?? "undefined"} — one tab stop; the arrows move focus between options and stop on Denmark and Finland, which hover explains`,
            component: () => <CountriesExample value={singleSignal} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "multiple",
            name: "Several values, in groups",
            readout: () =>
                `values: [${multipleSignal[0]().join(", ")}] — Enter or Space picks and drops, the arrows skip Finland and cross groups`,
            component: () => <GroupedExample values={multipleSignal} />,
            path: `${EXAMPLES_ROOT}/Grouped.tsx`,
        },
        {
            key: "horizontalRightToLeft",
            name: "Horizontal, right to left",
            readout: () =>
                `value: ${sizeSignal[0]() ?? "undefined"} — the left arrow moves forward in a right-to-left page, and L is skipped`,
            component: () => <SizesExample value={sizeSignal} />,
            path: `${EXAMPLES_ROOT}/Sizes.tsx`,
        },
        {
            key: "glide",
            name: "Gliding markers",
            readout: () =>
                `value: ${glideSignal[0]() ?? "undefined"} — one tinted marker sits on the picked option and a second glides to whichever option the pointer or the arrows are on`,
            component: () => <GlideExample value={glideSignal} />,
            path: `${EXAMPLES_ROOT}/Glide.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
