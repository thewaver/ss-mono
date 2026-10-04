import { Accordion } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import type { AccordionExampleProps } from "../../Accordions.types";

const GAP = 5;

const PANEL_BODIES: Record<string, string> = {
    Mountains: "Opens to half the row, header strip included.",
    Coast: "Opens to a third of the row.",
    Forest: "Carries no width of its own, so it fills whatever the closed strips leave.",
    Desert: "Opens to a fifth of the row, narrow enough that the text wraps tightly.",
};

const ITEMS: AccordionItem<string>[] = [
    { value: "Mountains", openWidthShare: 0.5 },
    { value: "Coast", openWidthShare: 1 / 3 },
    { value: "Forest" },
    { value: "Desert", openWidthShare: 0.2 },
];

type Props = AccordionExampleProps;

export const WidthsExample = (props: Props) => {
    const layerClass = useLayerClass();

    return (
        <Accordion
            items={ITEMS}
            expanded={props.expanded}
            orientation={"horizontal"}
            sizing={"fill"}
            isSingleExpand={true}
            isExpandRequired={true}
            gap={GAP}
            renderHeader={(item, flags) => (
                <div
                    className={[styles.rowStrip, layerClass, flags.isHovered && styles.rowStripHovered]
                        .filter(Boolean)
                        .join(" ")}
                >
                    <span className={styles.rowStripLabel}>{item.value}</span>
                </div>
            )}
            renderPanel={(item, visibilityTarget, transitionDurationMs, moveDirection) => (
                <div
                    className={[
                        styles.rowFittedPanel,
                        visibilityTarget === 1 && moveDirection === "forward" && styles.rowPanelEnterForward,
                        visibilityTarget === 1 && moveDirection === "backward" && styles.rowPanelEnterBackward,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={{
                        opacity: visibilityTarget,
                        transition: `opacity ${transitionDurationMs}ms`,
                        animationDuration: `${transitionDurationMs}ms`,
                    }}
                >
                    <strong>{item.value}</strong>

                    <div>{PANEL_BODIES[item.value]}</div>
                </div>
            )}
        />
    );
};
