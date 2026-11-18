import { createSignal } from "solid-js";

import { Accordion, AccordionUtils, access } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
import { DOCS_GAP, PANEL_BODIES } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";
import {
    headerJoins,
    panelJoins,
} from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { PageAccordionWrapper } from "../../../../StyledComponents/AccordionContent/AccordionContent";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import type { AccordionOrientationDocsExampleProps } from "../AccordionPageSolid.types";

const ITEMS: AccordionItem<string>[] = [
    { value: "Mountains" },
    { value: "Coast" },
    { value: "Forest" },
    { value: "Desert" },
];

type Props = AccordionOrientationDocsExampleProps;

export const OrientationDocsExample = (props: Props) => {
    const getLayerClass = useLayerClass();
    const expandedSignal = createSignal<string[]>(["Mountains"]);
    const getPanelSide = () => AccordionUtils.getPanelSide(access(props.orientation));

    return (
        <div class={styles.orientationExample} data-orientation={access(props.orientation)}>
            <Accordion
                items={ITEMS}
                gap={DOCS_GAP}
                expanded={expandedSignal}
                orientation={props.orientation}
                sizing={access(props.orientation) === "horizontal" ? "fit-content" : undefined}
                isSingleExpand={true}
                isExpandRequired={true}
                renderSection={(renderContent, _, getFlags) => (
                    <PageAccordionWrapper flags={getFlags}>{renderContent()}</PageAccordionWrapper>
                )}
                renderHeader={(getItem, getFlags) => (
                    <div
                        class={styles.orientationStrip}
                        classList={{
                            [getLayerClass()]: true,
                            [styles.isExpanded]: getFlags().isExpanded,
                            [styles.isHovered]: getFlags().isHovered,
                            [headerJoins[getPanelSide()]]: getFlags().isExpanded,
                        }}
                    >
                        <span class={styles.orientationLabel}>{getItem().value}</span>
                    </div>
                )}
                renderPanel={(getItem, getVisibilityTarget, getTransitionDurationMs, getMoveDirection) => (
                    <div
                        class={styles.orientationPanel}
                        classList={{
                            [getLayerClass()]: true,
                            [styles.isEntering]: getVisibilityTarget() === 1,
                            [panelJoins[getPanelSide()]]: getVisibilityTarget() === 1,
                        }}
                        data-move={getMoveDirection()}
                        style={{
                            "opacity": getVisibilityTarget(),
                            "transition": `opacity ${getTransitionDurationMs()}ms`,
                            "animation-duration": `${getTransitionDurationMs()}ms`,
                        }}
                    >
                        <div>{PANEL_BODIES[getItem().value]}</div>
                    </div>
                )}
            />
        </div>
    );
};
