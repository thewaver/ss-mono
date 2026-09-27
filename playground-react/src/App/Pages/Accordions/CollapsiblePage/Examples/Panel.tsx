import { Collapsible } from "@thewaver/ss-components-react";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

export const PanelExample = (props: Props) => (
    <div>
        <div>
            Orders leave the warehouse within two working days, and tracking arrives by email as soon as the parcel is
            scanned.
        </div>

        <Collapsible
            expandedState={props.expandedState}
            sizing={"fit-content"}
            renderTrigger={(flags) => (
                <PageAccordionHeader flags={flags}>{flags.isExpanded ? "Show less" : "Show more"}</PageAccordionHeader>
            )}
            renderPanel={(visibilityTarget, transitionDurationMs) => (
                <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    <div>
                        Deliveries to the islands take a further two days, and a signature is required for anything
                        above fifty pounds.
                    </div>
                </PageAccordionPanel>
            )}
        />
    </div>
);
