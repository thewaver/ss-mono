import { Accordion } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionExampleProps } from "../../Accordions.types";

const GAP = 5;

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

type Props = AccordionExampleProps & {
    isSingleExpand?: boolean;
    isExpandRequired?: boolean;
};

export const SectionsExample = (props: Props) => {
    return (
        <Accordion
            items={ITEMS}
            expandedState={props.expandedState}
            isSingleExpand={props.isSingleExpand}
            isExpandRequired={props.isExpandRequired}
            gap={GAP}
            renderHeader={(item, flags) => <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>}
            renderPanel={(item, visibilityTarget, transitionDurationMs) => (
                <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    {SECTION_BODIES[item.value].map((line) => (
                        <div key={line}>{line}</div>
                    ))}
                </PageAccordionPanel>
            )}
        />
    );
};
