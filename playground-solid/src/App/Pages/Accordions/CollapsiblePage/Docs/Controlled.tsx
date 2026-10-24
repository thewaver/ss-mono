import { createSignal } from "solid-js";

import { Button, Collapsible } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";

export const ControlledDocsExample = () => {
    const [getIsExpanded, setIsExpanded] = createSignal(false);

    return (
        <>
            <div class={styles.docsAccordion}>
                <Collapsible
                    expanded={[getIsExpanded, setIsExpanded]}
                    sizing={"fit-content"}
                    renderTrigger={(getFlags) => (
                        <PageAccordionHeader flags={getFlags}>
                            {getFlags().isExpanded ? "Show less" : "Show more"}
                        </PageAccordionHeader>
                    )}
                    renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
                        <PageAccordionPanel
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                        >
                            <div>Pressing the trigger and the button below both write the same boolean.</div>
                        </PageAccordionPanel>
                    )}
                />
            </div>

            <Button
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Toggle from here</PageButtonContent>}
                onClick={() => {
                    setIsExpanded((isExpanded) => !isExpanded);
                }}
            />
        </>
    );
};
