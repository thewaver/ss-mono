import { useEffect } from "react";

import { Accordion } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionDeferredExampleProps } from "../../Accordions.types";

const GAP = 5;

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
};

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

type Props = AccordionDeferredExampleProps;

type PanelProps = {
    value: string;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    onBuild: (value: string) => void;
};

const DeferredPanel = (props: PanelProps) => {
    useEffect(() => props.onBuild(props.value), []);

    return (
        <PageAccordionPanel visibilityTarget={props.visibilityTarget} transitionDurationMs={props.transitionDurationMs}>
            {SECTION_BODIES[props.value].map((line) => (
                <div key={line} data-built={props.value}>
                    {line}
                </div>
            ))}
        </PageAccordionPanel>
    );
};

export const DeferredExample = (props: Props) => {
    return (
        <Accordion
            items={ITEMS}
            expandedState={props.expandedState}
            isPanelBuiltOnExpand={true}
            gap={GAP}
            renderHeader={(item, flags) => <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>}
            renderPanel={(item, visibilityTarget, transitionDurationMs) => (
                <DeferredPanel
                    value={item.value}
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                    onBuild={props.onBuild}
                />
            )}
        />
    );
};
