import { createSignal, onMount } from "solid-js";

import { Accordion } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as accordionStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
};

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

export const DeferredDocsExample = () => {
    const [getBuilt, setBuilt] = createSignal<string[]>([]);

    return (
        <>
            <div class={accordionStyles.docsAccordion}>
                <Accordion
                    items={ITEMS}
                    gap={DOCS_GAP}
                    isPanelBuiltOnExpand={true}
                    renderHeader={(getItem, getFlags) => (
                        <PageAccordionHeader flags={getFlags}>{getItem().value}</PageAccordionHeader>
                    )}
                    renderPanel={(getItem, getVisibilityTarget, getTransitionDurationMs) => {
                        onMount(() =>
                            setBuilt((built) =>
                                built.includes(getItem().value) ? built : [...built, getItem().value],
                            ),
                        );

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
            </div>

            <div
                class={styles.exampleReadout}
                data-readout
            >{`Built so far: ${getBuilt().length ? getBuilt().join(", ") : "nothing"}`}</div>
        </>
    );
};
