import { Accordion, Button } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { AccordionGrowingExampleProps } from "../../Accordions.types";

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

type Props = AccordionGrowingExampleProps;

export const GrowingExample = (props: Props) => {
    return (
        <Accordion
            items={ITEMS}
            expanded={props.expanded}
            gap={props.gap}
            transitionDurationMs={props.transitionDurationMs}
            renderHeader={(item, flags) => <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>}
            renderPanel={(_, visibilityTarget, transitionDurationMs) => (
                <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    <div className={styles.growingButtons}>
                        <Button
                            id={"addALine"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Add a line</PageButtonContent>}
                            onClick={props.onAddLine}
                        />

                        <Button
                            id={"clearLines"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Clear lines</PageButtonContent>}
                            onClick={props.onClearLines}
                        />
                    </div>

                    {Array.from({ length: props.extraLines }, (_unused, index) => (
                        <div key={index}>Line {index + 1} appeared after the panel was already open.</div>
                    ))}
                </PageAccordionPanel>
            )}
        />
    );
};
