import { Collapsible } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import {
    PageAccordionHeader,
    PageAccordionPanel,
} from "../../../../StyledComponents/AccordionContent/AccordionContent";
import type { CollapsibleSideDocsExampleProps } from "../CollapsiblePageSolid.types";

const PANEL_WIDTH = 220;

type Props = CollapsibleSideDocsExampleProps;

export const SideDocsExample = (props: Props) => (
    <div class={styles.sideExample}>
        <Collapsible
            side={props.side}
            sizing={"fit-content"}
            renderTrigger={(getFlags) => (
                <PageAccordionHeader flags={getFlags} side={props.side}>
                    {getFlags().isExpanded ? "Less" : "More"}
                </PageAccordionHeader>
            )}
            renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageAccordionPanel
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    <div style={{ width: `${PANEL_WIDTH}px` }}>
                        Opens beside its trigger rather than below it, uncovering contents that keep their own width.
                    </div>
                </PageAccordionPanel>
            )}
        />
    </div>
);
