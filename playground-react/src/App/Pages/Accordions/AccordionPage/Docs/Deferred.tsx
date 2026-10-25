import { useEffect, useState } from "react";

import { Accordion } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
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

export const DeferredDocsExample = () => {
    const [built, setBuilt] = useState<string[]>([]);

    return (
        <>
            <div className={accordionStyles.docsAccordion}>
                <Accordion
                    items={ITEMS}
                    gap={DOCS_GAP}
                    isPanelBuiltOnExpand={true}
                    renderHeader={(item, flags) => (
                        <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>
                    )}
                    renderPanel={(item, visibilityTarget, transitionDurationMs) => (
                        <DeferredPanel
                            value={item.value}
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                            onBuild={(value) => {
                                setBuilt((prev) => (prev.includes(value) ? prev : [...prev, value]));
                            }}
                        />
                    )}
                />
            </div>

            <div
                className={styles.exampleReadout}
                data-readout
            >{`Built so far: ${built.length ? built.join(", ") : "nothing"}`}</div>
        </>
    );
};
