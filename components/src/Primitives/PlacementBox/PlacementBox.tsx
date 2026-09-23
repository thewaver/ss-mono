import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitor.utils";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { PointerTrackerUtils } from "../../Abstracts/PointerTracker/PointerTracker.utils";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { access } from "../../Utils/propUtils";
import { PLACEMENT_BOX_DEFAULTS } from "./PlacementBox.const";
import { PlacementBoxContextProvider } from "./PlacementBox.context";
import type { PlacementBoxContextType } from "./PlacementBox.context.types";
import type { PlacementBoxProps } from "./PlacementBox.types";

import * as styles from "./PlacementBox.css";

const NO_OVERREACH = 0;
const NO_TRANSITION_MS = 0;

export const PlacementBox = (props: PlacementBoxProps) => {
    const getLayout = createMemo(() => access(props.layout));

    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();

    const getComputeEffect = () => props.computeEffect;

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? PLACEMENT_BOX_DEFAULTS.transitionDurationMs,
    );

    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(
        getBoxRef,
        () => getComputeEffect() === undefined,
    );

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion(
        () => getComputeEffect() === undefined && getTransitionDurationMs() <= NO_TRANSITION_MS,
    );

    const getPointerPoint = createMemo(() => {
        if (getComputeEffect() === undefined || !getIsPointerPresent()) return undefined;

        const layout = getLayout();
        const point = PlacementUtils.toLayoutPoint(getReading().boxRatio, layout.heightRatio);

        return PlacementUtils.getIsWithinReach(layout, point) ? point : undefined;
    });

    const getArrangement = createMemo(() =>
        getComputeEffect() === undefined
            ? ProximityUtils.RESTING_ARRANGEMENT
            : ProximityUtils.toArrangement(getLayout()),
    );

    const getOverreach = createMemo(() => {
        const point = getPointerPoint();

        return point === undefined ? NO_OVERREACH : PlacementUtils.getRunOverreach(getLayout(), point);
    });

    const context: PlacementBoxContextType = {
        getPointerPoint,
        getArrangement,
        getOverreach,
        getPrefersReducedMotion,
        getComputeEffect,
        getTransitionDurationMs: () => (getPrefersReducedMotion() ? NO_TRANSITION_MS : getTransitionDurationMs()),
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
