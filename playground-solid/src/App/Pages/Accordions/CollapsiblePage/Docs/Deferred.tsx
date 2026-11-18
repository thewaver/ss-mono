import { createSignal, onMount } from "solid-js";

import { Collapsible } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as collapsibleStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";
import {
    DELIVERY_NOTES,
    HIDE_DELIVERY_NOTES_TEXT,
    SHOW_DELIVERY_NOTES_TEXT,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

import {
    PageAccordionHeader,
    PageAccordionPanel,
    PageAccordionWrapper,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";

export const DeferredDocsExample = () => {
    const [getIsBuilt, setIsBuilt] = createSignal(false);

    return (
        <>
            <div class={collapsibleStyles.docsAccordion}>
                <Collapsible
                    sizing={"fill"}
                    isPanelBuiltOnExpand={true}
                    renderSection={(renderContent, getFlags) => (
                        <PageAccordionWrapper flags={getFlags}>{renderContent()}</PageAccordionWrapper>
                    )}
                    renderTrigger={(getFlags) => (
                        <PageAccordionHeader flags={getFlags}>
                            {getFlags().isExpanded ? HIDE_DELIVERY_NOTES_TEXT : SHOW_DELIVERY_NOTES_TEXT}
                        </PageAccordionHeader>
                    )}
                    renderPanel={(getVisibilityTarget, getTransitionDurationMs) => {
                        onMount(() => setIsBuilt(true));

                        return (
                            <PageAccordionPanel
                                visibilityTarget={getVisibilityTarget}
                                transitionDurationMs={getTransitionDurationMs}
                            >
                                <div>{DELIVERY_NOTES.join(" · ")}</div>
                            </PageAccordionPanel>
                        );
                    }}
                />
            </div>

            <div class={styles.exampleReadout} data-readout>{`Panel built: ${getIsBuilt() ? "yes" : "not yet"}`}</div>
        </>
    );
};
