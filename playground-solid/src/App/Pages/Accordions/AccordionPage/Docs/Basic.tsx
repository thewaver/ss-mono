import { Accordion } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionBasicDocsExampleProps } from "../AccordionPageSolid.types";

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
    Unavailable: ["This section is disabled, so its header refuses to open it."],
};

const ITEMS: AccordionItem<string>[] = [
    { value: "Shipping" },
    { value: "Returns" },
    { value: "Warranty" },
    { value: "Unavailable", isDisabled: true },
];

type Props = AccordionBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => (
    <div class={styles.docsAccordion}>
        <Accordion
            items={ITEMS}
            isSingleExpand={props.isSingleExpand}
            isExpandRequired={props.isExpandRequired}
            gap={props.gap}
            transitionDurationMs={props.transitionDurationMs}
            renderHeader={(getItem, getFlags) => (
                <PageAccordionHeader flags={getFlags}>{getItem().value}</PageAccordionHeader>
            )}
            renderPanel={(getItem, getVisibilityTarget, getTransitionDurationMs) => (
                <PageAccordionPanel
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    {SECTION_BODIES[getItem().value].map((line) => (
                        <div>{line}</div>
                    ))}
                </PageAccordionPanel>
            )}
        />
    </div>
);
