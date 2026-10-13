import { createMemo, createSignal } from "solid-js";

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
    const defaultSignal = createSignal("#3366ff");
    const compactSignal = createSignal("#3366ff");
    const snappingSignal = createSignal(PALETTE[0]);
    const disabledSignal = createSignal("#888888");
    const reachableSignal = createSignal("#888888");
    const erroredSignal = createSignal("#000000");
    const labeledSignal = createSignal("#ff0055");

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${defaultSignal[0]()} — the swatch is the painter's, not the browser's`,
            component: () => <DefaultExample value={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "compact",
            name: EXAMPLE_NAMES.compact,
            readout: () => `value: ${compactSignal[0]()} — swatch only, no hex readout`,
            component: () => <CompactExample value={compactSignal} />,
            path: `${EXAMPLES_ROOT}/Compact.tsx`,
        },
        {
            key: "snapping",
            name: EXAMPLE_NAMES.snapping,
            readout: () => `value: ${snappingSignal[0]()} — snapped to the nearest of four`,
            component: () => <SnappingExample value={snappingSignal} />,
            path: `${EXAMPLES_ROOT}/Snapping.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabledSignal[0]()}`,
            component: () => <DisabledExample value={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachableSignal[0]()}`,
            component: () => <ReachableExample value={reachableSignal} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${erroredSignal[0]()} — black is not a brand color`,
            component: () => <ErroredExample value={erroredSignal} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "label",
            name: EXAMPLE_NAMES.label,
            readout: () => `value: ${labeledSignal[0]()} — the caption opens the picker`,
            component: () => <LabeledExample value={labeledSignal} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
