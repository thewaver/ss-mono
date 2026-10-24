import { useState } from "react";

import { Accordion, Button } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
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
    const expandedState = useState<string[]>(["Shipping"]);

    return (
        <>
            <div className={styles.docsAccordion}>
                <Accordion
                    items={ITEMS}
                    gap={DOCS_GAP}
                    expanded={expandedState}
                    renderHeader={(item, flags) => (
                        <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>
                    )}
                    renderPanel={(item, visibilityTarget, transitionDurationMs) => (
                        <PageAccordionPanel
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        >
                            {SECTION_BODIES[item.value].map((line) => (
                                <div key={line}>{line}</div>
                            ))}
                        </PageAccordionPanel>
                    )}
                />
            </div>

            <PageControlRow>
                <Button
                    renderContent={(flags) => <PageButtonContent flags={flags}>Open all</PageButtonContent>}
                    onClick={() => {
                        expandedState[1](ITEMS.map((item) => item.value));
                    }}
                />

                <Button
                    renderContent={(flags) => <PageButtonContent flags={flags}>Close all</PageButtonContent>}
                    onClick={() => {
                        expandedState[1]([]);
                    }}
                />
            </PageControlRow>
        </>
    );
};
