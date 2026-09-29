import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    ProximityUtils,
    type RotatorPhase,
    WHEEL_DEFAULTS,
    type WheelFace,
    WheelStyles,
    WheelUtils,
    type WheelWedgeState,
} from "@thewaver/ss-components";
import { StoreUtils } from "@thewaver/ss-utils";

import { MediaQueryMonitorReactUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { PointerTrackerReactUtils } from "../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { RotatorReactUtils } from "../../Abstracts/Rotator/RotatorReact.utils";
import { Barrel } from "../Barrel/Barrel";
import type { WheelController, WheelProps } from "./Wheel.types";

const FIRST_WEDGE = 0;

type WheelSnapshot = {
    currentIndex: number;
    phase: RotatorPhase;
    isSpinnable: boolean;
    isAutoSpinning: boolean;
    isUserSpinning: boolean;
};

const getIsSameSnapshot = (a: WheelSnapshot, b: WheelSnapshot) =>
    a.currentIndex === b.currentIndex &&
    a.phase === b.phase &&
    a.isSpinnable === b.isSpinnable &&
    a.isAutoSpinning === b.isAutoSpinning &&
    a.isUserSpinning === b.isUserSpinning;

export const Wheel = <T,>(props: WheelProps<T>) => {
    const wedgeCount = props.wedges.length;
    const isDisabled = props.isDisabled ?? false;
    const axis = props.axis ?? WHEEL_DEFAULTS.axis;
    const wedgeSize = props.wedgeSize ?? WHEEL_DEFAULTS.wedgeSize;
    const roleDescription = props.roleDescription ?? WHEEL_DEFAULTS.roleDescription;
    const wedgeRoleDescription = props.wedgeRoleDescription ?? WHEEL_DEFAULTS.wedgeRoleDescription;

    const rotation = RotatorReactUtils.useRotator(isDisabled, {
        stepCount: wedgeCount,
        targetIndex: props.targetIndex,
        isAutoSpinEnabled: props.autoSpin?.[0],
        spinDurationMs: props.spinDurationMs,
        settleDurationMs: props.settleDurationMs,
        restDurationMs: props.restDurationMs,
        idleDelayMs: props.idleDelayMs,
        computeSpinTarget: props.computeSpinTarget,
        computeSpinDefs: props.computeSpinDefs,
        computeStepLabel: props.computeWedgeLabel,
        onStepChange: props.onSelectedWedgeChange,
        onSpinEnd: props.onSpinEnd,
    });

    const getWedgeLabel = (index: number) => props.computeWedgeLabel(index, wedgeCount);

    const selectedIndex = WheelUtils.getSelectedIndex(rotation.phase, rotation.currentIndex);

    const layout = useMemo(
        () => WheelUtils.computeLayout(props.computeLayout, wedgeCount),
        [props.computeLayout, wedgeCount],
    );

    const markerCorrection = WheelUtils.getMarkerCorrection(
        layout,
        props.markerDegrees ?? WHEEL_DEFAULTS.markerDegrees,
    );

    const getWedgeAngle = (index: number) =>
        WheelUtils.getWedgeAngle(markerCorrection, index, rotation.stepAngle, rotation.angle);

    const wheelRef = useRef<HTMLDivElement | null>(null);
    const isEffectless = props.computeEffect === undefined;

    const pointer = PointerTrackerReactUtils.usePointerReading(wheelRef, isEffectless);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion(isEffectless);

    const arrangement = useMemo(
        () => (isEffectless || !layout ? undefined : ProximityUtils.toArrangement(layout)),
        [isEffectless, layout],
    );

    const pointerPoint = isEffectless
        ? undefined
        : WheelUtils.getPointerPoint(layout, pointer.reading.boxRatio, pointer.isPointerPresent);

    const overreach = WheelUtils.getOverreach(layout, pointerPoint);

    const getWedgeEffect = (index: number) =>
        WheelUtils.computeWedgeEffect({
            computeEffect: props.computeEffect,
            layout,
            arrangement,
            angle: getWedgeAngle(index),
            point: pointerPoint,
            overreach,
            prefersReducedMotion,
        });

    const getWedgeState = (index: number, face: WheelFace): WheelWedgeState => ({
        index,
        wedgeCount,
        face,
        isSelected: index === selectedIndex,
        angle: getWedgeAngle(index),
        placement: layout?.placements[FIRST_WEDGE],
    });

    const snapshot: WheelSnapshot = {
        currentIndex: rotation.currentIndex,
        phase: rotation.phase,
        isSpinnable: rotation.isSpinnable,
        isAutoSpinning: rotation.phase === "idling",
        isUserSpinning: WheelUtils.getIsUserSpinning(rotation.isAwaitingTarget, rotation.phase),
    };

    const [controllerStore] = useState(() => StoreUtils.create(snapshot, { isEqual: getIsSameSnapshot }));

    useLayoutEffect(() => {
        controllerStore.set(snapshot);
    });

    const [controller] = useState<WheelController>(() => ({
        getCurrentIndex: () => controllerStore.get().currentIndex,
        getPhase: () => controllerStore.get().phase,
        getIsSpinnable: () => controllerStore.get().isSpinnable,
        getIsAutoSpinning: () => controllerStore.get().isAutoSpinning,
        getIsUserSpinning: () => controllerStore.get().isUserSpinning,
        spin: rotation.spin,
        subscribe: controllerStore.subscribe,
    }));

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const renderWedge = (wedge: T, index: number, face: WheelFace) =>
        face === "back"
            ? props.renderWedgeBack?.(wedge, getWedgeState(index, face))
            : props.renderWedge(wedge, getWedgeState(index, face));

    if (props.variant !== "overhead") {
        return (
            <div
                className={WheelStyles.drumWheelRoot}
                role="group"
                aria-roledescription={roleDescription}
                aria-label={props.ariaLabel}
            >
                <Barrel<T>
                    faces={props.wedges}
                    axis={axis}
                    faceSize={wedgeSize}
                    angle={rotation.angle}
                    faceRoleDescription={wedgeRoleDescription}
                    computeFaceDefs={(index, face) => ({
                        ariaLabel: getWedgeLabel(index),
                        isHidden: face === "back" || index !== rotation.targetIndex,
                    })}
                    renderFace={renderWedge}
                />
            </div>
        );
    }

    return (
        <div
            ref={wheelRef}
            className={WheelStyles.overheadWheelRoot}
            role="group"
            aria-roledescription={roleDescription}
            aria-label={props.ariaLabel}
        >
            {props.wedges.map((wedge, index) => {
                const effect = getWedgeEffect(index);

                return (
                    <div
                        key={index}
                        className={WheelStyles.overheadWheelWedge}
                        style={{
                            transform: WheelUtils.getWedgeTransform(getWedgeAngle(index), effect),
                            filter: effect?.filter || undefined,
                        }}
                        role="group"
                        aria-roledescription={wedgeRoleDescription}
                        aria-label={getWedgeLabel(index)}
                    >
                        {renderWedge(wedge, index, "front")}
                    </div>
                );
            })}
        </div>
    );
};
