import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { FilledExample } from "./Examples/Filled";
import { PanelExample } from "./Examples/Panel";
import { SidewaysExample } from "./Examples/Sideways";

const EXAMPLES_ROOT = "/src/App/Pages/Accordions/CollapsiblePage/Examples";

export const CollapsiblePage = () => {
    const panelSignal = createSignal(false);
    const filledSignal = createSignal(false);
    const sidewaysSignal = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "panel",
            name: "A single panel, no heading",
            readout: () =>
                `expanded: ${panelSignal[0]()} — one trigger and one panel, with none of the group behavior an accordion adds`,
            component: () => <PanelExample expandedSignal={panelSignal} />,
            path: `${EXAMPLES_ROOT}/Panel.tsx`,
        },
        {
            key: "unheld",
            name: "Nobody holding the state",
            readout: () =>
                "no signal passed — the collapsible keeps whether it is open itself, so the page has nothing to show here",
            component: () => <PanelExample />,
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
        {
            key: "sideways",
            name: "Opening to the side",
            readout: () =>
                `expanded: ${sidewaysSignal[0]()} — the panel grows its width instead of its height, and its contents keep theirs`,
            component: () => <SidewaysExample expandedSignal={sidewaysSignal} />,
            path: `${EXAMPLES_ROOT}/Sideways.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
