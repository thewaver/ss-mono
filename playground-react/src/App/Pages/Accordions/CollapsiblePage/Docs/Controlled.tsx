import { useState } from "react";

import { Button, Collapsible } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";

export const ControlledDocsExample = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className={styles.docsAccordion}>
                <Collapsible
                    expanded={[isExpanded, setIsExpanded]}
                    sizing={"fit-content"}
                    renderTrigger={(flags) => (
                        <PageAccordionHeader flags={flags}>
                            {flags.isExpanded ? "Show less" : "Show more"}
                        </PageAccordionHeader>
                    )}
                    renderPanel={(visibilityTarget, transitionDurationMs) => (
                        <PageAccordionPanel
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        >
                            <div>Pressing the trigger and the button below both write the same boolean.</div>
                        </PageAccordionPanel>
                    )}
                />
            </div>

            <Button
                renderContent={(flags) => <PageButtonContent flags={flags}>Toggle from here</PageButtonContent>}
                onClick={() => {
                    setIsExpanded((prev) => !prev);
                }}
            />
        </>
    );
};
