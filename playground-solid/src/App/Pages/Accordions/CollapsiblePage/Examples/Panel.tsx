import { Collapsible } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

export const PanelExample = (props: Props) => (
    <div class={styles.textWithPanel}>
        <div>
            Orders leave the warehouse within two working days, and tracking arrives by email as soon as the parcel is
            scanned.
        </div>

        <Collapsible
            expanded={props.expanded}
            sizing={"fit-content"}
            renderTrigger={(getFlags) => (
                <PageAccordionHeader flags={getFlags}>
                    {getFlags().isExpanded ? "Show less" : "Show more"}
                </PageAccordionHeader>
            )}
            renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageAccordionPanel
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    <div>
                        Deliveries to the islands take a further two days, and a signature is required for anything
                        above fifty pounds.
                    </div>
                </PageAccordionPanel>
            )}
        />
    </div>
);
