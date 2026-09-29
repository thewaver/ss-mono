import { Index, Show, createComputed, createMemo, createSignal, createUniqueId, on } from "solid-js";

import {
    SPLIT_PANE_DEFAULTS,
    type SplitPaneCollapsedBoundaries,
    SplitPaneUtils,
    SplitPaneStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { access, accessSignal } from "../../Utils/propUtils";
import type { SplitPaneProps } from "./SplitPaneSolid.types";

const NO_GUTTER_DRAGGING = -1;
const PERCENT = 100;

export const SplitPane = (props: SplitPaneProps) => {
    const ratiosSignal = accessSignal(() => props.ratios);

    const paneIdPrefix = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getDraggingIndex, setDraggingIndex] = createSignal(NO_GUTTER_DRAGGING);
    const [getCollapsedBoundaries, setCollapsedBoundaries] = createSignal<SplitPaneCollapsedBoundaries>({});

    const getPaneId = (index: number) => access(props.panes)[index]?.id ?? `${paneIdPrefix}-pane-${index}`;

    const getOrientation = createMemo(() => access(props.orientation) ?? SPLIT_PANE_DEFAULTS.orientation);

    const getIsHorizontal = createMemo(() => getOrientation() === "horizontal");

    const getGutterSize = createMemo(() => access(props.gutterSize) ?? SPLIT_PANE_DEFAULTS.gutterSize);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getTotalGutterSize = createMemo(() =>
        SplitPaneUtils.computeTotalGutterSize(getGutterSize(), access(props.panes).length),
    );

    const getRatios = createMemo(() => SplitPaneUtils.computeRatios(access(props.panes).length, ratiosSignal[0]()));

    const getTemplate = createMemo(() =>
        SplitPaneUtils.computeTemplate(access(props.panes), getRatios(), getGutterSize()),
    );

    const getBoundary = (index: number) => SplitPaneUtils.computeBoundary(getRatios(), index);

    const getRootSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getAvailablePx = () => {
        const size = getRootSize();

        return (getIsHorizontal() ? size.width : size.height) - getTotalGutterSize();
    };

    const forgetCollapsed = (index: number) => {
        setCollapsedBoundaries((prev) => SplitPaneUtils.forgetCollapsed(prev, index));
    };

    createComputed(
        on(getRatios, (ratios) => setCollapsedBoundaries((prev) => SplitPaneUtils.pruneCollapsed(prev, ratios)), {
            defer: true,
        }),
    );

    const computeBoundaryLimits = (index: number) =>
        SplitPaneUtils.computeBoundaryLimits({
            ratios: getRatios(),
            index,
            panes: access(props.panes),
            availablePx: getAvailablePx(),
        });

    const moveBoundary = (index: number, boundary: number) => {
        forgetCollapsed(index);

        const ratios = SplitPaneUtils.computeMovedRatios({
            ratios: getRatios(),
            index,
            boundary,
            panes: access(props.panes),
            availablePx: getAvailablePx(),
        });

        ratiosSignal[1](() => ratios);
    };

    const computePointerBoundary = (e: PointerEvent, index: number) => {
        const root = getRootRef();

        if (!root) return undefined;

        return SplitPaneUtils.computePointerBoundary({
            point: e,
            rootRect: root.getBoundingClientRect(),
            index,
            orientation: getOrientation(),
            direction: getDirection(),
            gutterSize: getGutterSize(),
            paneCount: access(props.panes).length,
        });
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

        moveBoundary(
            index,
            SplitPaneUtils.computePressBoundary({
                point: e,
                gutterRect: (e.currentTarget as HTMLElement).getBoundingClientRect(),
                orientation: getOrientation(),
                direction: getDirection(),
                boundary: getBoundary(index),
                step: access(props.keyStep) ?? SPLIT_PANE_DEFAULTS.keyStep,
            }),
        );
    };

    const handleGutterPointerCancel = (index: number) => {
        if (getDraggingIndex() !== index) return;

        setDraggingIndex(NO_GUTTER_DRAGGING);
    };

    const toggleCollapsed = (index: number) => {
        const collapsed = getCollapsedBoundaries()[index];

        if (collapsed !== undefined) {
            moveBoundary(index, collapsed.restore);

            return;
        }

        const restore = getBoundary(index);

        moveBoundary(index, SplitPaneUtils.SMALLEST_BOUNDARY);
        setCollapsedBoundaries((prev) => ({ ...prev, [index]: { restore, collapsedAt: getBoundary(index) } }));
    };

    const handleGutterKeyDown = (e: KeyboardEvent, index: number) => {
        if (getIsDisabled()) return;

        const action = SplitPaneUtils.computeKeyAction(e.key, getOrientation(), getDirection());

        if (!action) return;

        e.preventDefault();

        if (action === "toggle") {
            toggleCollapsed(index);

            return;
        }

        if (action === "home" || action === "end") {
            moveBoundary(index, action === "home" ? SplitPaneUtils.SMALLEST_BOUNDARY : SplitPaneUtils.LARGEST_BOUNDARY);

            return;
        }

        const step = access(props.keyStep) ?? SPLIT_PANE_DEFAULTS.keyStep;

        moveBoundary(index, getBoundary(index) + (action === "decrease" ? -step : step));
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
                                aria-label={access(props.panes)[index - 1].gutterAriaLabel}
                                aria-disabled={getIsDisabled() || undefined}
                                aria-valuenow={Math.round(getBoundary(index - 1) * PERCENT)}
                                aria-valuemin={Math.round(computeBoundaryLimits(index - 1).floor * PERCENT)}
                                aria-valuemax={Math.round(computeBoundaryLimits(index - 1).ceiling * PERCENT)}
                                onPointerDown={(e) => handleGutterPointerDown(e, index - 1)}
                                onPointerMove={(e) => handleGutterPointerMove(e, index - 1)}
                                onPointerUp={(e) => handleGutterPointerUp(e, index - 1)}
                                onPointerCancel={() => handleGutterPointerCancel(index - 1)}
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
