<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { on } from "svelte/events";

    import {
        TREEMAP_DEFAULTS,
        TREEMAP_ZOOM_EASING,
        type TreemapNode,
        type TreemapTransition,
        TreemapUtils,
        TreemapStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { createHeldValue } from "../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { TreemapProps } from "./Treemap.types.js";

    const NOTHING = 0;
    const HIDDEN = 0;
    const SHOWN = 1;
    const NEXT = 1;

    let { branch = $bindable(), ...props }: TreemapProps<T> = $props();

    let root = $state<HTMLDivElement>();
    let layer = $state<HTMLUListElement>();
    let leavingLayer = $state<HTMLUListElement>();
    let focusedNode = $state.raw<TreemapNode<T>>();

    const itemRefs = new Map<TreemapNode<T>, HTMLElement>();
    const tileRefs = new Map<TreemapNode<T>, HTMLElement>();
    const leavingItemRefs: Array<HTMLElement | undefined> = [];

    let isFocusPending = false;

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);
    const zoomDurationMs = $derived(props.zoomDurationMs ?? TREEMAP_DEFAULTS.zoomDurationMs);

    const weights = $derived(TreemapUtils.computeWeights(props.root));

    const [getHeldBranch, setHeldBranch] = createHeldValue([
        () => branch,
        (next) => {
            branch = next;
        },
    ]);

    const shownBranch = $derived(TreemapUtils.resolveBranch(getHeldBranch() ?? props.root, props.root, weights));

    let zoom = $state.raw<{
        branch: TreemapNode<T>;
        cameFrom: TreemapNode<T> | undefined;
        transition: TreemapTransition<T> | undefined;
        generation: number;
    }>({
        branch: untrack(() => shownBranch),
        cameFrom: undefined,
        transition: undefined,
        generation: NOTHING,
    });

    watchChange(
        () => shownBranch,
        (next) => {
            if (zoom.branch === next) return;

            zoom = {
                branch: next,
                cameFrom: zoom.branch,
                transition: TreemapUtils.computeTransition(next, zoom.branch, weights, getSize(), zoomDurationMs),
                generation: zoom.generation + NEXT,
            };
        },
        { isBeforeRender: true },
    );

    const tiles = $derived(TreemapUtils.computeTiles(shownBranch, weights, getSize()));

    const stops = $derived(tiles.map((tile) => tile.node).filter((node) => TreemapUtils.getIsBranch(node, weights)));

    const rovingNode = $derived(TreemapUtils.resolveStop(focusedNode, stops));

    const zoomTo = (node: TreemapNode<T>) => {
        if (node === shownBranch) return;

        isFocusPending = root?.contains(document.activeElement) ?? false;

        setHeldBranch(node);
    };

    const focusNode = (node: TreemapNode<T>) => {
        focusedNode = node;
        tileRefs.get(node)?.focus();
    };

    $effect(() => {
        void zoom.generation;

        return untrack(() => {
            const transition = zoom.transition;
            const animations: Animation[] = [];

            if (transition) {
                const timing = { duration: transition.durationMs, easing: TREEMAP_ZOOM_EASING };

                tiles.forEach((tile) => {
                    const from = TreemapUtils.computeEnteringStart(tile.rect, getSize(), transition);
                    const animation = itemRefs
                        .get(tile.node)
                        ?.animate([TreemapUtils.toBox(from), TreemapUtils.toBox(tile.rect)], timing);

                    if (animation) animations.push(animation);
                });

                if (transition.zoom === "in") {
                    const fade = layer?.animate([{ opacity: HIDDEN }, { opacity: SHOWN }], timing);

                    if (fade) animations.push(fade);
                }
            }

            if (isFocusPending) {
                isFocusPending = false;

                const target = TreemapUtils.resolveStop(zoom.cameFrom, stops);

                if (target !== undefined) focusNode(target);
                else layer?.focus();
            }

            return () => animations.forEach((animation) => animation.cancel());
        });
    });

    $effect(() => {
        const transition = zoom.transition;
        const leaving = leavingLayer;

        if (!transition || !leaving) return;

        return untrack(() => {
            const timing: KeyframeAnimationOptions = {
                duration: transition.durationMs,
                easing: TREEMAP_ZOOM_EASING,
                fill: "forwards",
            };

            const animations = transition.leavingTiles.map((tile, index) =>
                leavingItemRefs[index]?.animate(
                    [
                        TreemapUtils.toBox(tile.rect),
                        TreemapUtils.toBox(TreemapUtils.computeLeavingEnd(tile.rect, getSize(), transition)),
                    ],
                    timing,
                ),
            );

            const fade = leaving.animate(
                [{ opacity: SHOWN }, { opacity: transition.zoom === "in" ? SHOWN : HIDDEN }],
                timing,
            );

            fade.onfinish = () => {
                if (zoom.transition === transition) zoom = { ...zoom, transition: undefined };
            };

            return () => {
                fade.onfinish = null;
                fade.cancel();
                animations.forEach((animation) => animation?.cancel());
            };
        });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const parent = TreemapUtils.findParent(props.root, shownBranch);

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        if (rovingNode === undefined || e.target !== tileRefs.get(rovingNode)) return;

        const action = TreemapUtils.computeKeyAction(e.key, rovingNode, stops);

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
    };

    const attachLeavingItem =
        (index: number): Attachment<HTMLElement> =>
        (element) => {
            leavingItemRefs[index] = element;

            return () => {
                if (leavingItemRefs[index] === element) leavingItemRefs[index] = undefined;
            };
        };

    const attachTo =
        (refs: Map<TreemapNode<T>, HTMLElement>, node: TreemapNode<T>): Attachment<HTMLElement> =>
        (element) => {
            refs.set(node, element);

            return () => {
                if (refs.get(node) === element) refs.delete(node);
            };
        };
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={[styles.treemapRoot, zoom.transition && styles.treemapZooming]}
>
    {#if zoom.transition}
        {@const leaving = zoom.transition}
        {#key zoom.generation}
            <ul
                bind:this={leavingLayer}
                class={[styles.treemapLayer, styles.treemapLeaving, leaving.zoom === "out" && styles.treemapOnTop]}
                aria-hidden="true"
            >
                {#each leaving.leavingTiles as tile, index (index)}
                    <li
                        {@attach attachLeavingItem(index)}
                        class={styles.treemapItem}
                        style={toStyle(TreemapUtils.toBox(tile.rect))}
                    >
                        <div class={styles.treemapTile}>
                            {@render props.renderTile(tile.node, {
                                rect: tile.rect,
                                weight: tile.weight,
                                isBranch: TreemapUtils.getIsBranch(tile.node, weights),
                                isLeaving: true,
                            })}
                        </div>
                    </li>
                {/each}
            </ul>
        {/key}
    {/if}

    {#key zoom.generation}
        <ul bind:this={layer} class={styles.treemapLayer} tabindex="-1" aria-label={props.ariaLabel}>
            {#each tiles as tile, index (index)}
                {@const node = tile.node}
                {@const isBranch = TreemapUtils.getIsBranch(node, weights)}
                <li
                    {@attach attachTo(itemRefs, node)}
                    class={styles.treemapItem}
                    style={toStyle(TreemapUtils.toBox(tile.rect))}
                >
                    <div
                        {@attach attachTo(tileRefs, node)}
                        class={styles.treemapTile}
                        role={isBranch ? "button" : undefined}
                        tabindex={isBranch ? (node === rovingNode ? 0 : -1) : undefined}
                        onclick={() => {
                            if (!isBranch) return;

                            focusedNode = node;
                            zoomTo(node);
                        }}
                    >
                        {@render props.renderTile(node, {
                            rect: tile.rect,
                            weight: tile.weight,
                            isBranch,
                            isLeaving: false,
                        })}
                    </div>
                </li>
            {/each}
        </ul>
    {/key}
</div>
