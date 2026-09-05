import { Collapsible } from "@thewaver/ss-components";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

const NOTES = ["Signed for on arrival", "Left with a neighbour", "Returned to the depot"];

export const FilledExample = (props: Props) => (
    <Collapsible
        expandedSignal={props.expandedSignal}
        sizing={"fill"}
        isPanelBuiltOnExpand={true}
        renderTrigger={(getFlags) => (
            <PageAccordionHeader flags={getFlags}>
                {getFlags().isExpanded ? "Hide the delivery notes" : "Show the delivery notes"}
            </PageAccordionHeader>
        )}
        renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
            <PageAccordionPanel visibilityTarget={getVisibilityTarget} transitionDurationMs={getTransitionDurationMs}>
                <div>{NOTES.join(" · ")}</div>
            </PageAccordionPanel>
        )}
    />
);
