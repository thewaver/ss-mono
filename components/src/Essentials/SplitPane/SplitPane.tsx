import { Index, Show, createMemo, createSignal, createUniqueId } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { access, accessSignal } from "../../Utils/propUtils";
import { SPLIT_PANE_DEFAULTS } from "./SplitPane.const";
import type { SplitPaneProps } from "./SplitPane.types";

import * as styles from "./SplitPane.css";

const NO_GUTTER_DRAGGING = -1;
const PERCENT = 100;
const SMALLEST_BOUNDARY = 0;
const LARGEST_BOUNDARY = 1;

export const SplitPane = (props: SplitPaneProps) => {
    const ratiosSignal = accessSignal(() => props.ratiosSignal);

    const paneIdPrefix = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getDraggingIndex, setDraggingIndex] = createSignal(NO_GUTTER_DRAGGING);
    const [getCollapsedBoundaries, setCollapsedBoundaries] = createSignal<Record<number, number>>({});

    const getPaneId = (index: number) => access(props.panes)[index]?.id ?? `${paneIdPrefix}-pane-${index}`;

    const getOrientation = createMemo(() => access(props.orientation) ?? SPLIT_PANE_DEFAULTS.orientation);

    const getIsHorizontal = createMemo(() => getOrientation() === "horizontal");

    const getGutterSize = createMemo(() => access(props.gutterSize) ?? SPLIT_PANE_DEFAULTS.gutterSize);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getTotalGutterSize = createMemo(() => getGutterSize() * Math.max(access(props.panes).length - 1, 0));

    const getRatios = createMemo(() => {
        const panes = access(props.panes);
        const stored = ratiosSignal[0]();

        return panes.map((_, index) => stored[index] ?? 1 / panes.length);
    });

    const computeTrack = (index: number) => {
        const pane = access(props.panes)[index];
        const size = `calc(${getRatios()[index]} * (100% - ${getTotalGutterSize()}px))`;

        if (pane.minPx === undefined && pane.maxPx === undefined) return size;

        return `clamp(${pane.minPx ?? 0}px, ${size}, ${pane.maxPx === undefined ? "100%" : `${pane.maxPx}px`})`;
    };

    const getTemplate = createMemo(() =>
        access(props.panes)
            .map((_, index) => computeTrack(index))
            .join(` ${getGutterSize()}px `),
    );

    const getBoundary = (index: number) =>
        getRatios()
            .slice(0, index + 1)
            .reduce((total, ratio) => total + ratio, 0);

    const getRootSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getDirection = NavigatorUtils.createDirectionSignal(getRootRef);

    const getAvailablePx = () => {
        const size = getRootSize();

        return (getIsHorizontal() ? size.width : size.height) - getTotalGutterSize();
    };

    const computeRatioBounds = (index: number, available: number) => {
        const pane = access(props.panes)[index];

        if (available <= 0) return { min: 0, max: 1 };

        return {
            min: (pane.minPx ?? 0) / available,
            max: pane.maxPx === undefined ? 1 : pane.maxPx / available,
        };
    };

    const forgetCollapsed = (index: number) => {
        setCollapsedBoundaries(({ [index]: _unused, ...rest }) => rest);
    };

    const computeBoundaryLimits = (index: number) => {
        const ratios = getRatios();
        const before = getBoundary(index) - ratios[index];
        const span = ratios[index] + ratios[index + 1];
        const available = getAvailablePx();
        const start = computeRatioBounds(index, available);
        const end = computeRatioBounds(index + 1, available);
        const floor = Math.max(before, before + start.min, before + span - end.max);
        const ceiling = Math.min(before + span, before + start.max, before + span - end.min);

        return { before, span, floor, ceiling: Math.max(ceiling, floor) };
    };

    const moveBoundary = (index: number, boundary: number) => {
        forgetCollapsed(index);

        const ratios = [...getRatios()];
        const { before, span, floor, ceiling } = computeBoundaryLimits(index);
        const next = MathUtils.clamp(boundary, floor, ceiling);

        ratios[index] = next - before;
        ratios[index + 1] = before + span - next;

        ratiosSignal[1](() => ratios);
    };

    const computePointerOffset = (e: PointerEvent, rect: DOMRect) => {
        if (!getIsHorizontal()) return e.clientY - rect.top;

        return getDirection() === "rtl" ? rect.right - e.clientX : e.clientX - rect.left;
    };

    const computePointerBoundary = (e: PointerEvent, index: number) => {
        const root = getRootRef();

        if (!root) return undefined;

        const rect = root.getBoundingClientRect();
        const isHorizontal = getIsHorizontal();
        const total = isHorizontal ? rect.width : rect.height;
        const available = total - getTotalGutterSize();

        if (available <= 0) return undefined;

        const offset = computePointerOffset(e, rect);

        return (offset - getGutterSize() * (index + 0.5)) / available;
    };

    let hasDragged = false;

    const handleGutterPointerDown = (e: PointerEvent, index: number) => {
        if (e.button !== 0 || getIsDisabled()) return;

        e.preventDefault();

        hasDragged = false;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setDraggingIndex(index);
    };

    const handleGutterPointerMove = (e: PointerEvent, index: number) => {
        if (getDraggingIndex() !== index) return;

        const boundary = computePointerBoundary(e, index);

        if (boundary === undefined) return;

        hasDragged = true;

        moveBoundary(index, boundary);
    };

    const handleGutterPointerUp = (e: PointerEvent, index: number) => {
        if (getDraggingIndex() !== index) return;

        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        setDraggingIndex(NO_GUTTER_DRAGGING);

        if (hasDragged) return;

        const element = e.currentTarget as HTMLElement;
        const rect = element.getBoundingClientRect();
        const isHorizontal = getIsHorizontal();
        const offset = computePointerOffset(e, rect);
        const extent = isHorizontal ? rect.width : rect.height;
        const step = access(props.keyStep) ?? SPLIT_PANE_DEFAULTS.keyStep;

        moveBoundary(index, getBoundary(index) + (offset < extent * 0.5 ? -step : step));
    };

    const toggleCollapsed = (index: number) => {
        const collapsed = getCollapsedBoundaries()[index];

        if (collapsed !== undefined) {
            moveBoundary(index, collapsed);

            return;
        }

        const previous = getBoundary(index);

        moveBoundary(index, SMALLEST_BOUNDARY);
        setCollapsedBoundaries((prev) => ({ ...prev, [index]: previous }));
    };

    const handleGutterKeyDown = (e: KeyboardEvent, index: number) => {
        if (getIsDisabled()) return;

        const isHorizontal = getIsHorizontal();
        const decreaseKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
        const increaseKey = isHorizontal ? "ArrowRight" : "ArrowDown";
        const key = NavigatorUtils.computeLogicalKey(e.key, getDirection());

        if (e.key === "Enter") {
            e.preventDefault();
            toggleCollapsed(index);

            return;
        }

        if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            moveBoundary(index, e.key === "Home" ? SMALLEST_BOUNDARY : LARGEST_BOUNDARY);

            return;
        }

        if (key !== decreaseKey && key !== increaseKey) return;

        e.preventDefault();

        const step = access(props.keyStep) ?? SPLIT_PANE_DEFAULTS.keyStep;

        moveBoundary(index, getBoundary(index) + (key === decreaseKey ? -step : step));
    };

    return (
        <div
            ref={setRootRef}
            class={styles.splitPaneRoot}
            style={{
                [getIsHorizontal() ? "grid-template-columns" : "grid-template-rows"]: getTemplate(),
            }}
            role="group"
            aria-label={access(props.ariaLabel)}
        >
            <Index each={access(props.panes)}>
                {(getPane, index) => (
                    <>
                        <Show when={index > 0}>
                            <button
                                type="button"
                                class={styles.splitPaneGutter}
                                role="separator"
                                tabindex={getIsDisabled() ? -1 : 0}
                                aria-orientation={getIsHorizontal() ? "vertical" : "horizontal"}
                                aria-controls={getPaneId(index - 1)}
                                aria-label={getPane().gutterAriaLabel}
                                aria-disabled={getIsDisabled() || undefined}
                                aria-valuenow={Math.round(getBoundary(index - 1) * PERCENT)}
                                aria-valuemin={Math.round(computeBoundaryLimits(index - 1).floor * PERCENT)}
                                aria-valuemax={Math.round(computeBoundaryLimits(index - 1).ceiling * PERCENT)}
                                onPointerDown={(e) => handleGutterPointerDown(e, index - 1)}
                                onPointerMove={(e) => handleGutterPointerMove(e, index - 1)}
                                onPointerUp={(e) => handleGutterPointerUp(e, index - 1)}
                                onPointerCancel={(e) => handleGutterPointerUp(e, index - 1)}
                                onKeyDown={(e) => handleGutterKeyDown(e, index - 1)}
                            >
                                {props.renderGutter(() => ({
                                    isDragging: getDraggingIndex() === index - 1,
                                    isDisabled: getIsDisabled(),
                                }))}
                            </button>
                        </Show>

                        <div id={getPaneId(index)} class={styles.splitPanePane}>
                            {props.renderPane(getPane, index)}
                        </div>
                    </>
                )}
            </Index>
        </div>
    );
};
