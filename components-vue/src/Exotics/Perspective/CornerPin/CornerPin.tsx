import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef } from "vue";

import {
    CORNER_PIN_DEFAULTS,
    type CornerPinGripRenderProps,
    InteractionTrackerUtils,
    type QuadWarpAxis,
    QuadWarpUtils,
    CornerPinStyles as styles,
} from "@thewaver/ss-components";
import { type Point2d, type QuadCorner, QuadUtils } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { CornerPinProps, CornerPinSlots } from "./CornerPin.types";

const DRAG_THRESHOLD_PX = 4;
const PERCENT = 100;
const WHOLE = 1;
const PRIMARY_BUTTON = 0;

const toClientPoint = (e: PointerEvent): Point2d => ({ x: e.clientX, y: e.clientY });

export const CornerPin = defineComponent(
    (props: CornerPinProps, { slots }: SlotsContext<CornerPinSlots>) => {
        const rootRef = shallowRef<HTMLElement>();

        const corners = useTwoWay(props, "corners");

        const picked = shallowRef<QuadCorner>();
        const dragged = shallowRef<QuadCorner>();
        const focusVisible = shallowRef<{ corner: QuadCorner; axis: QuadWarpAxis }>();

        const axisElements: Partial<Record<QuadCorner, Partial<Record<QuadWarpAxis, HTMLInputElement>>>> = {};

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const getReachRatio = () => props.reachRatio ?? CORNER_PIN_DEFAULTS.reachRatio;

        const transform = computed(
            () => QuadUtils.toCss(size.value, QuadUtils.scale(corners.value, size.value)) ?? "none",
        );

        const moveCorner = (corner: QuadCorner, target: Point2d) => {
            const current = corners.value;

            corners.value = { ...current, [corner]: QuadWarpUtils.clampMove(current, corner, target, getReachRatio()) };
        };

        const toBoxRatio = (e: PointerEvent) => {
            const root = rootRef.value;

            return root ? QuadWarpUtils.toBoxRatio(toClientPoint(e), root.getBoundingClientRect()) : undefined;
        };

        let stopGesture: (() => void) | undefined;

        onScopeDispose(() => stopGesture?.());

        const handleGripPointerDown = (corner: QuadCorner, e: PointerEvent) => {
            if (e.button !== PRIMARY_BUTTON) return;

            e.preventDefault();
            axisElements[corner]?.[QuadWarpUtils.AXES[0]]?.focus({ preventScroll: true });
            stopGesture?.();

            const grip = e.currentTarget as HTMLElement;
            const start = toClientPoint(e);
            let isDragging = false;

            const handleMove = (move: PointerEvent) => {
                if (move.pointerId !== e.pointerId) return;

                if (!isDragging) {
                    if (Math.hypot(move.clientX - start.x, move.clientY - start.y) < DRAG_THRESHOLD_PX) return;

                    isDragging = true;
                    grip.setPointerCapture(move.pointerId);
                    picked.value = undefined;
                    dragged.value = corner;
                }

                const target = toBoxRatio(move);

                if (target) moveCorner(corner, target);
            };

            const handleUp = (up: PointerEvent) => {
                if (up.pointerId !== e.pointerId) return;

                stopGesture?.();

                if (!isDragging) picked.value = picked.value === corner ? undefined : corner;
            };

            const handleCancel = (cancel: PointerEvent) => {
                if (cancel.pointerId === e.pointerId) stopGesture?.();
            };

            window.addEventListener("pointermove", handleMove);
            window.addEventListener("pointerup", handleUp);
            window.addEventListener("pointercancel", handleCancel);

            stopGesture = () => {
                window.removeEventListener("pointermove", handleMove);
                window.removeEventListener("pointerup", handleUp);
                window.removeEventListener("pointercancel", handleCancel);
                dragged.value = undefined;
                stopGesture = undefined;
            };
        };

        const handleCatcherPointerDown = (corner: QuadCorner, e: PointerEvent) => {
            if (e.button !== PRIMARY_BUTTON) return;

            e.preventDefault();

            const target = toBoxRatio(e);

            if (target) moveCorner(corner, target);

            picked.value = undefined;
        };

        const readFocusVisible = (element: HTMLElement, corner: QuadCorner, axis: QuadWarpAxis) =>
            InteractionTrackerUtils.computeIsFocusVisible(element) ? { corner, axis } : undefined;

        const setAxisElement = (corner: QuadCorner, axis: QuadWarpAxis, element: HTMLInputElement | undefined) => {
            axisElements[corner] = { ...axisElements[corner], [axis]: element };
        };

        const syncAxis = (element: HTMLInputElement, corner: QuadCorner, axis: QuadWarpAxis) => {
            element.value = String(corners.value[corner][axis]);
        };

        return () => {
            const reachRatio = getReachRatio();
            const pickedCorner = picked.value;

            return (
                <div
                    ref={rootRef}
                    class={styles.cornerPinRoot}
                    role="group"
                    aria-roledescription={props.roleDescription ?? CORNER_PIN_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                    onKeydown={(e) => {
                        if (e.key === "Escape") picked.value = undefined;
                    }}
                >
                    <div class={styles.cornerPinSurface} style={{ transform: transform.value }}>
                        {slots.default?.()}
                    </div>

                    {pickedCorner && (
                        <div
                            class={styles.cornerPinCatcher}
                            style={{ inset: `${-reachRatio * PERCENT}%` }}
                            onPointerdown={(e) => handleCatcherPointerDown(pickedCorner, e)}
                        />
                    )}

                    {QuadUtils.CORNERS.map((corner) => {
                        const point = corners.value[corner];

                        const renderProps: CornerPinGripRenderProps = {
                            corner,
                            point,
                            isPicked: picked.value === corner,
                            isDragging: dragged.value === corner,
                            focusVisibleAxis:
                                focusVisible.value?.corner === corner ? focusVisible.value.axis : undefined,
                        };

                        return (
                            <div
                                key={corner}
                                class={styles.cornerPinGrip}
                                style={{ left: `${point.x * PERCENT}%`, top: `${point.y * PERCENT}%` }}
                                onPointerdown={(e) => handleGripPointerDown(corner, e)}
                            >
                                {callSlot(slots.renderGrip, renderProps)}

                                {QuadWarpUtils.AXES.map((axis) => (
                                    <input
                                        key={axis}
                                        ref={(target) => {
                                            const element = toElement<HTMLInputElement>(target);

                                            setAxisElement(corner, axis, element);

                                            if (element) syncAxis(element, corner, axis);
                                        }}
                                        type="range"
                                        class={styles.cornerPinAxis}
                                        min={-reachRatio}
                                        max={WHOLE + reachRatio}
                                        step={props.step ?? CORNER_PIN_DEFAULTS.step}
                                        aria-label={props.gripLabels[corner][axis]}
                                        aria-valuetext={QuadWarpUtils.computeValueText(point, axis)}
                                        onInput={(e) => {
                                            const element = e.currentTarget as HTMLInputElement;

                                            moveCorner(corner, { ...point, [axis]: Number(element.value) });
                                            syncAxis(element, corner, axis);
                                        }}
                                        onFocus={(e) => {
                                            focusVisible.value = dragged.value
                                                ? undefined
                                                : readFocusVisible(e.currentTarget as HTMLElement, corner, axis);
                                        }}
                                        onKeydown={(e) => {
                                            focusVisible.value = readFocusVisible(
                                                e.currentTarget as HTMLElement,
                                                corner,
                                                axis,
                                            );
                                        }}
                                        onBlur={() => {
                                            focusVisible.value = undefined;
                                        }}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "CornerPin",
        slots: Object as SlotsType<CornerPinSlots>,
        props: declareProps<CornerPinProps>({
            "ariaLabel": null,
            "gripLabels": null,
            "reachRatio": null,
            "step": null,
            "roleDescription": null,
            "corners": null,
            "onUpdate:corners": null,
        }),
    },
);
