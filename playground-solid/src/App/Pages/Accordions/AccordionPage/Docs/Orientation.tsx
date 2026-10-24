import { createSignal } from "solid-js";

import { Accordion, access } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import type { AccordionOrientationDocsExampleProps } from "../AccordionPageSolid.types";

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
    const getLayerClass = useLayerClass();
    const expandedSignal = createSignal<string[]>(["Mountains"]);

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
                renderHeader={(getItem) => (
                    <div class={[styles.orientationStrip, getLayerClass()].join(" ")}>
                        <span class={styles.orientationLabel}>{getItem().value}</span>
                    </div>
                )}
                renderPanel={(getItem, getVisibilityTarget, getTransitionDurationMs, getMoveDirection) => (
                    <div
                        class={[styles.orientationPanel, getLayerClass()].join(" ")}
                        classList={{ [styles.isEntering]: getVisibilityTarget() === 1 }}
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
