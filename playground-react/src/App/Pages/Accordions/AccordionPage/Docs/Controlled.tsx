import { useState } from "react";

import { Accordion, Button } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
import {
    DOCS_GAP,
    ENABLED_SECTION_BODIES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import { PageControlRow } from "../../../../PageComponents/ControlRow/ControlRow";
import {
    PageAccordionHeader,
    PageAccordionPanel,
    PageAccordionWrapper,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";

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
                    renderSection={(renderContent, _, flags) => (
                        <PageAccordionWrapper flags={flags}>{renderContent()}</PageAccordionWrapper>
                    )}
                    renderHeader={(item, flags) => (
                        <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>
                    )}
                    renderPanel={(item, visibilityTarget, transitionDurationMs) => (
                        <PageAccordionPanel
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        >
                            {ENABLED_SECTION_BODIES[item.value].map((line) => (
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
