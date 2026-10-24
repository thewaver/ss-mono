import { Collapsible } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { CollapsibleBasicDocsExampleProps } from "../CollapsiblePageReact.types";

type Props = CollapsibleBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => (
    <div className={[styles.textWithPanel, styles.docsAccordion].join(" ")}>
        <div>
            Orders leave the warehouse within two working days, and tracking arrives by email as soon as the parcel is
            scanned.
        </div>

        <Collapsible
            transitionDurationMs={props.transitionDurationMs}
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
