import { type PointerEvent as ReactPointerEvent, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    CORNER_PIN_DEFAULTS,
    type CornerKey,
    InteractionTrackerUtils,
    type QuadWarpAxis,
    QuadWarpUtils,
    CornerPinStyles as styles,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import type { CornerPinProps } from "./CornerPin.types";

const DRAG_THRESHOLD_PX = 4;
const PERCENT = 100;
const WHOLE = 1;
const PRIMARY_BUTTON = 0;

const toClientPoint = (e: { clientX: number; clientY: number }): Point2d => ({ x: e.clientX, y: e.clientY });

const toAxisKey = (corner: CornerKey, axis: QuadWarpAxis) => `${corner}-${axis}`;

export const CornerPin = (props: CornerPinProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const axisRefs = useRef<Partial<Record<string, HTMLInputElement>>>({});
    const stopGestureRef = useRef<(() => void) | undefined>(undefined);

    const [corners, setCorners] = props.corners;

    const [picked, setPicked] = useState<CornerKey>();
    const [dragged, setDragged] = useState<CornerKey>();
    const [focusVisible, setFocusVisible] = useState<{ corner: CornerKey; axis: QuadWarpAxis }>();

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);

    const reachRatio = props.reachRatio ?? CORNER_PIN_DEFAULTS.reachRatio;
    const step = props.step ?? CORNER_PIN_DEFAULTS.step;

    const transform = QuadWarpUtils.toTransform(size, QuadWarpUtils.toPixels(corners, size)) ?? "none";

    const latest = useLatest({ corners, setCorners, reachRatio });

    useLayoutEffect(() => {
        for (const corner of QuadWarpUtils.CORNERS) {
            for (const axis of QuadWarpUtils.AXES) {
                const element = axisRefs.current[toAxisKey(corner, axis)];

                if (element) element.value = String(corners[corner][axis]);
            }
        }
    });

    useEffect(() => () => stopGestureRef.current?.(), []);

    const moveCorner = (corner: CornerKey, target: Point2d) => {
        const current = latest.current.corners;
        const next = {
            ...current,
            [corner]: QuadWarpUtils.clampMove(current, corner, target, latest.current.reachRatio),
        };

        latest.current.setCorners(next);

        return next;
    };

    const toBoxRatio = (e: { clientX: number; clientY: number }) => {
        const root = rootRef.current;

        return root ? QuadWarpUtils.toBoxRatio(toClientPoint(e), root.getBoundingClientRect()) : undefined;
    };

    const handleGripPointerDown = (corner: CornerKey, e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.button !== PRIMARY_BUTTON) return;

        e.preventDefault();
        axisRefs.current[toAxisKey(corner, QuadWarpUtils.AXES[0])]?.focus({ preventScroll: true });
        stopGestureRef.current?.();

        const grip = e.currentTarget;
        const pointerId = e.pointerId;
        const start = toClientPoint(e);
        let isDragging = false;

        const handleMove = (move: PointerEvent) => {
            if (move.pointerId !== pointerId) return;

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
            if (up.pointerId !== pointerId) return;

            stopGestureRef.current?.();

            if (!isDragging) setPicked((current) => (current === corner ? undefined : corner));
        };

        const handleCancel = (cancel: PointerEvent) => {
            if (cancel.pointerId === pointerId) stopGestureRef.current?.();
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
        window.addEventListener("pointercancel", handleCancel);

        stopGestureRef.current = () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
            window.removeEventListener("pointercancel", handleCancel);
            setDragged(undefined);
            stopGestureRef.current = undefined;
        };
    };

    const handleCatcherPointerDown = (corner: CornerKey, e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.button !== PRIMARY_BUTTON) return;

        e.preventDefault();

        const target = toBoxRatio(e);

        if (target) moveCorner(corner, target);

        setPicked(undefined);
    };

    const readFocusVisible = (element: HTMLElement, corner: CornerKey, axis: QuadWarpAxis) =>
        InteractionTrackerUtils.computeIsFocusVisible(element) ? { corner, axis } : undefined;

    return (
        <div
            ref={rootRef}
            className={styles.cornerPinRoot}
            role="group"
            aria-roledescription={props.roleDescription ?? CORNER_PIN_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
            onKeyDown={(e) => {
                if (e.key === "Escape") setPicked(undefined);
            }}
        >
            <div className={styles.cornerPinSurface} style={{ transform }}>
                {props.children}
            </div>

            {picked && (
                <div
                    className={styles.cornerPinCatcher}
                    style={{ inset: `${-reachRatio * PERCENT}%` }}
                    onPointerDown={(e) => handleCatcherPointerDown(picked, e)}
                />
            )}

            {QuadWarpUtils.CORNERS.map((corner) => {
                const point = corners[corner];

                return (
                    <div
                        key={corner}
                        className={styles.cornerPinGrip}
                        style={{ left: `${point.x * PERCENT}%`, top: `${point.y * PERCENT}%` }}
                        onPointerDown={(e) => handleGripPointerDown(corner, e)}
                    >
                        {props.renderGrip({
                            corner,
                            point,
                            isPicked: picked === corner,
                            isDragging: dragged === corner,
                            focusVisibleAxis: focusVisible?.corner === corner ? focusVisible.axis : undefined,
                        })}

                        {QuadWarpUtils.AXES.map((axis) => (
                            <input
                                key={axis}
                                ref={(element) => {
                                    axisRefs.current[toAxisKey(corner, axis)] = element ?? undefined;
                                }}
                                type="range"
                                className={styles.cornerPinAxis}
                                min={-reachRatio}
                                max={WHOLE + reachRatio}
                                step={step}
                                aria-label={props.gripLabels[corner][axis]}
                                aria-valuetext={QuadWarpUtils.computeValueText(point, axis)}
                                onInput={(e) => {
                                    const element = e.currentTarget;
                                    const next = moveCorner(corner, { ...point, [axis]: Number(element.value) });

                                    element.value = String(next[corner][axis]);
                                }}
                                onFocus={(e) =>
                                    setFocusVisible(
                                        dragged ? undefined : readFocusVisible(e.currentTarget, corner, axis),
                                    )
                                }
                                onKeyDown={(e) => setFocusVisible(readFocusVisible(e.currentTarget, corner, axis))}
                                onBlur={() => setFocusVisible(undefined)}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
