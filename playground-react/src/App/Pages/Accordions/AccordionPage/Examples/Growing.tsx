import { Accordion, Button } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { AccordionGrowingExampleProps } from "../../Accordions.types";

const TRANSITION_DURATION_MS = 400;

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

type Props = AccordionGrowingExampleProps;

export const GrowingExample = (props: Props) => {
    return (
        <Accordion
            items={ITEMS}
            expanded={props.expanded}
            transitionDurationMs={TRANSITION_DURATION_MS}
            renderHeader={(item, flags) => <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>}
            renderPanel={(_, visibilityTarget, transitionDurationMs) => (
                <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    <Button
                        id={"addALine"}
                        renderContent={(flags) => <PageButtonContent flags={flags}>Add a line</PageButtonContent>}
                        onClick={props.onAddLine}
                    />

                    {Array.from({ length: props.extraLines }, (_unused, index) => (
                        <div key={index}>Line {index + 1} appeared after the panel was already open.</div>
                    ))}
                </PageAccordionPanel>
            )}
        />
    );
};
