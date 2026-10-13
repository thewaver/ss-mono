import { useState } from "react";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CaptionFirstExample } from "./Examples/CaptionFirst";
import { CheckboxLabelExample } from "./Examples/CheckboxLabel";
import { ColumnExample } from "./Examples/Column";
import { DisabledExample } from "./Examples/Disabled";
import { LabelPerRadioExample } from "./Examples/LabelPerRadio";
import { SuppressedExample } from "./Examples/Suppressed";
import type { PlanValue } from "./LabelPageReact.types";

export const LabelPage = () => {
    const checkedState = useState(false);
    const toggleState = useState(true);
    const columnState = useState(false);
    const disabledState = useState(true);
    const suppressedState = useState(false);
    const planState = useState<PlanValue>("free");

    const examples = [
        {
            key: "checkbox",
            name: EXAMPLE_NAMES.checkbox,
            readout: () => `checked: ${checkedState[0]}`,
            component: () => <CheckboxLabelExample checked={checkedState} />,
            path: `${EXAMPLES_ROOT}/CheckboxLabel.tsx`,
        },
        {
            key: "toggleCaptionFirst",
            name: EXAMPLE_NAMES.toggleCaptionFirst,
            readout: () => `on: ${toggleState[0]}`,
            component: () => <CaptionFirstExample checked={toggleState} />,
            path: `${EXAMPLES_ROOT}/CaptionFirst.tsx`,
        },
        {
            key: "column",
            name: EXAMPLE_NAMES.column,
            readout: () => `checked: ${columnState[0]}`,
            component: () => <ColumnExample checked={columnState} />,
            path: `${EXAMPLES_ROOT}/Column.tsx`,
        },
        {
            key: "labelPerRadio",
            name: EXAMPLE_NAMES.labelPerRadio,
            readout: () => `value: ${planState[0]}`,
            component: () => <LabelPerRadioExample value={planState} />,
            path: `${EXAMPLES_ROOT}/LabelPerRadio.tsx`,
        },
        {
            key: "suppressed",
            name: EXAMPLE_NAMES.suppressed,
            readout: () => `checked: ${suppressedState[0]} — the caption wins, and the console says so`,
            component: () => <SuppressedExample checked={suppressedState} />,
            path: `${EXAMPLES_ROOT}/Suppressed.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `checked: ${disabledState[0]}`,
            component: () => <DisabledExample checked={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
