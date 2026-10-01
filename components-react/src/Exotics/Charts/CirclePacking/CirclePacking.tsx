import { Fragment, type KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CIRCLE_PACKING_DEFAULTS,
    type CirclePackingCircle,
    type CirclePackingCircleState,
    type CirclePackingNode,
    CirclePackingStyles,
    CirclePackingUtils,
    type CirclePackingView,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useStore } from "../../../Utils/storeUtils";
import type { CirclePackingProps } from "./CirclePacking.types";

const NOTHING = 0;
const NEXT = 1;
const HALF = 0.5;
const EMPTY_CIRCLE: CirclePackingCircle = { x: 0, y: 0, radius: 0 };

type CirclePackingZoomState<T> = {
    branch: CirclePackingNode<T>;
    cameFrom: CirclePackingNode<T> | undefined;
    path: ((progress: number) => CirclePackingView) | undefined;
    generation: number;
};

export const CirclePacking = <T,>(props: CirclePackingProps<T>) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const circleRefs = useRef(new Map<CirclePackingNode<T>, SVGGElement>());
    const isFocusPendingRef = useRef(false);

    const [zoomClock] = useState(TreemapUtils.createZoomClock);
    const [focusedNode, setFocusedNode] = useState<CirclePackingNode<T>>();

    const progress = useStore(zoomClock);
    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const side = Math.min(size.width, size.height);
    const padding = props.padding ?? CIRCLE_PACKING_DEFAULTS.padding;
    const zoomDurationMs = props.zoomDurationMs ?? CIRCLE_PACKING_DEFAULTS.zoomDurationMs;

    const weights = useMemo(() => TreemapUtils.computeWeights(props.root), [props.root]);
    const layout = useMemo(
        () => CirclePackingUtils.computeLayout(props.root, weights, side, padding),
        [props.root, weights, side, padding],
    );
    const nodes = useMemo(() => CirclePackingUtils.listNodes(props.root, layout), [props.root, layout]);
    const depths = useMemo(() => CirclePackingUtils.computeDepths(props.root), [props.root]);
    const nodeKeys = useMemo(() => new Map(nodes.map((node, index) => [node, index])), [nodes]);

    const [heldBranch, setHeldBranch] = SignalMirrorReactUtils.useOptionalState(props.branch, props.root);

    const branch = TreemapUtils.resolveBranch(heldBranch, props.root, weights);

    const [zoom, setZoom] = useState<CirclePackingZoomState<T>>(() => ({
        branch,
        cameFrom: undefined,
        path: undefined,
        generation: NOTHING,
    }));

    if (zoom.branch !== branch) {
        const from = CirclePackingUtils.computeShownView(
            zoom.path,
            CirclePackingUtils.toView(layout.get(zoom.branch) ?? EMPTY_CIRCLE),
            progress,
        );

        setZoom({
            branch,
            cameFrom: zoom.branch,
            path: CirclePackingUtils.interpolateZoom(
                from,
                CirclePackingUtils.toView(layout.get(branch) ?? EMPTY_CIRCLE),
            ),
            generation: zoom.generation + NEXT,
        });
    }

    const view = CirclePackingUtils.computeShownView(
        zoom.path,
        CirclePackingUtils.toView(layout.get(branch) ?? EMPTY_CIRCLE),
        progress,
    );

    const getIsInView = (node: CirclePackingNode<T>) => branch.children?.includes(node) ?? false;

    const stops = nodes.filter((node) => getIsInView(node) && TreemapUtils.getIsBranch(node, weights));

    const rovingNode = TreemapUtils.resolveStop(focusedNode, stops);

    const computeState = (node: CirclePackingNode<T>): CirclePackingCircleState => ({
        ...CirclePackingUtils.project(layout.get(node) ?? EMPTY_CIRCLE, view, side),
        weight: weights.get(node) ?? NOTHING,
        isBranch: TreemapUtils.getIsBranch(node, weights),
        isInView: getIsInView(node),
        depth: depths.get(node) ?? NOTHING,
    });

    const zoomTo = (node: CirclePackingNode<T>) => {
        if (node === branch) return;

        isFocusPendingRef.current = rootRef.current?.contains(document.activeElement) ?? false;

        setHeldBranch(node);
    };

    const focusNode = (node: CirclePackingNode<T>) => {
        setFocusedNode(node);
        circleRefs.current.get(node)?.focus();
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

        if (rovingNode === undefined || e.target !== circleRefs.current.get(rovingNode)) return;

        const action = TreemapUtils.computeKeyAction(e.key, rovingNode, stops);

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
    };

    return (
        <div
            ref={rootRef}
            className={CirclePackingStyles.circlePackingRoot}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            onClick={() => zoomTo(props.root)}
        >
            <svg
                className={CirclePackingStyles.circlePackingCanvas}
                viewBox={`${-size.width * HALF} ${-size.height * HALF} ${size.width} ${size.height}`}
                role="list"
                aria-label={props.ariaLabel}
            >
                {nodes.map((node) => {
                    const isBranch = TreemapUtils.getIsBranch(node, weights);
                    const isInView = getIsInView(node);

                    return (
                        <g
                            key={nodeKeys.get(node)}
                            role="listitem"
                            className={isBranch ? undefined : CirclePackingStyles.circlePackingLeaf}
                            aria-hidden={isInView ? undefined : "true"}
                        >
                            <g
                                ref={(element) => {
                                    if (element) circleRefs.current.set(node, element);
                                    else circleRefs.current.delete(node);
                                }}
                                className={CirclePackingStyles.circlePackingCircle}
                                role={isBranch && isInView ? "button" : undefined}
                                tabIndex={isBranch && isInView ? (node === rovingNode ? 0 : -1) : undefined}
                                onClick={(e) => {
                                    if (!isBranch || node === branch) return;

                                    e.stopPropagation();
                                    setFocusedNode(node);
                                    zoomTo(node);
                                }}
                            >
                                {props.renderCircle(node, computeState(node))}
                            </g>
                        </g>
                    );
                })}

                {props.renderLabel && (
                    <g className={CirclePackingStyles.circlePackingLabels} aria-hidden="true">
                        {nodes.map((node) => (
                            <Fragment key={nodeKeys.get(node)}>{props.renderLabel!(node, computeState(node))}</Fragment>
                        ))}
                    </g>
                )}
            </svg>
        </div>
    );
};
