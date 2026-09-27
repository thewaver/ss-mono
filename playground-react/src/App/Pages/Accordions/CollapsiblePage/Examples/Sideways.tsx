import { Collapsible } from "@thewaver/ss-components-react";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

const PANEL_WIDTH = 220;

export const SidewaysExample = (props: Props) => (
    <Collapsible
        expandedState={props.expandedState}
        sizing={"fit-content"}
        side={"right"}
        renderTrigger={(flags) => (
            <PageAccordionHeader flags={flags}>{flags.isExpanded ? "Less" : "More"}</PageAccordionHeader>
        )}
        renderPanel={(visibilityTarget, transitionDurationMs) => (
            <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                <div style={{ width: `${PANEL_WIDTH}px` }}>
                    Opens beside its trigger rather than below it, uncovering contents that keep their own width.
                </div>
            </PageAccordionPanel>
        )}
    />
);
