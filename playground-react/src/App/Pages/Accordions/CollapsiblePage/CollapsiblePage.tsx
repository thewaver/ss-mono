import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { FilledExample } from "./Examples/Filled";
import { PanelExample } from "./Examples/Panel";
import { SidewaysExample } from "./Examples/Sideways";

export const CollapsiblePage = () => {
    const panelState = useState(false);
    const filledState = useState(false);
    const sidewaysState = useState(false);

    const examples = [
        {
            key: "panel",
            name: EXAMPLE_NAMES.panel,
            readout: () =>
                `expanded: ${panelState[0]} — one trigger and one panel, with none of the group behavior an accordion adds`,
            component: () => <PanelExample expanded={panelState} />,
            path: `${EXAMPLES_ROOT}/Panel.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the collapsible keeps whether it is open itself, so the page has nothing to show here",
            component: () => <PanelExample />,
            path: `${EXAMPLES_ROOT}/Panel.tsx`,
        },
        {
            key: "filled",
            name: EXAMPLE_NAMES.filled,
            readout: () =>
                `expanded: ${filledState[0]} — the panel's contents are not built until it is opened, and are kept once they are`,
            component: () => <FilledExample expanded={filledState} />,
            path: `${EXAMPLES_ROOT}/Filled.tsx`,
        },
        {
            key: "sideways",
            name: EXAMPLE_NAMES.sideways,
            readout: () =>
                `expanded: ${sidewaysState[0]} — the panel grows its width instead of its height, and its contents keep theirs`,
            component: () => <SidewaysExample expanded={sidewaysState} />,
            path: `${EXAMPLES_ROOT}/Sideways.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
