import { useEffect, useState } from "react";

import { Collapsible } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as collapsibleStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";

const NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];

type PanelProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    onBuild: () => void;
};

const DeferredPanel = (props: PanelProps) => {
    useEffect(() => props.onBuild(), []);

    return (
        <PageAccordionPanel visibilityTarget={props.visibilityTarget} transitionDurationMs={props.transitionDurationMs}>
            <div>{NOTES.join(" · ")}</div>
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
                    renderTrigger={(flags) => (
                        <PageAccordionHeader flags={flags}>
                            {flags.isExpanded ? "Hide the delivery notes" : "Show the delivery notes"}
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

            <div className={styles.exampleReadout}>{`Panel built: ${isBuilt ? "yes" : "not yet"}`}</div>
        </>
    );
};
