import { useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CaptionFirstExample } from "./Examples/CaptionFirst";
import { CheckboxLabelExample } from "./Examples/CheckboxLabel";
import { ColumnExample } from "./Examples/Column";
import { DisabledExample } from "./Examples/Disabled";
import { LabelPerRadioExample } from "./Examples/LabelPerRadio";
import { SuppressedExample } from "./Examples/Suppressed";
import type { PlanValue } from "./LabelPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/LabelPage/Examples";

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
            name: "Checkbox",
            readout: () => `checked: ${checkedState[0]}`,
            component: () => <CheckboxLabelExample checked={checkedState} />,
            path: `${EXAMPLES_ROOT}/CheckboxLabel.tsx`,
        },
        {
            key: "toggleCaptionFirst",
            name: "Toggle, caption first",
            readout: () => `on: ${toggleState[0]}`,
            component: () => <CaptionFirstExample checked={toggleState} />,
            path: `${EXAMPLES_ROOT}/CaptionFirst.tsx`,
        },
        {
            key: "column",
            name: "Column",
            readout: () => `checked: ${columnState[0]}`,
            component: () => <ColumnExample checked={columnState} />,
            path: `${EXAMPLES_ROOT}/Column.tsx`,
        },
        {
            key: "labelPerRadio",
            name: "One label per radio",
            readout: () => `value: ${planState[0]}`,
            component: () => <LabelPerRadioExample value={planState} />,
            path: `${EXAMPLES_ROOT}/LabelPerRadio.tsx`,
        },
        {
            key: "suppressed",
            name: "Suppressed aria-label",
            readout: () => `checked: ${suppressedState[0]} — the caption wins, and the console says so`,
            component: () => <SuppressedExample checked={suppressedState} />,
            path: `${EXAMPLES_ROOT}/Suppressed.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `checked: ${disabledState[0]}`,
            component: () => <DisabledExample checked={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
