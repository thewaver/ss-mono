import { useState } from "react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { FilledExample } from "./Examples/Filled";
import { PanelExample } from "./Examples/Panel";
import { SidewaysExample } from "./Examples/Sideways";

const EXAMPLES_ROOT = "/src/App/Pages/Accordions/CollapsiblePage/Examples";

export const CollapsiblePage = () => {
    const panelState = useState(false);
    const filledState = useState(false);
    const sidewaysState = useState(false);

    const examples = [
        {
            key: "panel",
            name: "A single panel, no heading",
            readout: () =>
                `expanded: ${panelState[0]} — one trigger and one panel, with none of the group behavior an accordion adds`,
            component: () => <PanelExample expandedState={panelState} />,
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
                `expanded: ${filledState[0]} — the panel's contents are not built until it is opened, and are kept once they are`,
            component: () => <FilledExample expandedState={filledState} />,
            path: `${EXAMPLES_ROOT}/Filled.tsx`,
        },
        {
            key: "sideways",
            name: "Opening to the side",
            readout: () =>
                `expanded: ${sidewaysState[0]} — the panel grows its width instead of its height, and its contents keep theirs`,
            component: () => <SidewaysExample expandedState={sidewaysState} />,
            path: `${EXAMPLES_ROOT}/Sideways.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
