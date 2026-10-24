import { createSignal } from "solid-js";

import { Accordion, Button } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

export const GrowingDocsExample = () => {
    const expandedSignal = createSignal<string[]>(["Shipping"]);
    const [getExtraLines, setExtraLines] = createSignal(0);

    return (
        <div class={styles.docsAccordion}>
            <Accordion
                items={ITEMS}
                gap={DOCS_GAP}
                expanded={expandedSignal}
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
                                onClick={() => {
                                    setExtraLines((lines) => lines + 1);
                                }}
                            />

                            <Button
                                id={"clearLines"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Clear lines</PageButtonContent>
                                )}
                                onClick={() => {
                                    setExtraLines(0);
                                }}
                            />
                        </div>

                        {Array.from({ length: getExtraLines() }, (_unused, index) => (
                            <div>Line {index + 1} appeared after the panel was already open.</div>
                        ))}
                    </PageAccordionPanel>
                )}
            />
        </div>
    );
};
