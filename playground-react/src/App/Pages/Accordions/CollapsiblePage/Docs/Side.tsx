import { Collapsible } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { CollapsibleSideDocsExampleProps } from "../CollapsiblePageReact.types";

const PANEL_WIDTH = 220;

type Props = CollapsibleSideDocsExampleProps;

export const SideDocsExample = (props: Props) => (
    <div className={styles.sideExample}>
        <Collapsible
            side={props.side}
            sizing={"fit-content"}
            renderTrigger={(flags) => (
                <PageAccordionHeader flags={flags} side={props.side}>
                    {flags.isExpanded ? "Less" : "More"}
                </PageAccordionHeader>
            )}
            renderPanel={(visibilityTarget, transitionDurationMs) => (
                <PageAccordionPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    <div style={{ width: `${PANEL_WIDTH}px` }}>
                        Opens beside its trigger rather than below it, uncovering contents that keep their own width.
                    </div>
                </PageAccordionPanel>
            )}
        />
    </div>
);
