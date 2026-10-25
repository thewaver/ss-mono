<script lang="ts">
    import {
        CORNER_PIN_DEFAULTS,
        type CornerPinGripRenderProps,
        InteractionTrackerUtils,
        type QuadWarpAxis,
        QuadWarpUtils,
        CornerPinStyles as styles,
    } from "@thewaver/ss-components";
    import { type Point2d, type QuadCorner, QuadUtils } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import type { CornerPinProps } from "./CornerPin.types.js";

    const DRAG_THRESHOLD_PX = 4;
    const PERCENT = 100;
    const WHOLE = 1;
    const PRIMARY_BUTTON = 0;

    const toClientPoint = (e: PointerEvent): Point2d => ({ x: e.clientX, y: e.clientY });

    let { corners = $bindable(), ...props }: CornerPinProps = $props();

    let root = $state<HTMLDivElement>();

    let picked = $state<QuadCorner>();
    let dragged = $state<QuadCorner>();
    let focusVisible = $state<{ corner: QuadCorner; axis: QuadWarpAxis }>();

    const axisRefs: Partial<Record<QuadCorner, HTMLInputElement>> = {};

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);

    const reachRatio = $derived(props.reachRatio ?? CORNER_PIN_DEFAULTS.reachRatio);

    const transform = $derived(
        QuadUtils.toCss(getSize(), QuadUtils.scale(corners, getSize())) ?? "none",
    );

    const moveCorner = (corner: QuadCorner, target: Point2d) => {
        corners = { ...corners, [corner]: QuadWarpUtils.clampMove(corners, corner, target, reachRatio) };
    };

    const toBoxRatio = (e: PointerEvent) =>
        root ? QuadWarpUtils.toBoxRatio(toClientPoint(e), root.getBoundingClientRect()) : undefined;

    let stopGesture: (() => void) | undefined;

    $effect(() => () => stopGesture?.());

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
                picked = undefined;
                dragged = corner;
            }

            const target = toBoxRatio(move);

            if (target) moveCorner(corner, target);
        };

        const handleUp = (up: PointerEvent) => {
            if (up.pointerId !== e.pointerId) return;

            stopGesture?.();

            if (!isDragging) picked = picked === corner ? undefined : corner;
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
            dragged = undefined;
            stopGesture = undefined;
        };
    };

    const handleCatcherPointerDown = (corner: QuadCorner, e: PointerEvent) => {
        if (e.button !== PRIMARY_BUTTON) return;

        e.preventDefault();

        const target = toBoxRatio(e);

        if (target) moveCorner(corner, target);

        picked = undefined;
    };

    const readFocusVisible = (element: HTMLElement, corner: QuadCorner, axis: QuadWarpAxis) =>
        InteractionTrackerUtils.computeIsFocusVisible(element) ? { corner, axis } : undefined;

    const syncAxis = (element: HTMLInputElement, corner: QuadCorner, axis: QuadWarpAxis) => {
        element.min = String(-reachRatio);
        element.max = String(WHOLE + reachRatio);
        element.step = String(props.step ?? CORNER_PIN_DEFAULTS.step);
        element.value = String(corners[corner][axis]);
    };

    const attachAxis = (corner: QuadCorner, axis: QuadWarpAxis) => (element: HTMLInputElement) => {
        const isFirst = axis === QuadWarpUtils.AXES[0];

        if (isFirst) axisRefs[corner] = element;

        syncAxis(element, corner, axis);

        return () => {
            if (isFirst) axisRefs[corner] = undefined;
        };
    };

    const toRenderProps = (corner: QuadCorner): CornerPinGripRenderProps => ({
        corner,
        point: corners[corner],
        isPicked: picked === corner,
        isDragging: dragged === corner,
        focusVisibleAxis: focusVisible?.corner === corner ? focusVisible.axis : undefined,
    });
</script>

<div
    bind:this={root}
    class={styles.cornerPinRoot}
    role="group"
    aria-roledescription={props.roleDescription ?? CORNER_PIN_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
    onkeydown={(e) => {
        if (e.key !== "Escape" || picked === undefined) return;

        e.preventDefault();
        picked = undefined;
    }}
>
    <div class={styles.cornerPinSurface} style:transform>
        {@render props.children?.()}
    </div>

    {#if picked}
        {@const pickedCorner = picked}

        <div
            class={styles.cornerPinCatcher}
            style:inset={`${-reachRatio * PERCENT}%`}
            onpointerdown={(e) => handleCatcherPointerDown(pickedCorner, e)}
        ></div>
    {/if}

    {#each QuadUtils.CORNERS as corner (corner)}
        <div
            class={styles.cornerPinGrip}
            style:left={`${corners[corner].x * PERCENT}%`}
            style:top={`${corners[corner].y * PERCENT}%`}
            onpointerdown={(e) => handleGripPointerDown(corner, e)}
        >
            {@render props.renderGrip(toRenderProps(corner))}

            {#each QuadWarpUtils.AXES as axis (axis)}
                <input
                    {@attach attachAxis(corner, axis)}
                    type="range"
                    class={styles.cornerPinAxis}
                    aria-label={props.gripLabels[corner][axis]}
                    aria-valuetext={QuadWarpUtils.computeValueText(corners[corner], axis)}
                    oninput={(e) => {
                        const element = e.currentTarget;

                        moveCorner(corner, { ...corners[corner], [axis]: Number(element.value) });
                        syncAxis(element, corner, axis);
                    }}
                    onfocus={(e) => {
                        focusVisible = dragged ? undefined : readFocusVisible(e.currentTarget, corner, axis);
                    }}
                    onkeydown={(e) => {
                        focusVisible = readFocusVisible(e.currentTarget, corner, axis);
                    }}
                    onblur={() => {
                        focusVisible = undefined;
                    }}
                />
            {/each}
        </div>
    {/each}
</div>
