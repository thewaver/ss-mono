import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitor.utils";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { PointerTrackerUtils } from "../../Abstracts/PointerTracker/PointerTracker.utils";
import type { ProximityArrangement } from "../../Abstracts/Proximity/Proximity.types";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { access } from "../../Utils/propUtils";
import { PlacementBoxContextProvider } from "./PlacementBox.context";
import type { PlacementBoxContextType } from "./PlacementBox.context.types";
import type { PlacementBoxProps } from "./PlacementBox.types";

import * as styles from "./PlacementBox.css";

const RESTING_ARRANGEMENT: ProximityArrangement = { spacing: 0, radius: 0, slack: Infinity };

export const PlacementBox = (props: PlacementBoxProps) => {
    const getLayout = createMemo(() => access(props.layout));

    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();

    const getComputeEffect = () => props.computeEffect;

    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(
        getBoxRef,
        () => getComputeEffect() === undefined,
    );

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion(() => getComputeEffect() === undefined);

    const getPointerPoint = createMemo(() => {
        if (getComputeEffect() === undefined || !getIsPointerPresent()) return undefined;

        const layout = getLayout();
        const point = PlacementUtils.toLayoutPoint(getReading().boxRatio, layout.heightRatio);

        return PlacementUtils.getIsWithinReach(layout, point) ? point : undefined;
    });

    const getArrangement = createMemo(() =>
        getComputeEffect() === undefined ? RESTING_ARRANGEMENT : ProximityUtils.toArrangement(getLayout()),
    );

    const context: PlacementBoxContextType = {
        getPointerPoint,
        getArrangement,
        getPrefersReducedMotion,
        getComputeEffect,
    };

    return (
        <PlacementBoxContextProvider value={context}>
            <div
                ref={(element) => {
                    setBoxRef(element);
                    props.ref?.(element);
                }}
                class={styles.placementBox}
                role="presentation"
            >
                <div
                    class={styles.placementSpacer}
                    style={{ height: PlacementUtils.toContainerWidth(getLayout().heightRatio) }}
                    aria-hidden="true"
                />

                {props.children}
            </div>
        </PlacementBoxContextProvider>
    );
};
