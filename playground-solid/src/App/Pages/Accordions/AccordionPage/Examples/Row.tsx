import { Accordion } from "@thewaver/ss-components-solid";
import type { AccordionItem } from "@thewaver/ss-components-solid";
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
    const getLayerClass = useLayerClass();

    return (
        <Accordion
            items={() => ITEMS}
            expanded={props.expanded}
            orientation={"horizontal"}
            sizing={"fit-content"}
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
                    class={styles.rowPanel}
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
