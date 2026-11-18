import { useEffect, useState } from "react";

import { Collapsible } from "@thewaver/ss-components-react";
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

type PanelProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    onBuild: () => void;
};

const DeferredPanel = (props: PanelProps) => {
    useEffect(() => props.onBuild(), []);

    return (
        <PageAccordionPanel visibilityTarget={props.visibilityTarget} transitionDurationMs={props.transitionDurationMs}>
            <div>{DELIVERY_NOTES.join(" · ")}</div>
        </PageAccordionPanel>
    );
};

export const DeferredDocsExample = () => {
    const [isBuilt, setIsBuilt] = useState(false);

    return (
        <>
            <div className={collapsibleStyles.docsAccordion}>
                <Collapsible
                    sizing={"fill"}
                    isPanelBuiltOnExpand={true}
                    renderSection={(renderContent, flags) => (
                        <PageAccordionWrapper flags={flags}>{renderContent()}</PageAccordionWrapper>
                    )}
                    renderTrigger={(flags) => (
                        <PageAccordionHeader flags={flags}>
                            {flags.isExpanded ? HIDE_DELIVERY_NOTES_TEXT : SHOW_DELIVERY_NOTES_TEXT}
                        </PageAccordionHeader>
                    )}
                    renderPanel={(visibilityTarget, transitionDurationMs) => (
                        <DeferredPanel
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                            onBuild={() => {
                                setIsBuilt(true);
                            }}
                        />
                    )}
                />
            </div>

            <div className={styles.exampleReadout} data-readout>{`Panel built: ${isBuilt ? "yes" : "not yet"}`}</div>
        </>
    );
};
