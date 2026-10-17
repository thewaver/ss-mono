import { useState } from "react";

import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-react";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { FilledExample } from "./Examples/Filled";
import { PanelExample } from "./Examples/Panel";
import { SidewaysExample } from "./Examples/Sideways";

export const CollapsiblePage = () => {
    const [transitionDurationMs, setTransitionDurationMs] = useState(COLLAPSIBLE_DEFAULTS.transitionDurationMs);

    const panelState = useState(false);
    const filledState = useState(false);
    const sidewaysState = useState(false);

    const examples = [
        {
            key: "panel",
            name: EXAMPLE_NAMES.panel,
            readout: () =>
                `expanded: ${panelState[0]} — one trigger and one panel, with none of the group behavior an accordion adds`,
            component: () => <PanelExample transitionDurationMs={transitionDurationMs} expanded={panelState} />,
            path: `${EXAMPLES_ROOT}/Panel.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the collapsible keeps whether it is open itself, so the page has nothing to show here",
            component: () => <PanelExample transitionDurationMs={transitionDurationMs} />,
            path: `${EXAMPLES_ROOT}/Panel.tsx`,
        },
        {
            key: "filled",
            name: EXAMPLE_NAMES.filled,
            readout: () =>
                `expanded: ${filledState[0]} — the panel's contents are not built until it is opened, and are kept once they are`,
            component: () => <FilledExample transitionDurationMs={transitionDurationMs} expanded={filledState} />,
            path: `${EXAMPLES_ROOT}/Filled.tsx`,
        },
        {
            key: "sideways",
            name: EXAMPLE_NAMES.sideways,
            readout: () =>
                `expanded: ${sidewaysState[0]} — the panel grows its width instead of its height, and its contents keep theirs`,
            component: () => <SidewaysExample transitionDurationMs={transitionDurationMs} expanded={sidewaysState} />,
            path: `${EXAMPLES_ROOT}/Sideways.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Transition duration (ms)"}
                    hint={"How long the panel takes to open and close. At 0 it opens and closes at once."}
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={AccordionKnobs.MIN_TRANSITION_MS}
                        max={AccordionKnobs.MAX_TRANSITION_MS}
                        step={AccordionKnobs.TRANSITION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Transition duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
