import { Accordion } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
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
    const getLayerClass = useLayerClass();

    return (
        <Accordion
            items={() => ITEMS}
            expanded={props.expanded}
            orientation={"horizontal"}
            sizing={"fill"}
            isSingleExpand={true}
            isExpandRequired={true}
            gap={() => GAP}
            renderHeader={(getItem, getFlags) => (
                <div
                    class={styles.rowStrip}
                    classList={{ [getLayerClass()]: true, [styles.rowStripHovered]: getFlags().isHovered }}
                >
                    <span class={styles.rowStripLabel}>{getItem().value}</span>
                </div>
            )}
            renderPanel={(getItem, getVisibilityTarget, getTransitionDurationMs, getMoveDirection) => (
                <div
                    class={styles.rowFittedPanel}
                    classList={{
                        [styles.rowPanelEnterForward]: getVisibilityTarget() === 1 && getMoveDirection() === "forward",
                        [styles.rowPanelEnterBackward]:
                            getVisibilityTarget() === 1 && getMoveDirection() === "backward",
                    }}
                    style={{
                        "opacity": getVisibilityTarget(),
                        "transition": `opacity ${getTransitionDurationMs()}ms`,
                        "animation-duration": `${getTransitionDurationMs()}ms`,
                    }}
                >
                    <strong>{getItem().value}</strong>

                    <div>{PANEL_BODIES[getItem().value]}</div>
                </div>
            )}
        />
    );
};
