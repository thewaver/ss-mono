import { onMount } from "solid-js";

import { Accordion } from "@thewaver/ss-components";
import type { AccordionItem } from "@thewaver/ss-components";

import { PageAccordionHeader, PageAccordionPanel } from "../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionDeferredExampleProps } from "../AccordionPage.types";

const GAP = 5;

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
};

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

type Props = AccordionDeferredExampleProps;

export const DeferredExample = (props: Props) => {
    return (
        <Accordion
            items={() => ITEMS}
            expandedSignal={props.expandedSignal}
            isPanelBuiltOnExpand={true}
            gap={() => GAP}
            renderHeader={(getItem, getFlags) => (
                <PageAccordionHeader flags={getFlags}>{getItem().value}</PageAccordionHeader>
            )}
            renderPanel={(getItem, getVisibilityTarget, getTransitionDurationMs) => {
                onMount(() => props.onBuild(getItem().value));

                return (
                    <PageAccordionPanel
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        {SECTION_BODIES[getItem().value].map((line) => (
                            <div data-built={getItem().value}>{line}</div>
                        ))}
                    </PageAccordionPanel>
                );
            }}
        />
    );
};
