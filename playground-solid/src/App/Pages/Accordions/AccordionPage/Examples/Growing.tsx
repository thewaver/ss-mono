import { Accordion, Button, access } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
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
            renderHeader={(getItem, getFlags) => (
                <PageAccordionHeader flags={getFlags}>{getItem().value}</PageAccordionHeader>
            )}
            renderPanel={(_, getVisibilityTarget, getTransitionDurationMs) => (
                <PageAccordionPanel
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    <div class={styles.growingButtons}>
                        <Button
                            id={"addALine"}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>Add a line</PageButtonContent>
                            )}
                            onClick={props.onAddLine}
                        />

                        <Button
                            id={"clearLines"}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>Clear lines</PageButtonContent>
                            )}
                            onClick={props.onClearLines}
                        />
                    </div>

                    {Array.from({ length: access(props.extraLines) }, (_unused, index) => (
                        <div>Line {index + 1} appeared after the panel was already open.</div>
                    ))}
                </PageAccordionPanel>
            )}
        />
    );
};
