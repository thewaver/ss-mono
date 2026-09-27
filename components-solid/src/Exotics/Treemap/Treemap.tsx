import { For, Show, createComputed, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    TREEMAP_DEFAULTS,
    TREEMAP_ZOOM_EASING,
    type TreemapNode,
    type TreemapTileState,
    type TreemapTransition,
    TreemapUtils,
    TreemapStyles as styles,
} from "@thewaver/ss-components";
import type { Rect } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import type { TreemapProps } from "./TreemapSolid.types";

const NOTHING = 0;
const HIDDEN = 0;
const SHOWN = 1;

export const Treemap = <T,>(props: TreemapProps<T>) => {
    const itemRefs = new Map<TreemapNode<T>, HTMLElement>();
    const tileRefs = new Map<TreemapNode<T>, HTMLElement>();

    let cameFrom: TreemapNode<T> | undefined;
    let isFocusPending = false;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getLayerRef, setLayerRef] = createSignal<HTMLElement>();
    const [getFocusedNode, setFocusedNode] = createSignal<TreemapNode<T>>();
    const [getTransition, setTransition] = createSignal<TreemapTransition<T>>();

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getFull = createMemo((): Rect => ({ x: NOTHING, y: NOTHING, ...getSize() }));

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? TREEMAP_DEFAULTS.zoomDurationMs);

    const [getHeldBranch, setHeldBranch] = SignalMirrorSolidUtils.createOptional(
        () => props.branchSignal,
        untrack(getRootNode),
    );

    const getBranch = createMemo(() => TreemapUtils.resolveBranch(getHeldBranch(), getRootNode(), getWeights()));

    const getTiles = createMemo(() => TreemapUtils.computeTiles(getBranch(), getWeights(), getSize()));

    const getTileByNode = createMemo(() => new Map(getTiles().map((tile) => [tile.node, tile])));

    const getNodes = createMemo(() => getTiles().map((tile) => tile.node));

    const getStops = createMemo(() => getNodes().filter((node) => TreemapUtils.getIsBranch(node, getWeights())));

    const getRovingNode = createMemo(() => TreemapUtils.resolveStop(getFocusedNode(), getStops()));

    createComputed(
        on(getBranch, (next, previous) => {
            cameFrom = previous;

            setTransition(
                previous === undefined
                    ? undefined
                    : TreemapUtils.computeTransition(next, previous, getWeights(), getSize(), getZoomDurationMs()),
            );
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

        const target = TreemapUtils.resolveStop(cameFrom, getStops());

        if (target !== undefined) focusNode(target);
        else getLayerRef()?.focus();
    };

    const animateEntering = () => {
        const transition = getTransition();

        if (!transition) return;

        const timing = { duration: transition.durationMs, easing: TREEMAP_ZOOM_EASING };

        getTiles().forEach((tile) => {
            const from = TreemapUtils.computeEnteringStart(tile.rect, getSize(), transition);

            itemRefs.get(tile.node)?.animate([TreemapUtils.toBox(from), TreemapUtils.toBox(tile.rect)], timing);
        });

        if (transition.zoom === "in") getLayerRef()?.animate([{ opacity: HIDDEN }, { opacity: SHOWN }], timing);
    };

    const animateLeaving = (transition: TreemapTransition<T>, layer: HTMLElement, items: HTMLElement[]) => {
        const timing: KeyframeAnimationOptions = {
            duration: transition.durationMs,
            easing: TREEMAP_ZOOM_EASING,
            fill: "forwards",
        };

        transition.leavingTiles.forEach((tile, index) => {
            const to = TreemapUtils.computeLeavingEnd(tile.rect, getSize(), transition);

            items[index]?.animate([TreemapUtils.toBox(tile.rect), TreemapUtils.toBox(to)], timing);
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
            const parent = TreemapUtils.findParent(getRootNode(), getBranch());

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        const from = getRovingNode();

        if (from === undefined || e.target !== tileRefs.get(from)) return;

        const action = TreemapUtils.computeKeyAction(e.key, from, getStops());

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
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
                                        style={TreemapUtils.toBox(tile.rect)}
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
                                            style={TreemapUtils.toBox(getState().rect)}
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
