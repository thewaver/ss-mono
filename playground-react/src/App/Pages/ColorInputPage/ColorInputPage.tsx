import { useState } from "react";

import { PALETTE } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CompactExample } from "./Examples/Compact";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { LabeledExample } from "./Examples/Labeled";
import { ReachableExample } from "./Examples/Reachable";
import { SnappingExample } from "./Examples/Snapping";

const EXAMPLES_ROOT = "/src/App/Pages/ColorInputPage/Examples";

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
            name: "Default",
            readout: () => `value: ${defaultState[0]} — the swatch is the painter's, not the browser's`,
            component: () => <DefaultExample valueState={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "compact",
            name: "Compact",
            readout: () => `value: ${compactState[0]} — swatch only, no hex readout`,
            component: () => <CompactExample valueState={compactState} />,
            path: `${EXAMPLES_ROOT}/Compact.tsx`,
        },
        {
            key: "snapping",
            name: "Snapping setter",
            readout: () => `value: ${snappingState[0]} — snapped to the nearest of four`,
            component: () => <SnappingExample valueState={snappingState} />,
            path: `${EXAMPLES_ROOT}/Snapping.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledState[0]}`,
            component: () => <DisabledExample valueState={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableState[0]}`,
            component: () => <ReachableExample valueState={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredState[0]} — black is not a brand color`,
            component: () => <ErroredExample valueState={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `value: ${labeledState[0]} — the caption opens the picker`,
            component: () => <LabeledExample valueState={labeledState} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
