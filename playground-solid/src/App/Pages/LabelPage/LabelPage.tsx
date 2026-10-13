import { createMemo, createSignal } from "solid-js";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CaptionFirstExample } from "./Examples/CaptionFirst";
import { CheckboxLabelExample } from "./Examples/CheckboxLabel";
import { ColumnExample } from "./Examples/Column";
import { DisabledExample } from "./Examples/Disabled";
import { LabelPerRadioExample } from "./Examples/LabelPerRadio";
import { SuppressedExample } from "./Examples/Suppressed";
import type { PlanValue } from "./LabelPageSolid.types";

export const LabelPage = () => {
    const checkboxSignal = createSignal(false);
    const toggleSignal = createSignal(true);
    const columnSignal = createSignal(false);
    const disabledSignal = createSignal(true);
    const suppressedSignal = createSignal(false);
    const planSignal = createSignal<PlanValue>("free");

    const getExamples = createMemo(() => [
        {
            key: "checkbox",
            name: EXAMPLE_NAMES.checkbox,
            readout: () => `checked: ${checkboxSignal[0]()}`,
            component: () => <CheckboxLabelExample checked={checkboxSignal} />,
            path: `${EXAMPLES_ROOT}/CheckboxLabel.tsx`,
        },
        {
            key: "toggleCaptionFirst",
            name: EXAMPLE_NAMES.toggleCaptionFirst,
            readout: () => `on: ${toggleSignal[0]()}`,
            component: () => <CaptionFirstExample checked={toggleSignal} />,
            path: `${EXAMPLES_ROOT}/CaptionFirst.tsx`,
        },
        {
            key: "column",
            name: EXAMPLE_NAMES.column,
            readout: () => `checked: ${columnSignal[0]()}`,
            component: () => <ColumnExample checked={columnSignal} />,
            path: `${EXAMPLES_ROOT}/Column.tsx`,
        },
        {
            key: "labelPerRadio",
            name: EXAMPLE_NAMES.labelPerRadio,
            readout: () => `value: ${planSignal[0]()}`,
            component: () => <LabelPerRadioExample value={planSignal} />,
            path: `${EXAMPLES_ROOT}/LabelPerRadio.tsx`,
        },
        {
            key: "suppressed",
            name: EXAMPLE_NAMES.suppressed,
            readout: () => `checked: ${suppressedSignal[0]()} — the caption wins, and the console says so`,
            component: () => <SuppressedExample checked={suppressedSignal} />,
            path: `${EXAMPLES_ROOT}/Suppressed.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `checked: ${disabledSignal[0]()}`,
            component: () => <DisabledExample checked={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
