import { Accordion } from "@thewaver/ss-components-react";
import type { AccordionItem } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import type { AccordionExampleProps } from "../../Accordions.types";

const GAP = 5;

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

type Props = AccordionExampleProps;

export const RowExample = (props: Props) => {
    const layerClass = useLayerClass();

    return (
        <Accordion
            items={ITEMS}
            expanded={props.expanded}
            orientation={"horizontal"}
            sizing={"fit-content"}
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
                        styles.rowPanel,
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
