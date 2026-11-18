import { Accordion } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
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
import type { AccordionScrolledDocsExampleProps } from "../AccordionPageReact.types";

const ITEMS: AccordionItem<string>[] = [
    { value: "Shipping" },
    { value: "Returns" },
    { value: "Warranty" },
    { value: "Assembly" },
];

type Props = AccordionScrolledDocsExampleProps;

export const ScrolledDocsExample = (props: Props) => (
    <div className={[styles.scrollBox, styles.docsAccordion].join(" ")} data-scroll-box>
        <Accordion
            items={ITEMS}
            gap={DOCS_GAP}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            renderSection={(renderContent, _, flags) => (
                <PageAccordionWrapper flags={flags}>{renderContent()}</PageAccordionWrapper>
            )}
            renderHeader={(item, flags) => <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>}
            renderPanel={(item, visibilityTarget, transitionDurationMs) => (
                <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    {SCROLLED_SECTION_BODIES[item.value].map((line) => (
                        <div key={line}>{line}</div>
                    ))}
                </PageAccordionPanel>
            )}
        />
    </div>
);
