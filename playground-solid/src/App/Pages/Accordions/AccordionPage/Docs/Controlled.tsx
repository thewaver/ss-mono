import { createSignal } from "solid-js";

import { Accordion, Button } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import { PageControlRow } from "../../../../PageComponents/ControlRow/ControlRow";
import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
};

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

export const ControlledDocsExample = () => {
    const expandedSignal = createSignal<string[]>(["Shipping"]);

    return (
        <>
            <div class={styles.docsAccordion}>
                <Accordion
                    items={ITEMS}
                    gap={DOCS_GAP}
                    expanded={expandedSignal}
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

            <PageControlRow>
                <Button
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open all</PageButtonContent>}
                    onClick={() => {
                        expandedSignal[1](ITEMS.map((item) => item.value));
                    }}
                />

                <Button
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Close all</PageButtonContent>}
                    onClick={() => {
                        expandedSignal[1]([]);
                    }}
                />
            </PageControlRow>
        </>
    );
};
