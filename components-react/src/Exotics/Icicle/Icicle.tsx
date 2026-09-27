import { type KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    ICICLE_DEFAULTS,
    type IcicleNode,
    type IcicleSpan,
    IcicleStyles,
    IcicleUtils,
    NavigatorUtils,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useStore } from "../../Utils/storeUtils";
import type { IcicleProps } from "./Icicle.types";

const NOTHING = 0;
const SETTLED = 1;
const NEXT = 1;
const EMPTY_SPAN: IcicleSpan = { start: 0, end: 0, column: 0 };

type IcicleZoomState<T> = {
    focus: IcicleNode<T>;
    cameFrom: IcicleNode<T> | undefined;
    fromViews: Map<IcicleNode<T>, IcicleSpan>;
    generation: number;
};

export const Icicle = <T,>(props: IcicleProps<T>) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef(new Map<IcicleNode<T>, HTMLElement>());
    const isFocusPendingRef = useRef(false);

    const [zoomClock] = useState(TreemapUtils.createZoomClock);
    const [cursorNode, setCursorNode] = useState<IcicleNode<T>>();

    const progress = useStore(zoomClock);
    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const columnCount = Math.max(SETTLED, props.columnCount ?? ICICLE_DEFAULTS.columnCount);
    const zoomDurationMs = props.zoomDurationMs ?? ICICLE_DEFAULTS.zoomDurationMs;

    const weights = useMemo(() => TreemapUtils.computeWeights(props.root), [props.root]);
    const spans = useMemo(() => IcicleUtils.computeSpans(props.root, weights), [props.root, weights]);
    const parents = useMemo(() => IcicleUtils.computeParents(props.root), [props.root]);
    const allNodes = useMemo(() => IcicleUtils.listNodes(spans, weights), [spans, weights]);
    const nodeKeys = useMemo(() => new Map(allNodes.map((node, index) => [node, index])), [allNodes]);

    const [heldFocus, setHeldFocus] = SignalMirrorReactUtils.useOptionalState(props.focusState, props.root);

    const focus = allNodes.includes(heldFocus) ? heldFocus : props.root;

    const [zoom, setZoom] = useState<IcicleZoomState<T>>(() => ({
        focus,
        cameFrom: undefined,
        fromViews: new Map(),
        generation: NOTHING,
    }));

    const computeShownView = (node: IcicleNode<T>, center: IcicleNode<T>) =>
        IcicleUtils.computeShownSpan(
            spans.get(node) ?? EMPTY_SPAN,
            spans.get(center) ?? EMPTY_SPAN,
            zoom.fromViews.get(node),
            progress,
        );

    if (zoom.focus !== focus) {
        setZoom({
            focus,
            cameFrom: zoom.focus,
            fromViews: new Map(allNodes.map((node) => [node, computeShownView(node, zoom.focus)])),
            generation: zoom.generation + NEXT,
        });
    }

    const focusSpan = spans.get(focus) ?? EMPTY_SPAN;

    const targetViews = useMemo(
        () =>
            new Map(allNodes.map((node) => [node, IcicleUtils.computeView(spans.get(node) ?? EMPTY_SPAN, focusSpan)])),
        [allNodes, spans, focusSpan],
    );

    const isZooming = progress < SETTLED;

    const getIsVisibleAtTarget = (node: IcicleNode<T>) =>
        IcicleUtils.getIsVisible(targetViews.get(node) ?? EMPTY_SPAN, columnCount);

    const getIsVisibleAtStart = (node: IcicleNode<T>) =>
        IcicleUtils.getIsVisible(zoom.fromViews.get(node) ?? EMPTY_SPAN, columnCount);

    const renderedNodes = allNodes.filter(
        (node) => getIsVisibleAtTarget(node) || (isZooming && getIsVisibleAtStart(node)),
    );

    const stops = allNodes.filter(getIsVisibleAtTarget);

    const rovingNode = cursorNode !== undefined && stops.includes(cursorNode) ? cursorNode : focus;

    const zoomTo = (node: IcicleNode<T>) => {
        if (node === focus) return;

        isFocusPendingRef.current = rootRef.current?.contains(document.activeElement) ?? false;

        setHeldFocus(node);
    };

    const activate = (node: IcicleNode<T>) => {
        const target = IcicleUtils.computeActivationTarget(node, focus, parents);

        if (target) zoomTo(target);
    };

    const moveCursor = (node: IcicleNode<T>) => {
        setCursorNode(node);
        cellRefs.current.get(node)?.focus();
    };

    useEffect(() => zoomClock.stop, [zoomClock]);

    useLayoutEffect(() => {
        if (zoom.generation === NOTHING) return;

        zoomClock.start(zoomDurationMs);
    }, [zoom.generation]);

    useLayoutEffect(() => {
        if (!isFocusPendingRef.current) return;

        isFocusPendingRef.current = false;

        moveCursor(zoom.cameFrom !== undefined && stops.includes(zoom.cameFrom) ? zoom.cameFrom : focus);
    }, [zoom.generation]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            const parent = parents.get(focus);

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        if (e.target !== cellRefs.current.get(rovingNode)) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(rovingNode);

            return;
        }

        const step = IcicleUtils.getKeyStep(e.key);

        if (step === undefined) return;

        const next = IcicleUtils.computeStep(
            step,
            rovingNode,
            stops.map((node) => ({ node, span: targetViews.get(node) ?? EMPTY_SPAN })),
            (node) => parents.get(node),
        );

        if (next === undefined || next === rovingNode) return;

        e.preventDefault();
        moveCursor(next);
    };

    return (
        <div ref={rootRef} className={IcicleStyles.icicleRoot} onKeyDown={handleKeyDown}>
            <ul className={IcicleStyles.icicleList} aria-label={props.ariaLabel}>
                {renderedNodes.map((node) => {
                    const isInView = getIsVisibleAtTarget(node);
                    const rect = IcicleUtils.toRect(computeShownView(node, focus), size, columnCount);

                    return (
                        <li
                            key={nodeKeys.get(node)}
                            className={[IcicleStyles.icicleItem, isInView ? undefined : IcicleStyles.icicleLeaving]
                                .filter(Boolean)
                                .join(" ")}
                            style={TreemapUtils.toBox(rect)}
                            aria-hidden={isInView ? undefined : "true"}
                        >
                            <div
                                ref={(element) => {
                                    if (element) cellRefs.current.set(node, element);
                                    else cellRefs.current.delete(node);
                                }}
                                className={IcicleStyles.icicleCell}
                                role="button"
                                tabIndex={isInView ? (node === rovingNode ? 0 : -1) : undefined}
                                onClick={() => {
                                    if (!isInView) return;

                                    setCursorNode(node);
                                    activate(node);
                                }}
                            >
                                {props.renderCell(node, {
                                    rect,
                                    weight: weights.get(node) ?? NOTHING,
                                    isBranch: TreemapUtils.getIsBranch(node, weights),
                                    isFocus: node === focus,
                                    isInView,
                                })}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
