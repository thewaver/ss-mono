import { useState } from "react";

import { Accordion } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import type { AccordionOrientationDocsExampleProps } from "../AccordionPageReact.types";

const PANEL_BODIES: Record<string, string> = {
    Mountains: "Cold air, long views and a path that only goes up.",
    Coast: "Salt, wind and a horizon that never quite arrives.",
    Forest: "Green light, soft ground and no straight lines anywhere.",
    Desert: "Heat by day, stars by night, and silence in between.",
};

const ITEMS: AccordionItem<string>[] = [
    { value: "Mountains" },
    { value: "Coast" },
    { value: "Forest" },
    { value: "Desert" },
];

type Props = AccordionOrientationDocsExampleProps;

export const OrientationDocsExample = (props: Props) => {
    const layerClass = useLayerClass();
    const expandedState = useState<string[]>(["Mountains"]);

    return (
        <div className={styles.orientationExample} data-orientation={props.orientation}>
            <Accordion
                items={ITEMS}
                gap={DOCS_GAP}
                expanded={expandedState}
                orientation={props.orientation}
                sizing={props.orientation === "horizontal" ? "fit-content" : undefined}
                isSingleExpand={true}
                isExpandRequired={true}
                renderHeader={(item) => (
                    <div className={[styles.orientationStrip, layerClass].join(" ")}>
                        <span className={styles.orientationLabel}>{item.value}</span>
                    </div>
                )}
                renderPanel={(item, visibilityTarget, transitionDurationMs, moveDirection) => (
                    <div
                        className={[styles.orientationPanel, layerClass, visibilityTarget === 1 && styles.isEntering]
                            .filter(Boolean)
                            .join(" ")}
                        data-move={moveDirection}
                        style={{
                            opacity: visibilityTarget,
                            transition: `opacity ${transitionDurationMs}ms`,
                            animationDuration: `${transitionDurationMs}ms`,
                        }}
                    >
                        <div>{PANEL_BODIES[item.value]}</div>
                    </div>
                )}
            />
        </div>
    );
};
