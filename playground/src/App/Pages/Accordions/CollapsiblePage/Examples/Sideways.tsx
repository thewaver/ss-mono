import { Collapsible } from "@thewaver/ss-components";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

const PANEL_WIDTH = 220;

export const SidewaysExample = (props: Props) => (
    <Collapsible
        expandedSignal={props.expandedSignal}
        sizing={"fit-content"}
        side={"right"}
        renderTrigger={(getFlags) => (
            <PageAccordionHeader flags={getFlags}>{getFlags().isExpanded ? "Less" : "More"}</PageAccordionHeader>
        )}
        renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
            <PageAccordionPanel visibilityTarget={getVisibilityTarget} transitionDurationMs={getTransitionDurationMs}>
                <div style={{ width: `${PANEL_WIDTH}px` }}>
                    Opens beside its trigger rather than below it, uncovering contents that keep their own width.
                </div>
            </PageAccordionPanel>
        )}
    />
);
