import { Fragment, type KeyboardEvent, type PointerEvent, useId, useMemo, useRef, useState } from "react";

import type { SplitPaneCollapsedBoundaries } from "@thewaver/ss-components";
import { SPLIT_PANE_DEFAULTS, SplitPaneStyles, SplitPaneUtils } from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { NavigatorReactUtils } from "../../Abstracts/Navigator/NavigatorReact.utils";
import type { SplitPaneProps } from "./SplitPane.types";

const NO_GUTTER_DRAGGING = -1;
const PERCENT = 100;

export const SplitPane = (props: SplitPaneProps) => {
    const [storedRatios, setRatios] = props.ratiosState;

    const paneIdPrefix = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const hasDraggedRef = useRef(false);

    const [draggingIndex, setDraggingIndex] = useState(NO_GUTTER_DRAGGING);
    const [collapsedBoundaries, setCollapsedBoundaries] = useState<SplitPaneCollapsedBoundaries>({});

    const orientation = props.orientation ?? SPLIT_PANE_DEFAULTS.orientation;
    const isHorizontal = orientation === "horizontal";
    const gutterSize = props.gutterSize ?? SPLIT_PANE_DEFAULTS.gutterSize;
    const keyStep = props.keyStep ?? SPLIT_PANE_DEFAULTS.keyStep;
    const isDisabled = props.isDisabled ?? false;
    const paneCount = props.panes.length;

    const ratios = useMemo(() => SplitPaneUtils.computeRatios(paneCount, storedRatios), [paneCount, storedRatios]);

    const rootSize = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const direction = NavigatorReactUtils.useDirection(rootRef);

    const totalGutterSize = SplitPaneUtils.computeTotalGutterSize(gutterSize, paneCount);
    const availablePx = (isHorizontal ? rootSize.width : rootSize.height) - totalGutterSize;

    const [prunedRatios, setPrunedRatios] = useState(ratios);

    if (prunedRatios !== ratios) {
        setPrunedRatios(ratios);
        setCollapsedBoundaries((prev) => SplitPaneUtils.pruneCollapsed(prev, ratios));
    }

    const getPaneId = (index: number) => props.panes[index]?.id ?? `${paneIdPrefix}-pane-${index}`;

    const getBoundary = (index: number) => SplitPaneUtils.computeBoundary(ratios, index);

    const computeBoundaryLimits = (index: number) =>
        SplitPaneUtils.computeBoundaryLimits({ ratios, index, panes: props.panes, availablePx });

    const moveBoundary = (index: number, boundary: number) => {
        setCollapsedBoundaries((prev) => SplitPaneUtils.forgetCollapsed(prev, index));

        const next = SplitPaneUtils.computeMovedRatios({ ratios, index, boundary, panes: props.panes, availablePx });

        setRatios(next);

        return next;
    };

    const toggleCollapsed = (index: number) => {
        const collapsed = collapsedBoundaries[index];

        if (collapsed !== undefined) {
            moveBoundary(index, collapsed.restore);

            return;
        }

        const restore = getBoundary(index);
        const next = moveBoundary(index, SplitPaneUtils.SMALLEST_BOUNDARY);
        const collapsedAt = SplitPaneUtils.computeBoundary(next, index);

        setCollapsedBoundaries((prev) => ({ ...prev, [index]: { restore, collapsedAt } }));
    };

    const handleGutterPointerDown = (e: PointerEvent<HTMLButtonElement>, index: number) => {
        if (e.button !== 0 || isDisabled) return;

        e.preventDefault();

        hasDraggedRef.current = false;

        e.currentTarget.setPointerCapture(e.pointerId);
        setDraggingIndex(index);
    };

    const handleGutterPointerMove = (e: PointerEvent<HTMLButtonElement>, index: number) => {
        const root = rootRef.current;

        if (draggingIndex !== index || !root) return;

        const boundary = SplitPaneUtils.computePointerBoundary({
            point: e,
            rootRect: root.getBoundingClientRect(),
            index,
            orientation,
            direction,
            gutterSize,
            paneCount,
        });

        if (boundary === undefined) return;

        hasDraggedRef.current = true;

        moveBoundary(index, boundary);
    };

    const handleGutterPointerUp = (e: PointerEvent<HTMLButtonElement>, index: number) => {
        if (draggingIndex !== index) return;

        e.currentTarget.releasePointerCapture(e.pointerId);
        setDraggingIndex(NO_GUTTER_DRAGGING);

        if (hasDraggedRef.current) return;

        moveBoundary(
            index,
            SplitPaneUtils.computePressBoundary({
                point: e,
                gutterRect: e.currentTarget.getBoundingClientRect(),
                orientation,
                direction,
                boundary: getBoundary(index),
                step: keyStep,
            }),
        );
    };

    const handleGutterPointerCancel = (index: number) => {
        if (draggingIndex !== index) return;

        setDraggingIndex(NO_GUTTER_DRAGGING);
    };

    const handleGutterKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (isDisabled) return;

        const action = SplitPaneUtils.computeKeyAction(e.key, orientation, direction);

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

        moveBoundary(index, getBoundary(index) + (action === "decrease" ? -keyStep : keyStep));
    };

    const template = SplitPaneUtils.computeTemplate(props.panes, ratios, gutterSize);

    return (
        <div
            ref={rootRef}
            className={SplitPaneStyles.splitPaneRoot}
            style={isHorizontal ? { gridTemplateColumns: template } : { gridTemplateRows: template }}
            role="group"
            aria-label={props.ariaLabel}
        >
            {props.panes.map((pane, index) => {
                const limits = index > 0 ? computeBoundaryLimits(index - 1) : undefined;

                return (
                    <Fragment key={index}>
                        {limits && (
                            <button
                                type="button"
                                className={SplitPaneStyles.splitPaneGutter}
                                role="separator"
                                tabIndex={isDisabled ? -1 : 0}
                                aria-orientation={isHorizontal ? "vertical" : "horizontal"}
                                aria-controls={getPaneId(index - 1)}
                                aria-label={props.panes[index - 1].gutterAriaLabel}
                                aria-disabled={isDisabled || undefined}
                                aria-valuenow={Math.round(getBoundary(index - 1) * PERCENT)}
                                aria-valuemin={Math.round(limits.floor * PERCENT)}
                                aria-valuemax={Math.round(limits.ceiling * PERCENT)}
                                onPointerDown={(e) => handleGutterPointerDown(e, index - 1)}
                                onPointerMove={(e) => handleGutterPointerMove(e, index - 1)}
                                onPointerUp={(e) => handleGutterPointerUp(e, index - 1)}
                                onPointerCancel={() => handleGutterPointerCancel(index - 1)}
                                onKeyDown={(e) => handleGutterKeyDown(e, index - 1)}
                            >
                                {props.renderGutter({ isDragging: draggingIndex === index - 1, isDisabled })}
                            </button>
                        )}

                        <div id={getPaneId(index)} className={SplitPaneStyles.splitPanePane}>
                            {props.renderPane(pane, index)}
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
};
