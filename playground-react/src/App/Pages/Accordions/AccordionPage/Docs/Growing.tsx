import { useState } from "react";

import { Accordion, Button } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

export const GrowingDocsExample = () => {
    const expandedState = useState<string[]>(["Shipping"]);
    const [extraLines, setExtraLines] = useState(0);

    return (
        <div className={styles.docsAccordion}>
            <Accordion
                items={ITEMS}
                gap={DOCS_GAP}
                expanded={expandedState}
                renderHeader={(item, flags) => <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>}
                renderPanel={(_, visibilityTarget, transitionDurationMs) => (
                    <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        <div className={styles.growingButtons}>
                            <Button
                                id={"addALine"}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>Add a line</PageButtonContent>
                                )}
                                onClick={() => {
                                    setExtraLines((prev) => prev + 1);
                                }}
                            />

                            <Button
                                id={"clearLines"}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>Clear lines</PageButtonContent>
                                )}
                                onClick={() => {
                                    setExtraLines(0);
                                }}
                            />
                        </div>

                        {Array.from({ length: extraLines }, (_unused, index) => (
                            <div key={index}>Line {index + 1} appeared after the panel was already open.</div>
                        ))}
                    </PageAccordionPanel>
                )}
            />
        </div>
    );
};
