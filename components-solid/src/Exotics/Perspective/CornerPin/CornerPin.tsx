import type { ParentProps } from "solid-js";
import { For, Show, createMemo, createRenderEffect, createSignal, onCleanup } from "solid-js";

import {
    CORNER_PIN_DEFAULTS,
    type CornerPinGripRenderProps,
    InteractionTrackerUtils,
    type QuadWarpAxis,
    QuadWarpUtils,
    CornerPinStyles as styles,
} from "@thewaver/ss-components";
import { type Point2d, type QuadCorner, QuadUtils } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { CornerPinProps } from "./CornerPinSolid.types";

const DRAG_THRESHOLD_PX = 4;
const PERCENT = 100;
const WHOLE = 1;
const PRIMARY_BUTTON = 0;

const toClientPoint = (e: PointerEvent): Point2d => ({ x: e.clientX, y: e.clientY });

export const CornerPin = (props: ParentProps<CornerPinProps>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const cornersSignal = accessSignal(() => props.corners);

    const [getPicked, setPicked] = createSignal<QuadCorner>();
    const [getDragged, setDragged] = createSignal<QuadCorner>();
    const [getFocusVisible, setFocusVisible] = createSignal<{ corner: QuadCorner; axis: QuadWarpAxis }>();

    const axisRefs: Partial<Record<QuadCorner, HTMLInputElement>> = {};

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getReachRatio = () => access(props.reachRatio) ?? CORNER_PIN_DEFAULTS.reachRatio;

    const getTransform = createMemo(
        () => QuadUtils.toCss(getSize(), QuadUtils.scale(cornersSignal[0](), getSize())) ?? "none",
    );

    const moveCorner = (corner: QuadCorner, target: Point2d) => {
        const corners = cornersSignal[0]();
        const next = { ...corners, [corner]: QuadWarpUtils.clampMove(corners, corner, target, getReachRatio()) };

        cornersSignal[1](() => next);
    };

    const toBoxRatio = (e: PointerEvent) => {
        const root = getRootRef();

        return root ? QuadWarpUtils.toBoxRatio(toClientPoint(e), root.getBoundingClientRect()) : undefined;
    };

    let stopGesture: (() => void) | undefined;

    onCleanup(() => stopGesture?.());

    const handleGripPointerDown = (corner: QuadCorner, e: PointerEvent) => {
        if (e.button !== PRIMARY_BUTTON) return;

        e.preventDefault();
        axisRefs[corner]?.focus({ preventScroll: true });
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
                setPicked(undefined);
                setDragged(corner);
            }

            const target = toBoxRatio(move);

            if (target) moveCorner(corner, target);
        };

        const handleUp = (up: PointerEvent) => {
            if (up.pointerId !== e.pointerId) return;

            stopGesture?.();

            if (!isDragging) setPicked((picked) => (picked === corner ? undefined : corner));
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
            setDragged(undefined);
            stopGesture = undefined;
        };
    };

    const handleCatcherPointerDown = (corner: QuadCorner, e: PointerEvent) => {
        if (e.button !== PRIMARY_BUTTON) return;

        e.preventDefault();

        const target = toBoxRatio(e);

        if (target) moveCorner(corner, target);

        setPicked(undefined);
    };

    const readFocusVisible = (element: HTMLElement, corner: QuadCorner, axis: QuadWarpAxis) =>
        InteractionTrackerUtils.computeIsFocusVisible(element) ? { corner, axis } : undefined;

    return (
        <div
            ref={setRootRef}
            class={styles.cornerPinRoot}
            role="group"
            aria-roledescription={access(props.roleDescription) ?? CORNER_PIN_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
            onKeyDown={(e) => {
                if (e.key !== "Escape" || getPicked() === undefined) return;

                e.preventDefault();
                setPicked(undefined);
            }}
        >
            <div class={styles.cornerPinSurface} style={{ transform: getTransform() }}>
                {props.children}
            </div>

            <Show when={getPicked()}>
                {(getCorner) => (
                    <div
                        class={styles.cornerPinCatcher}
                        style={{ inset: `${-getReachRatio() * PERCENT}%` }}
                        onPointerDown={(e) => handleCatcherPointerDown(getCorner(), e)}
                    />
                )}
            </Show>

            <For each={QuadUtils.CORNERS}>
                {(corner) => {
                    const getPoint = () => cornersSignal[0]()[corner];

                    const getRenderProps = (): CornerPinGripRenderProps => ({
                        corner,
                        point: getPoint(),
                        isPicked: getPicked() === corner,
                        isDragging: getDragged() === corner,
                        focusVisibleAxis: getFocusVisible()?.corner === corner ? getFocusVisible()?.axis : undefined,
                    });

                    return (
                        <div
                            class={styles.cornerPinGrip}
                            style={{ left: `${getPoint().x * PERCENT}%`, top: `${getPoint().y * PERCENT}%` }}
                            onPointerDown={(e) => handleGripPointerDown(corner, e)}
                        >
                            {props.renderGrip(getRenderProps)}

                            <For each={QuadWarpUtils.AXES}>
                                {(axis) => {
                                    const [getElement, setElement] = createSignal<HTMLInputElement>();

                                    const syncAxis = () => {
                                        const element = getElement();
                                        const reachRatio = getReachRatio();
                                        const step = access(props.step) ?? CORNER_PIN_DEFAULTS.step;
                                        const value = getPoint()[axis];

                                        if (!element) return;

                                        element.min = String(-reachRatio);
                                        element.max = String(WHOLE + reachRatio);
                                        element.step = String(step);
                                        element.value = String(value);
                                    };

                                    createRenderEffect(syncAxis);

                                    return (
                                        <input
                                            ref={(input) => {
                                                setElement(input);

                                                if (axis === QuadWarpUtils.AXES[0]) axisRefs[corner] = input;
                                            }}
                                            type="range"
                                            class={styles.cornerPinAxis}
                                            aria-label={access(props.gripLabels)[corner][axis]}
                                            aria-valuetext={QuadWarpUtils.computeValueText(getPoint(), axis)}
                                            onInput={(e) => {
                                                moveCorner(corner, {
                                                    ...getPoint(),
                                                    [axis]: Number(e.currentTarget.value),
                                                });
                                                syncAxis();
                                            }}
                                            onFocus={(e) =>
                                                setFocusVisible(
                                                    getDragged()
                                                        ? undefined
                                                        : readFocusVisible(e.currentTarget, corner, axis),
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                setFocusVisible(readFocusVisible(e.currentTarget, corner, axis))
                                            }
                                            onBlur={() => setFocusVisible(undefined)}
                                        />
                                    );
                                }}
                            </For>
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
