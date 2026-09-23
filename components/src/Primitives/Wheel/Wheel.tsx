import type { Accessor } from "solid-js";
import { Index, Show, createMemo, createSignal, onMount } from "solid-js";

import { AngleUtils, CSSUtils, type Point2d } from "@thewaver/ss-utils";

import { MediaQueryMonitorUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitor.utils";
import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { PointerTrackerUtils } from "../../Abstracts/PointerTracker/PointerTracker.utils";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { RotatorUtils } from "../../Abstracts/Rotator/Rotator.utils";
import { access } from "../../Utils/propUtils";
import { Barrel } from "../Barrel/Barrel";
import { WHEEL_DEFAULTS } from "./Wheel.const";
import type { WheelController, WheelFace, WheelProps, WheelWedgeState } from "./Wheel.types";

import * as styles from "./Wheel.css";

const ROOT_PATH: number[] = [];
const NO_PARENT_EXTENT = 0;
const FIRST_WEDGE = 0;

const NO_CORRECTION = 0;
const HALF = 0.5;
const SQUARE_HEIGHT_RATIO = 1;
const NO_OVERREACH = 0;

const toTurnedPoint = (point: Point2d, origin: Point2d, degrees: number): Point2d => {
    const radians = degrees * AngleUtils.RADIANS_PER_DEGREE;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const offset = { x: point.x - origin.x, y: point.y - origin.y };

    return {
        x: origin.x + offset.x * cos - offset.y * sin,
        y: origin.y + offset.x * sin + offset.y * cos,
    };
};

export const Wheel = <T,>(props: WheelProps<T>) => {
    const getWedgeCount = createMemo(() => access(props.wedges).length);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getAxis = createMemo(() => access(props.axis) ?? WHEEL_DEFAULTS.axis);

    const getWedgeSize = createMemo(() => access(props.wedgeSize) ?? WHEEL_DEFAULTS.wedgeSize);

    const rotation = RotatorUtils.createRotator(getIsDisabled, {
        stepCount: getWedgeCount,
        spinDurationMs: props.spinDurationMs,
        settleDurationMs: props.settleDurationMs,
        restDurationMs: props.restDurationMs,
        idleDelayMs: props.idleDelayMs,
        computeSpinTarget: props.computeSpinTarget,
        computeSpinDefs: props.computeSpinDefs,
        computeStepLabel: props.computeWedgeLabel,
        onStepChange: props.onSelectedWedgeChange,
        targetIndexSignal: props.targetIndexSignal,
        autoSpinSignal: props.autoSpinSignal,
        onSpinEnd: props.onSpinEnd,
    });

    const getWedgeLabel = (index: number) => props.computeWedgeLabel(index, getWedgeCount());

    const getRoleDescription = () => access(props.roleDescription) ?? WHEEL_DEFAULTS.roleDescription;

    const getWedgeRoleDescription = () => access(props.wedgeRoleDescription) ?? WHEEL_DEFAULTS.wedgeRoleDescription;

    const getSelectedIndex = createMemo(() =>
        rotation.getPhase() === "idling" ? undefined : rotation.getCurrentIndex(),
    );

    const getLayout = createMemo(() =>
        props.computeLayout?.({ itemCount: getWedgeCount(), path: ROOT_PATH, parentExtent: NO_PARENT_EXTENT }),
    );

    const getMarkerCorrection = createMemo(() => {
        const sector = getLayout()?.placements[FIRST_WEDGE]?.sector;

        if (!sector) return NO_CORRECTION;

        return (
            (access(props.markerDegrees) ?? WHEEL_DEFAULTS.markerDegrees) - (sector.fromAngle + sector.toAngle) * HALF
        );
    });

    const getWedgeAngle = (index: number) =>
        getMarkerCorrection() + index * rotation.getStepAngle() + rotation.getAngle();

    const [getWheelRef, setWheelRef] = createSignal<HTMLElement>();

    const getComputeEffect = () => props.computeEffect;

    const pointer = PointerTrackerUtils.create(getWheelRef, () => getComputeEffect() === undefined);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion(() => getComputeEffect() === undefined);

    const getArrangement = createMemo(() => {
        const layout = getLayout();

        return getComputeEffect() === undefined || !layout ? undefined : ProximityUtils.toArrangement(layout);
    });

    const getPointerPoint = createMemo(() => {
        const layout = getLayout();

        if (getComputeEffect() === undefined || !pointer.getIsPointerPresent() || !layout) return undefined;

        const point = PlacementUtils.toLayoutPoint(pointer.getReading().boxRatio, SQUARE_HEIGHT_RATIO);

        return PlacementUtils.getIsWithinReach(layout, point) ? point : undefined;
    });

    const getOverreach = createMemo(() => {
        const layout = getLayout();
        const point = getPointerPoint();

        return layout === undefined || point === undefined
            ? NO_OVERREACH
            : PlacementUtils.getRunOverreach(layout, point);
    });

    const getWedgeEffect = (index: number) => {
        const computeEffect = getComputeEffect();
        const layout = getLayout();
        const arrangement = getArrangement();
        const resting = layout?.placements[FIRST_WEDGE];

        if (!computeEffect || !layout || !arrangement || !resting) return undefined;

        const origin = PlacementUtils.getOrigin(layout);
        const angle = getWedgeAngle(index);
        const center = toTurnedPoint(PlacementUtils.getCenter(resting), origin, angle);
        const placement: PlacementRect = { ...resting, left: center.x, top: center.y, angle };
        const frame: PlacementRect = {
            left: origin.x,
            top: origin.y,
            width: SQUARE_HEIGHT_RATIO,
            height: SQUARE_HEIGHT_RATIO,
            angle,
        };

        const point = getPointerPoint();
        const defs =
            point === undefined
                ? ProximityUtils.toRestingEffectDefs(placement, arrangement, getPrefersReducedMotion(), frame)
                : ProximityUtils.toEffectDefs(
                      placement,
                      point,
                      arrangement,
                      getPrefersReducedMotion(),
                      frame,
                      getOverreach(),
                  );

        return CSSUtils.toAnimationStyle(computeEffect(defs));
    };

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
        getIsUserSpinning: () =>
            rotation.getIsAwaitingTarget() || rotation.getPhase() === "spinning" || rotation.getPhase() === "settling",
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
                                    transform: `rotate(${getWedgeAngle(index)}deg)${getEffect()?.transform ? ` ${getEffect()!.transform}` : ""}`,
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
