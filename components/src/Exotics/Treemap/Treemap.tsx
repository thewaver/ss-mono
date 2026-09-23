import { For, Show, createComputed, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import type { Rect } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { TREEMAP_DEFAULTS } from "./Treemap.const";
import type { TreemapNode, TreemapProps, TreemapTile, TreemapTileState, TreemapZoom } from "./Treemap.types";
import { TreemapUtils } from "./Treemap.utils";

import * as styles from "./Treemap.css";

const NOTHING = 0;
const PARENT_FROM_END = 2;
const HIDDEN = 0;
const SHOWN = 1;
const ZOOM_EASING = "cubic-bezier(0.645, 0.045, 0.355, 1)";

type TreemapTransition<T> = {
    zoom: TreemapZoom;
    leavingTiles: TreemapTile<T>[];
    focusRect: Rect;
    durationMs: number;
};

const toBox = (rect: Rect) => {
    const left = Math.round(rect.x);
    const top = Math.round(rect.y);

    return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${Math.round(rect.x + rect.width) - left}px`,
        height: `${Math.round(rect.y + rect.height) - top}px`,
    };
};

export const Treemap = <T,>(props: TreemapProps<T>) => {
    const itemRefs = new Map<TreemapNode<T>, HTMLElement>();
    const tileRefs = new Map<TreemapNode<T>, HTMLElement>();

    let cameFrom: TreemapNode<T> | undefined;
    let isFocusPending = false;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getLayerRef, setLayerRef] = createSignal<HTMLElement>();
    const [getFocusedNode, setFocusedNode] = createSignal<TreemapNode<T>>();
    const [getTransition, setTransition] = createSignal<TreemapTransition<T>>();

    const getSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getFull = createMemo((): Rect => ({ x: NOTHING, y: NOTHING, ...getSize() }));

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? TREEMAP_DEFAULTS.zoomDurationMs);

    const [getHeldBranch, setHeldBranch] = SignalMirrorUtils.createOptional(
        () => props.branchSignal,
        untrack(getRootNode),
    );

    const getBranch = createMemo(() => {
        const held = getHeldBranch();

        return TreemapUtils.getIsBranch(held, getWeights()) && TreemapUtils.findPath(getRootNode(), held)
            ? held
            : getRootNode();
    });

    const getTiles = createMemo(() => TreemapUtils.computeTiles(getBranch(), getWeights(), getSize()));

    const getTileByNode = createMemo(() => new Map(getTiles().map((tile) => [tile.node, tile])));

    const getNodes = createMemo(() => getTiles().map((tile) => tile.node));

    const getStops = createMemo(() => getNodes().filter((node) => TreemapUtils.getIsBranch(node, getWeights())));

    const getRovingNode = createMemo(() => {
        const focused = getFocusedNode();
        const stops = getStops();

        return focused !== undefined && stops.includes(focused) ? focused : stops[NOTHING];
    });

    const computeTransition = (next: TreemapNode<T>, previous: TreemapNode<T>): TreemapTransition<T> | undefined => {
        const durationMs = getZoomDurationMs();
        const size = getSize();

        if (durationMs <= NOTHING || size.width <= NOTHING || size.height <= NOTHING) return undefined;

        const inward = TreemapUtils.findPath(previous, next);
        const outward = inward ? undefined : TreemapUtils.findPath(next, previous);
        const path = inward ?? outward;

        if (!path) return undefined;

        const focusRect = TreemapUtils.computeDescendantRect(path, getWeights(), size);

        if (!focusRect) return undefined;

        return {
            zoom: inward ? "in" : "out",
            leavingTiles: TreemapUtils.computeTiles(previous, getWeights(), size),
            focusRect,
            durationMs,
        };
    };

    createComputed(
        on(getBranch, (next, previous) => {
            cameFrom = previous;

            setTransition(previous === undefined ? undefined : computeTransition(next, previous));
        }),
    );

    const zoomTo = (node: TreemapNode<T>) => {
        if (node === getBranch()) return;

        isFocusPending = getRootRef()?.contains(document.activeElement) ?? false;

        setHeldBranch(() => node);
    };

    const focusNode = (node: TreemapNode<T>) => {
        setFocusedNode(() => node);
        tileRefs.get(node)?.focus();
    };

    const focusAfterZoom = () => {
        if (!isFocusPending) return;

        isFocusPending = false;

        const stops = getStops();
        const target = cameFrom !== undefined && stops.includes(cameFrom) ? cameFrom : stops[NOTHING];

        if (target !== undefined) focusNode(target);
        else getLayerRef()?.focus();
    };

    const animateEntering = () => {
        const transition = getTransition();

        if (!transition) return;

        const timing = { duration: transition.durationMs, easing: ZOOM_EASING };

        getTiles().forEach((tile) => {
            const from =
                transition.zoom === "in"
                    ? TreemapUtils.projectRect(tile.rect, getFull(), transition.focusRect)
                    : TreemapUtils.projectRect(tile.rect, transition.focusRect, getFull());

            itemRefs.get(tile.node)?.animate([toBox(from), toBox(tile.rect)], timing);
        });

        if (transition.zoom === "in") getLayerRef()?.animate([{ opacity: HIDDEN }, { opacity: SHOWN }], timing);
    };

    const animateLeaving = (transition: TreemapTransition<T>, layer: HTMLElement, items: HTMLElement[]) => {
        const timing: KeyframeAnimationOptions = {
            duration: transition.durationMs,
            easing: ZOOM_EASING,
            fill: "forwards",
        };

        transition.leavingTiles.forEach((tile, index) => {
            const to =
                transition.zoom === "in"
                    ? TreemapUtils.projectRect(tile.rect, transition.focusRect, getFull())
                    : TreemapUtils.projectRect(tile.rect, getFull(), transition.focusRect);

            items[index]?.animate([toBox(tile.rect), toBox(to)], timing);
        });

        const fade = layer.animate(
            [{ opacity: SHOWN }, { opacity: transition.zoom === "in" ? SHOWN : HIDDEN }],
            timing,
        );

        fade.onfinish = () => {
            if (getTransition() === transition) setTransition(undefined);
        };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const path = TreemapUtils.findPath(getRootNode(), getBranch());
            const parent = path?.[path.length - PARENT_FROM_END];

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        const from = getRovingNode();

        if (from === undefined || e.target !== tileRefs.get(from)) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            zoomTo(from);

            return;
        }

        const stops = getStops();
        const next = NavigatorUtils.computeNextPosition(e.key, stops.indexOf(from), stops.length, {
            orientation: "both",
            isLooping: false,
        });

        if (next === undefined || stops[next] === from) return;

        e.preventDefault();
        focusNode(stops[next]);
    };

    return (
        <div
            ref={setRootRef}
            class={styles.treemapRoot}
            classList={{ [styles.treemapZooming]: getTransition() !== undefined }}
            onKeyDown={handleKeyDown}
        >
            <Show when={getTransition()} keyed>
                {(transition) => {
                    let layer!: HTMLUListElement;

                    const items: HTMLElement[] = [];

                    onMount(() => animateLeaving(transition, layer, items));

                    return (
                        <ul
                            ref={layer}
                            class={styles.treemapLayer}
                            classList={{
                                [styles.treemapLeaving]: true,
                                [styles.treemapOnTop]: transition.zoom === "out",
                            }}
                            aria-hidden="true"
                        >
                            <For each={transition.leavingTiles}>
                                {(tile, getIndex) => (
                                    <li
                                        ref={(element) => (items[getIndex()] = element)}
                                        class={styles.treemapItem}
                                        style={toBox(tile.rect)}
                                    >
                                        <div class={styles.treemapTile}>
                                            {props.renderTile(
                                                () => tile.node,
                                                () => ({
                                                    rect: tile.rect,
                                                    weight: tile.weight,
                                                    isBranch: TreemapUtils.getIsBranch(tile.node, getWeights()),
                                                    isLeaving: true,
                                                }),
                                            )}
                                        </div>
                                    </li>
                                )}
                            </For>
                        </ul>
                    );
                }}
            </Show>

            <Show when={getBranch()} keyed>
                {(_branch) => {
                    onMount(() => {
                        animateEntering();
                        focusAfterZoom();
                    });

                    return (
                        <ul
                            ref={setLayerRef}
                            class={styles.treemapLayer}
                            tabindex={-1}
                            aria-label={access(props.ariaLabel)}
                        >
                            <For each={getNodes()}>
                                {(node) => {
                                    const getTile = createMemo(() => getTileByNode().get(node));
                                    const getIsBranch = createMemo(() => TreemapUtils.getIsBranch(node, getWeights()));
                                    const getState = (): TreemapTileState => ({
                                        rect: getTile()?.rect ?? getFull(),
                                        weight: getTile()?.weight ?? NOTHING,
                                        isBranch: getIsBranch(),
                                        isLeaving: false,
                                    });

                                    onCleanup(() => {
                                        itemRefs.delete(node);
                                        tileRefs.delete(node);
                                    });

                                    return (
                                        <li
                                            ref={(element) => itemRefs.set(node, element)}
                                            class={styles.treemapItem}
                                            style={toBox(getState().rect)}
                                        >
                                            <div
                                                ref={(element) => tileRefs.set(node, element)}
                                                class={styles.treemapTile}
                                                role={getIsBranch() ? "button" : undefined}
                                                tabindex={
                                                    getIsBranch() ? (node === getRovingNode() ? 0 : -1) : undefined
                                                }
                                                onClick={() => {
                                                    if (!getIsBranch()) return;

                                                    setFocusedNode(() => node);
                                                    zoomTo(node);
                                                }}
                                            >
                                                {props.renderTile(() => node, getState)}
                                            </div>
                                        </li>
                                    );
                                }}
                            </For>
                        </ul>
                    );
                }}
            </Show>
        </div>
    );
};
