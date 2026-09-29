import { type KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    SUNBURST_DEFAULTS,
    type SunburstNode,
    type SunburstSpan,
    SunburstStyles,
    SunburstUtils,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useStore } from "../../Utils/storeUtils";
import type { SunburstProps } from "./Sunburst.types";

const NOTHING = 0;
const SETTLED = 1;
const NEXT = 1;
const HALF = 0.5;
const CENTER_RINGS = 1;
const EMPTY_SPAN: SunburstSpan = { start: 0, end: 0, inner: 0, outer: 0 };

type SunburstZoomState<T> = {
    branch: SunburstNode<T>;
    cameFrom: SunburstNode<T> | undefined;
    fromViews: Map<SunburstNode<T>, SunburstSpan>;
    generation: number;
};

export const Sunburst = <T,>(props: SunburstProps<T>) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const arcRefs = useRef(new Map<SunburstNode<T>, SVGGElement>());
    const isFocusPendingRef = useRef(false);

    const [zoomClock] = useState(TreemapUtils.createZoomClock);
    const [focusedNode, setFocusedNode] = useState<SunburstNode<T>>();

    const progress = useStore(zoomClock);
    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const side = Math.min(size.width, size.height);
    const ringCount = Math.max(SETTLED, props.ringCount ?? SUNBURST_DEFAULTS.ringCount);
    const ringWidth = (side * HALF) / (ringCount + CENTER_RINGS);
    const zoomDurationMs = props.zoomDurationMs ?? SUNBURST_DEFAULTS.zoomDurationMs;

    const weights = useMemo(() => TreemapUtils.computeWeights(props.root), [props.root]);
    const spans = useMemo(() => SunburstUtils.computeSpans(props.root, weights), [props.root, weights]);
    const allNodes = useMemo(() => SunburstUtils.listNodes(props.root, weights), [props.root, weights]);
    const nodeKeys = useMemo(() => new Map(allNodes.map((node, index) => [node, index])), [allNodes]);

    const [heldBranch, setHeldBranch] = SignalMirrorReactUtils.useOptionalState(props.branch, props.root);

    const branch = TreemapUtils.resolveBranch(heldBranch, props.root, weights);

    const [zoom, setZoom] = useState<SunburstZoomState<T>>(() => ({
        branch,
        cameFrom: undefined,
        fromViews: new Map(),
        generation: NOTHING,
    }));

    const computeShownView = (node: SunburstNode<T>, center: SunburstNode<T>) =>
        SunburstUtils.computeShownSpan(
            spans.get(node) ?? EMPTY_SPAN,
            spans.get(center) ?? EMPTY_SPAN,
            zoom.fromViews.get(node),
            progress,
        );

    if (zoom.branch !== branch) {
        setZoom({
            branch,
            cameFrom: zoom.branch,
            fromViews: new Map(allNodes.map((node) => [node, computeShownView(node, zoom.branch)])),
            generation: zoom.generation + NEXT,
        });
    }

    const centerSpan = spans.get(branch) ?? EMPTY_SPAN;

    const targetViews = useMemo(
        () =>
            new Map(
                allNodes.map((node) => [node, SunburstUtils.computeView(spans.get(node) ?? EMPTY_SPAN, centerSpan)]),
            ),
        [allNodes, spans, centerSpan],
    );

    const isZooming = progress < SETTLED;

    const getIsVisibleAtTarget = (node: SunburstNode<T>) =>
        SunburstUtils.getIsVisible(targetViews.get(node) ?? EMPTY_SPAN, ringCount);

    const getIsVisibleAtStart = (node: SunburstNode<T>) =>
        SunburstUtils.getIsVisible(zoom.fromViews.get(node) ?? EMPTY_SPAN, ringCount);

    const renderedNodes = allNodes.filter(
        (node) => getIsVisibleAtTarget(node) || (isZooming && getIsVisibleAtStart(node)),
    );

    const stops = allNodes.filter((node) => getIsVisibleAtTarget(node) && TreemapUtils.getIsBranch(node, weights));

    const rovingNode = TreemapUtils.resolveStop(focusedNode, stops);

    const zoomTo = (node: SunburstNode<T>) => {
        if (node === branch) return;

        isFocusPendingRef.current = rootRef.current?.contains(document.activeElement) ?? false;

        setHeldBranch(node);
    };

    const focusNode = (node: SunburstNode<T>) => {
        setFocusedNode(node);
        arcRefs.current.get(node)?.focus();
    };

    useEffect(() => zoomClock.stop, [zoomClock]);

    useLayoutEffect(() => {
        if (zoom.generation === NOTHING) return;

        zoomClock.start(zoomDurationMs);
    }, [zoom.generation]);

    useLayoutEffect(() => {
        if (!isFocusPendingRef.current) return;

        isFocusPendingRef.current = false;

        const target = TreemapUtils.resolveStop(zoom.cameFrom, stops);

        if (target !== undefined) focusNode(target);
        else rootRef.current?.focus();
    }, [zoom.generation]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            const parent = TreemapUtils.findParent(props.root, branch);

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        if (rovingNode === undefined || e.target !== arcRefs.current.get(rovingNode)) return;

        const action = TreemapUtils.computeKeyAction(e.key, rovingNode, stops);

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
    };

    return (
        <div ref={rootRef} className={SunburstStyles.sunburstRoot} tabIndex={-1} onKeyDown={handleKeyDown}>
            <svg
                className={SunburstStyles.sunburstCanvas}
                viewBox={`${-side * HALF} ${-side * HALF} ${side} ${side}`}
                role="list"
                aria-label={props.ariaLabel}
            >
                {renderedNodes.map((node) => {
                    const isBranch = TreemapUtils.getIsBranch(node, weights);
                    const isLeaving = !getIsVisibleAtTarget(node);

                    return (
                        <g
                            key={nodeKeys.get(node)}
                            role="listitem"
                            className={isLeaving ? SunburstStyles.sunburstLeaving : undefined}
                            style={{
                                opacity: SunburstUtils.computeOpacity(getIsVisibleAtStart(node), !isLeaving, progress),
                            }}
                            aria-hidden={isLeaving ? "true" : undefined}
                        >
                            <g
                                ref={(element) => {
                                    if (element) arcRefs.current.set(node, element);
                                    else arcRefs.current.delete(node);
                                }}
                                className={SunburstStyles.sunburstArc}
                                role={isBranch ? "button" : undefined}
                                tabIndex={isBranch && !isLeaving ? (node === rovingNode ? 0 : -1) : undefined}
                                onClick={() => {
                                    if (!isBranch || isLeaving) return;

                                    setFocusedNode(node);
                                    zoomTo(node);
                                }}
                            >
                                {props.renderArc(node, {
                                    ...SunburstUtils.toArc(computeShownView(node, branch), ringWidth),
                                    weight: weights.get(node) ?? NOTHING,
                                    isBranch,
                                    ring: (targetViews.get(node) ?? EMPTY_SPAN).inner,
                                })}
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
