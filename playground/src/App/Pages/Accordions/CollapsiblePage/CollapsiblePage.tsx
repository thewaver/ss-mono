import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { FilledExample } from "./Examples/Filled";
import { PanelExample } from "./Examples/Panel";

const EXAMPLES_ROOT = "/src/App/Pages/Accordions/CollapsiblePage/Examples";

export const CollapsiblePage = () => {
    const panelSignal = createSignal(false);
    const filledSignal = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "panel",
            name: "A single panel, no heading",
            readout: () =>
                `expanded: ${panelSignal[0]()} — one trigger and one panel, with none of the group behaviour an accordion adds`,
            component: () => <PanelExample expandedSignal={panelSignal} />,
            path: `${EXAMPLES_ROOT}/Panel.tsx`,
        },
        {
            key: "filled",
            name: "Filling its container, built on first open",
            readout: () =>
                `expanded: ${filledSignal[0]()} — the panel's contents are not built until it is opened, and are kept once they are`,
            component: () => <FilledExample expandedSignal={filledSignal} />,
            path: `${EXAMPLES_ROOT}/Filled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
