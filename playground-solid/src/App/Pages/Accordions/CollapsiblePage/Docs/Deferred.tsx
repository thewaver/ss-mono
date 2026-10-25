import { createSignal, onMount } from "solid-js";

import { Collapsible } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as collapsibleStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";

const NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];

export const DeferredDocsExample = () => {
    const [getIsBuilt, setIsBuilt] = createSignal(false);

    return (
        <>
            <div class={collapsibleStyles.docsAccordion}>
                <Collapsible
                    sizing={"fill"}
                    isPanelBuiltOnExpand={true}
                    renderTrigger={(getFlags) => (
                        <PageAccordionHeader flags={getFlags}>
                            {getFlags().isExpanded ? "Hide the delivery notes" : "Show the delivery notes"}
                        </PageAccordionHeader>
                    )}
                    renderPanel={(getVisibilityTarget, getTransitionDurationMs) => {
                        onMount(() => setIsBuilt(true));

                        return (
                            <PageAccordionPanel
                                visibilityTarget={getVisibilityTarget}
                                transitionDurationMs={getTransitionDurationMs}
                            >
                                <div>{NOTES.join(" · ")}</div>
                            </PageAccordionPanel>
                        );
                    }}
                />
            </div>

            <div class={styles.exampleReadout} data-readout>{`Panel built: ${getIsBuilt() ? "yes" : "not yet"}`}</div>
        </>
    );
};
