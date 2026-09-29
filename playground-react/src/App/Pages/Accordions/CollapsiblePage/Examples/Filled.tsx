import { Collapsible } from "@thewaver/ss-components-react";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

const NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];

export const FilledExample = (props: Props) => (
    <Collapsible
        expanded={props.expanded}
        sizing={"fill"}
        isPanelBuiltOnExpand={true}
        renderTrigger={(flags) => (
            <PageAccordionHeader flags={flags}>
                {flags.isExpanded ? "Hide the delivery notes" : "Show the delivery notes"}
            </PageAccordionHeader>
        )}
        renderPanel={(visibilityTarget, transitionDurationMs) => (
            <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                <div>{NOTES.join(" · ")}</div>
            </PageAccordionPanel>
        )}
    />
);
