import { type KeyboardEvent, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    TREEMAP_DEFAULTS,
    TREEMAP_ZOOM_EASING,
    type TreemapNode,
    TreemapStyles,
    type TreemapTransition,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import type { TreemapProps } from "./Treemap.types";

const NOTHING = 0;
const HIDDEN = 0;
const SHOWN = 1;
const NEXT = 1;

type TreemapZoomState<T> = {
    branch: TreemapNode<T>;
    cameFrom: TreemapNode<T> | undefined;
    transition: TreemapTransition<T> | undefined;
    generation: number;
};

export const Treemap = <T,>(props: TreemapProps<T>) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLUListElement>(null);
    const leavingLayerRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef(new Map<TreemapNode<T>, HTMLElement>());
    const tileRefs = useRef(new Map<TreemapNode<T>, HTMLElement>());
    const leavingItemRefs = useRef<Array<HTMLElement | undefined>>([]);
    const isFocusPendingRef = useRef(false);

    const [focusedNode, setFocusedNode] = useState<TreemapNode<T>>();

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const zoomDurationMs = props.zoomDurationMs ?? TREEMAP_DEFAULTS.zoomDurationMs;

    const weights = useMemo(() => TreemapUtils.computeWeights(props.root), [props.root]);

    const [heldBranch, setHeldBranch] = SignalMirrorReactUtils.useOptionalState(props.branch, props.root);

    const branch = TreemapUtils.resolveBranch(heldBranch, props.root, weights);

    const [zoom, setZoom] = useState<TreemapZoomState<T>>(() => ({
        branch,
        cameFrom: undefined,
        transition: undefined,
        generation: NOTHING,
    }));

    if (zoom.branch !== branch) {
        setZoom({
            branch,
            cameFrom: zoom.branch,
            transition: TreemapUtils.computeTransition(branch, zoom.branch, weights, size, zoomDurationMs),
            generation: zoom.generation + NEXT,
        });
    }

    const tiles = useMemo(() => TreemapUtils.computeTiles(branch, weights, size), [branch, weights, size]);

    const stops = tiles.map((tile) => tile.node).filter((node) => TreemapUtils.getIsBranch(node, weights));

    const rovingNode = TreemapUtils.resolveStop(focusedNode, stops);

    const zoomTo = (node: TreemapNode<T>) => {
        if (node === branch) return;

        isFocusPendingRef.current = rootRef.current?.contains(document.activeElement) ?? false;

        setHeldBranch(node);
    };

    const focusNode = (node: TreemapNode<T>) => {
        setFocusedNode(node);
        tileRefs.current.get(node)?.focus();
    };

    useLayoutEffect(() => {
        const transition = zoom.transition;
        const animations: Animation[] = [];

        if (transition) {
            const timing = { duration: transition.durationMs, easing: TREEMAP_ZOOM_EASING };

            tiles.forEach((tile) => {
                const from = TreemapUtils.computeEnteringStart(tile.rect, size, transition);
                const animation = itemRefs.current
                    .get(tile.node)
                    ?.animate([TreemapUtils.toBox(from), TreemapUtils.toBox(tile.rect)], timing);

                if (animation) animations.push(animation);
            });

            if (transition.zoom === "in") {
                const fade = layerRef.current?.animate([{ opacity: HIDDEN }, { opacity: SHOWN }], timing);

                if (fade) animations.push(fade);
            }
        }

        if (isFocusPendingRef.current) {
            isFocusPendingRef.current = false;

            const target = TreemapUtils.resolveStop(zoom.cameFrom, stops);

            if (target !== undefined) focusNode(target);
            else layerRef.current?.focus();
        }

        return () => animations.forEach((animation) => animation.cancel());
    }, [zoom.generation]);

    useLayoutEffect(() => {
        const transition = zoom.transition;
        const layer = leavingLayerRef.current;

        if (!transition || !layer) return;

        const timing: KeyframeAnimationOptions = {
            duration: transition.durationMs,
            easing: TREEMAP_ZOOM_EASING,
            fill: "forwards",
        };

        const animations = transition.leavingTiles.map((tile, index) =>
            leavingItemRefs.current[index]?.animate(
                [
                    TreemapUtils.toBox(tile.rect),
                    TreemapUtils.toBox(TreemapUtils.computeLeavingEnd(tile.rect, size, transition)),
                ],
                timing,
            ),
        );

        const fade = layer.animate(
            [{ opacity: SHOWN }, { opacity: transition.zoom === "in" ? SHOWN : HIDDEN }],
            timing,
        );

        fade.onfinish = () =>
            setZoom((current) => (current.transition === transition ? { ...current, transition: undefined } : current));

        return () => {
            fade.onfinish = null;
            fade.cancel();
            animations.forEach((animation) => animation?.cancel());
        };
    }, [zoom.transition]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            const parent = TreemapUtils.findParent(props.root, branch);

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        if (rovingNode === undefined || e.target !== tileRefs.current.get(rovingNode)) return;

        const action = TreemapUtils.computeKeyAction(e.key, rovingNode, stops);

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
    };

    const leaving = zoom.transition;

    return (
        <div
            ref={rootRef}
            className={[TreemapStyles.treemapRoot, leaving ? TreemapStyles.treemapZooming : undefined]
                .filter(Boolean)
                .join(" ")}
            onKeyDown={handleKeyDown}
        >
            {leaving && (
                <ul
                    key={`leaving-${zoom.generation}`}
                    ref={leavingLayerRef}
                    className={[
                        TreemapStyles.treemapLayer,
                        TreemapStyles.treemapLeaving,
                        leaving.zoom === "out" ? TreemapStyles.treemapOnTop : undefined,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    aria-hidden="true"
                >
                    {leaving.leavingTiles.map((tile, index) => (
                        <li
                            key={index}
                            ref={(element) => {
                                leavingItemRefs.current[index] = element ?? undefined;
                            }}
                            className={TreemapStyles.treemapItem}
                            style={TreemapUtils.toBox(tile.rect)}
                        >
                            <div className={TreemapStyles.treemapTile}>
                                {props.renderTile(tile.node, {
                                    rect: tile.rect,
                                    weight: tile.weight,
                                    isBranch: TreemapUtils.getIsBranch(tile.node, weights),
                                    isLeaving: true,
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <ul
                key={`level-${zoom.generation}`}
                ref={layerRef}
                className={TreemapStyles.treemapLayer}
                tabIndex={-1}
                aria-label={props.ariaLabel}
            >
                {tiles.map((tile, index) => {
                    const node = tile.node;
                    const isBranch = TreemapUtils.getIsBranch(node, weights);

                    return (
                        <li
                            key={index}
                            ref={(element) => {
                                if (element) itemRefs.current.set(node, element);
                                else itemRefs.current.delete(node);
                            }}
                            className={TreemapStyles.treemapItem}
                            style={TreemapUtils.toBox(tile.rect)}
                        >
                            <div
                                ref={(element) => {
                                    if (element) tileRefs.current.set(node, element);
                                    else tileRefs.current.delete(node);
                                }}
                                className={TreemapStyles.treemapTile}
                                role={isBranch ? "button" : undefined}
                                tabIndex={isBranch ? (node === rovingNode ? 0 : -1) : undefined}
                                onClick={() => {
                                    if (!isBranch) return;

                                    setFocusedNode(node);
                                    zoomTo(node);
                                }}
                            >
                                {props.renderTile(node, {
                                    rect: tile.rect,
                                    weight: tile.weight,
                                    isBranch,
                                    isLeaving: false,
                                })}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
