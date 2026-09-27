import { useCallback, useMemo, useRef } from "react";

import {
    PLACEMENT_BOX_DEFAULTS,
    type PlacementBoxContextType,
    PlacementBoxStyles,
    PlacementBoxUtils,
    PlacementUtils,
} from "@thewaver/ss-components";

import { MediaQueryMonitorReactUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { PointerTrackerReactUtils } from "../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { useLatest } from "../../Utils/refUtils";
import { PlacementBoxContextProvider } from "./PlacementBox.context";
import type { PlacementBoxProps } from "./PlacementBox.types";

export const PlacementBox = (props: PlacementBoxProps) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const latestRef = useLatest(props.ref);

    const layout = props.layout;
    const computeEffect = props.computeEffect;
    const hasEffect = computeEffect !== undefined;
    const transitionDurationMs = props.transitionDurationMs ?? PLACEMENT_BOX_DEFAULTS.transitionDurationMs;

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(boxRef, !hasEffect);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion(
        !PlacementBoxUtils.getIsMotionQueryNeeded(hasEffect, transitionDurationMs),
    );

    const pointerPoint = useMemo(
        () => PlacementBoxUtils.computePointerPoint(layout, reading.boxRatio, isPointerPresent, hasEffect),
        [layout, reading.boxRatio, isPointerPresent, hasEffect],
    );

    const arrangement = useMemo(() => PlacementBoxUtils.computeArrangement(layout, hasEffect), [layout, hasEffect]);

    const overreach = PlacementBoxUtils.computeOverreach(layout, pointerPoint);

    const effectiveDurationMs = PlacementBoxUtils.computeTransitionDurationMs(
        transitionDurationMs,
        prefersReducedMotion,
    );

    const context = useMemo<PlacementBoxContextType>(
        () => ({
            getPointerPoint: () => pointerPoint,
            getArrangement: () => arrangement,
            getOverreach: () => overreach,
            getPrefersReducedMotion: () => prefersReducedMotion,
            getComputeEffect: () => computeEffect,
            getTransitionDurationMs: () => effectiveDurationMs,
        }),
        [pointerPoint, arrangement, overreach, prefersReducedMotion, computeEffect, effectiveDurationMs],
    );

    const setBoxRef = useCallback(
        (element: HTMLDivElement | null) => {
            boxRef.current = element;
            latestRef.current?.(element);
        },
        [latestRef],
    );

    return (
        <PlacementBoxContextProvider value={context}>
            <div ref={setBoxRef} className={PlacementBoxStyles.placementBox} role="presentation">
                <div
                    className={PlacementBoxStyles.placementSpacer}
                    style={{ height: PlacementUtils.toContainerWidth(layout.heightRatio) }}
                    aria-hidden="true"
                />

                {props.children}
            </div>
        </PlacementBoxContextProvider>
    );
};
