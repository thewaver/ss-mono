import type { Accessor } from "solid-js";
import { Index, Show, createMemo, createSignal, onMount } from "solid-js";

import {
    ProximityUtils,
    WHEEL_DEFAULTS,
    type WheelFace,
    WheelUtils,
    type WheelWedgeState,
    WheelStyles as styles,
} from "@thewaver/ss-components";

import { MediaQueryMonitorSolidUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { PointerTrackerSolidUtils } from "../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { RotatorSolidUtils } from "../../Abstracts/Rotator/RotatorSolid.utils";
import { access } from "../../Utils/propUtils";
import { Barrel } from "../Barrel/Barrel";
import type { WheelController, WheelProps } from "./WheelSolid.types";

const FIRST_WEDGE = 0;

export const Wheel = <T,>(props: WheelProps<T>) => {
    const getWedgeCount = createMemo(() => access(props.wedges).length);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getAxis = createMemo(() => access(props.axis) ?? WHEEL_DEFAULTS.axis);

    const getWedgeSize = createMemo(() => access(props.wedgeSize) ?? WHEEL_DEFAULTS.wedgeSize);

    const rotation = RotatorSolidUtils.createRotator(getIsDisabled, {
        stepCount: getWedgeCount,
        spinDurationMs: props.spinDurationMs,
        settleDurationMs: props.settleDurationMs,
        restDurationMs: props.restDurationMs,
        idleDelayMs: props.idleDelayMs,
        computeSpinTarget: props.computeSpinTarget,
        computeSpinDefs: props.computeSpinDefs,
        computeStepLabel: props.computeWedgeLabel,
        onStepChange: props.onSelectedWedgeChange,
        targetIndex: props.targetIndex,
        autoSpin: props.autoSpin,
        onSpinEnd: props.onSpinEnd,
    });

    const getWedgeLabel = (index: number) => props.computeWedgeLabel(index, getWedgeCount());

    const getRoleDescription = () => access(props.roleDescription) ?? WHEEL_DEFAULTS.roleDescription;

    const getWedgeRoleDescription = () => access(props.wedgeRoleDescription) ?? WHEEL_DEFAULTS.wedgeRoleDescription;

    const getSelectedIndex = createMemo(() =>
        WheelUtils.getSelectedIndex(rotation.getPhase(), rotation.getCurrentIndex()),
    );

    const getLayout = createMemo(() => WheelUtils.computeLayout(props.computeLayout, getWedgeCount()));

    const getMarkerCorrection = createMemo(() =>
        WheelUtils.getMarkerCorrection(getLayout(), access(props.markerDegrees) ?? WHEEL_DEFAULTS.markerDegrees),
    );

    const getWedgeAngle = (index: number) =>
        WheelUtils.getWedgeAngle(getMarkerCorrection(), index, rotation.getStepAngle(), rotation.getAngle());

    const [getWheelRef, setWheelRef] = createSignal<HTMLElement>();

    const getComputeEffect = () => props.computeEffect;

    const pointer = PointerTrackerSolidUtils.create(
        getWheelRef,
        () => getComputeEffect() === undefined,
        () => access(props.pointSource),
    );

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion(
        () => getComputeEffect() === undefined,
    );

    const getArrangement = createMemo(() => {
        const layout = getLayout();

        return getComputeEffect() === undefined || !layout ? undefined : ProximityUtils.toArrangement(layout);
    });

    const getPointerPoint = createMemo(() => {
        if (getComputeEffect() === undefined) return undefined;

        return WheelUtils.getPointerPoint(getLayout(), pointer.getReading().boxRatio, pointer.getIsPointerPresent());
    });

    const getOverreach = createMemo(() => WheelUtils.getOverreach(getLayout(), getPointerPoint()));

    const getWedgeEffect = (index: number) =>
        WheelUtils.computeWedgeEffect({
            computeEffect: getComputeEffect(),
            layout: getLayout(),
            arrangement: getArrangement(),
            angle: getWedgeAngle(index),
            point: getPointerPoint(),
            overreach: getOverreach(),
            prefersReducedMotion: getPrefersReducedMotion(),
        });

    const getWedgeState = (index: number, face: WheelFace): WheelWedgeState => ({
        index,
        wedgeCount: getWedgeCount(),
        face,
        isSelected: index === getSelectedIndex(),
        angle: getWedgeAngle(index),
        placement: getLayout()?.placements[FIRST_WEDGE],
    });

    const controller: WheelController = {
        getCurrentIndex: rotation.getCurrentIndex,
        getPhase: rotation.getPhase,
        getIsSpinnable: rotation.getIsSpinnable,
        getIsAutoSpinning: () => rotation.getPhase() === "idling",
        getIsUserSpinning: () => WheelUtils.getIsUserSpinning(rotation.getIsAwaitingTarget(), rotation.getPhase()),
        spin: rotation.spin,
    };

    const renderWedge = (getWedge: Accessor<T>, index: number, face: WheelFace) =>
        face === "back"
            ? props.renderWedgeBack?.(getWedge, () => getWedgeState(index, face))
            : props.renderWedge(getWedge, () => getWedgeState(index, face));

    onMount(() => {
        props.onMount?.(controller);
    });

    return (
        <Show
            when={access(props.variant) === "overhead"}
            fallback={
                <div
                    class={styles.drumWheelRoot}
                    role="group"
                    aria-roledescription={getRoleDescription()}
                    aria-label={access(props.ariaLabel)}
                >
                    <Barrel<T>
                        faces={props.wedges}
                        axis={getAxis}
                        faceSize={getWedgeSize}
                        angle={rotation.getAngle}
                        faceRoleDescription={getWedgeRoleDescription}
                        computeFaceDefs={(index, face) => ({
                            ariaLabel: getWedgeLabel(index),
                            isHidden: face === "back" || index !== rotation.getTargetIndex(),
                        })}
                        renderFace={renderWedge}
                    />
                </div>
            }
        >
            <div
                ref={setWheelRef}
                class={styles.overheadWheelRoot}
                role="group"
                aria-roledescription={getRoleDescription()}
                aria-label={access(props.ariaLabel)}
            >
                <Index each={access(props.wedges)}>
                    {(getWedge, index) => {
                        const getEffect = createMemo(() => getWedgeEffect(index));

                        return (
                            <div
                                class={styles.overheadWheelWedge}
                                style={{
                                    transform: WheelUtils.getWedgeTransform(getWedgeAngle(index), getEffect()),
                                    filter: getEffect()?.filter || undefined,
                                }}
                                role="group"
                                aria-roledescription={getWedgeRoleDescription()}
                                aria-label={getWedgeLabel(index)}
                            >
                                {renderWedge(getWedge, index, "front")}
                            </div>
                        );
                    }}
                </Index>
            </div>
        </Show>
    );
};
