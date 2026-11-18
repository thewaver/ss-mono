import { Accordion } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
import {
    DOCS_GAP,
    SCROLLED_SECTION_BODIES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
    PageAccordionWrapper,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { AccordionScrolledDocsExampleProps } from "../AccordionPageSolid.types";

const ITEMS: AccordionItem<string>[] = [
    { value: "Shipping" },
    { value: "Returns" },
    { value: "Warranty" },
    { value: "Assembly" },
];

type Props = AccordionScrolledDocsExampleProps;

export const ScrolledDocsExample = (props: Props) => (
    <div class={[styles.scrollBox, styles.docsAccordion].join(" ")} data-scroll-box>
        <Accordion
            items={ITEMS}
            gap={DOCS_GAP}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            renderSection={(renderContent, _, getFlags) => (
                <PageAccordionWrapper flags={getFlags}>{renderContent()}</PageAccordionWrapper>
            )}
            renderHeader={(getItem, getFlags) => (
                <PageAccordionHeader flags={getFlags}>{getItem().value}</PageAccordionHeader>
            )}
            renderPanel={(getItem, getVisibilityTarget, getTransitionDurationMs) => (
                <PageAccordionPanel
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    {SCROLLED_SECTION_BODIES[getItem().value].map((line) => (
                        <div>{line}</div>
                    ))}
                </PageAccordionPanel>
            )}
        />
    </div>
);
