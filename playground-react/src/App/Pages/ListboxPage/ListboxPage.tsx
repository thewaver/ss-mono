import { useState } from "react";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CountriesExample } from "./Examples/Countries";
import { GlideExample } from "./Examples/Glide";
import { GroupedExample } from "./Examples/Grouped";
import { SizesExample } from "./Examples/Sizes";

export const ListboxPage = () => {
    const singleState = useState<string | undefined>("Portugal");
    const multipleState = useState<string[]>(["Denmark"]);
    const sizeState = useState<string | undefined>();
    const glideState = useState<string | undefined>("Portugal");

    const examples = [
        {
            key: "single",
            name: EXAMPLE_NAMES.single,
            readout: () =>
                `value: ${singleState[0] ?? "undefined"} — one tab stop; the arrows move focus between options and stop on Denmark and Finland, which hover explains`,
            component: () => <CountriesExample value={singleState} />,
            path: `${EXAMPLES_ROOT}/Countries.tsx`,
        },
        {
            key: "multiple",
            name: EXAMPLE_NAMES.multiple,
            readout: () =>
                `values: [${multipleState[0].join(", ")}] — Enter or Space picks and drops, the arrows skip Finland and cross groups`,
            component: () => <GroupedExample values={multipleState} />,
            path: `${EXAMPLES_ROOT}/Grouped.tsx`,
        },
        {
            key: "horizontalRightToLeft",
            name: EXAMPLE_NAMES.horizontalRightToLeft,
            readout: () =>
                `value: ${sizeState[0] ?? "undefined"} — the left arrow moves forward in a right-to-left page, and L is skipped`,
            component: () => <SizesExample value={sizeState} />,
            path: `${EXAMPLES_ROOT}/Sizes.tsx`,
        },
        {
            key: "glide",
            name: EXAMPLE_NAMES.glide,
            readout: () =>
                `value: ${glideState[0] ?? "undefined"} — one tinted marker sits on the picked option and a second glides to whichever option the pointer or the arrows are on`,
            component: () => <GlideExample value={glideState} />,
            path: `${EXAMPLES_ROOT}/Glide.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
