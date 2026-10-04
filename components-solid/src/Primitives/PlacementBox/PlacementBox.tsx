import { createMemo, createSignal } from "solid-js";

import {
    PLACEMENT_BOX_DEFAULTS,
    type PlacementBoxContextType,
    PlacementBoxUtils,
    PlacementUtils,
    PlacementBoxStyles as styles,
} from "@thewaver/ss-components";

import { MediaQueryMonitorSolidUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { PointerTrackerSolidUtils } from "../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { access } from "../../Utils/propUtils";
import { PlacementBoxContextProvider } from "./PlacementBox.context";
import type { PlacementBoxProps } from "./PlacementBoxSolid.types";

export const PlacementBox = (props: PlacementBoxProps) => {
    const getLayout = createMemo(() => access(props.layout));

    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();

    const getComputeEffect = () => props.computeEffect;

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? PLACEMENT_BOX_DEFAULTS.transitionDurationMs,
    );

    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
        getBoxRef,
        () => getComputeEffect() === undefined,
        () => access(props.pointSource),
    );

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion(
        () => !PlacementBoxUtils.getIsMotionQueryNeeded(getComputeEffect() !== undefined, getTransitionDurationMs()),
    );

    const getPointerPoint = createMemo(() =>
        PlacementBoxUtils.computePointerPoint(
            getLayout(),
            getReading().boxRatio,
            getIsPointerPresent(),
            getComputeEffect() !== undefined,
        ),
    );

    const getArrangement = createMemo(() =>
        PlacementBoxUtils.computeArrangement(getLayout(), getComputeEffect() !== undefined),
    );

    const getOverreach = createMemo(() => PlacementBoxUtils.computeOverreach(getLayout(), getPointerPoint()));

    const context: PlacementBoxContextType = {
        getPointerPoint,
        getArrangement,
        getOverreach,
        getPrefersReducedMotion,
        getComputeEffect,
        getTransitionDurationMs: () =>
            PlacementBoxUtils.computeTransitionDurationMs(getTransitionDurationMs(), getPrefersReducedMotion()),
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
