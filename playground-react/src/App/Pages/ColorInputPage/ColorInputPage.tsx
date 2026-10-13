import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    PALETTE,
} from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CompactExample } from "./Examples/Compact";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { LabeledExample } from "./Examples/Labeled";
import { ReachableExample } from "./Examples/Reachable";
import { SnappingExample } from "./Examples/Snapping";

export const ColorInputPage = () => {
    const defaultState = useState("#3366ff");
    const compactState = useState("#3366ff");
    const snappingState = useState(PALETTE[0]);
    const disabledState = useState("#888888");
    const reachableState = useState("#888888");
    const erroredState = useState("#000000");
    const labeledState = useState("#ff0055");

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${defaultState[0]} — the swatch is the painter's, not the browser's`,
            component: () => <DefaultExample value={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "compact",
            name: EXAMPLE_NAMES.compact,
            readout: () => `value: ${compactState[0]} — swatch only, no hex readout`,
            component: () => <CompactExample value={compactState} />,
            path: `${EXAMPLES_ROOT}/Compact.tsx`,
        },
        {
            key: "snapping",
            name: EXAMPLE_NAMES.snapping,
            readout: () => `value: ${snappingState[0]} — snapped to the nearest of four`,
            component: () => <SnappingExample value={snappingState} />,
            path: `${EXAMPLES_ROOT}/Snapping.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabledState[0]}`,
            component: () => <DisabledExample value={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachableState[0]}`,
            component: () => <ReachableExample value={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${erroredState[0]} — black is not a brand color`,
            component: () => <ErroredExample value={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "label",
            name: EXAMPLE_NAMES.label,
            readout: () => `value: ${labeledState[0]} — the caption opens the picker`,
            component: () => <LabeledExample value={labeledState} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
