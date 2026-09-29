<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { on } from "svelte/events";

    import {
        CIRCLE_PACKING_DEFAULTS,
        type CirclePackingCircle,
        type CirclePackingCircleState,
        type CirclePackingNode,
        CirclePackingUtils,
        type CirclePackingView,
        TreemapUtils,
        CirclePackingStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { createHeldValue } from "../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../Utils/storeUtils.js";
    import type { CirclePackingProps } from "./CirclePacking.types.js";

    const NOTHING = 0;
    const NEXT = 1;
    const HALF = 0.5;
    const EMPTY_CIRCLE: CirclePackingCircle = { x: 0, y: 0, radius: 0 };

    let { branch = $bindable(), ...props }: CirclePackingProps<T> = $props();

    let root = $state<HTMLDivElement>();
    let focusedNode = $state.raw<CirclePackingNode<T>>();

    const circleRefs = new Map<CirclePackingNode<T>, Element>();

    let isFocusPending = false;

    const zoomClock = TreemapUtils.createZoomClock();

    const getProgress = readStore(zoomClock);
    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);
    const side = $derived(Math.min(getSize().width, getSize().height));
    const padding = $derived(props.padding ?? CIRCLE_PACKING_DEFAULTS.padding);
    const zoomDurationMs = $derived(props.zoomDurationMs ?? CIRCLE_PACKING_DEFAULTS.zoomDurationMs);

    const weights = $derived(TreemapUtils.computeWeights(props.root));
    const layout = $derived(CirclePackingUtils.computeLayout(props.root, weights, side, padding));
    const nodes = $derived(CirclePackingUtils.listNodes(props.root, layout));
    const depths = $derived(CirclePackingUtils.computeDepths(props.root));
    const nodeKeys = $derived(new Map(nodes.map((node, index) => [node, index])));

    const [getHeldBranch, setHeldBranch] = createHeldValue([
        () => branch,
        (next) => {
            branch = next;
        },
    ]);

    const shownBranch = $derived(TreemapUtils.resolveBranch(getHeldBranch() ?? props.root, props.root, weights));

    let zoom = $state.raw<{
        branch: CirclePackingNode<T>;
        cameFrom: CirclePackingNode<T> | undefined;
        path: ((progress: number) => CirclePackingView) | undefined;
        generation: number;
    }>({
        branch: untrack(() => shownBranch),
        cameFrom: undefined,
        path: undefined,
        generation: NOTHING,
    });

    watchChange(
        () => shownBranch,
        (next) => {
            if (zoom.branch === next) return;

            const from = CirclePackingUtils.computeShownView(
                zoom.path,
                CirclePackingUtils.toView(layout.get(zoom.branch) ?? EMPTY_CIRCLE),
                getProgress(),
            );

            zoom = {
                branch: next,
                cameFrom: zoom.branch,
                path: CirclePackingUtils.interpolateZoom(
                    from,
                    CirclePackingUtils.toView(layout.get(next) ?? EMPTY_CIRCLE),
                ),
                generation: zoom.generation + NEXT,
            };
        },
        { isBeforeRender: true },
    );

    const view = $derived(
        CirclePackingUtils.computeShownView(
            zoom.path,
            CirclePackingUtils.toView(layout.get(shownBranch) ?? EMPTY_CIRCLE),
            getProgress(),
        ),
    );

    const getIsInView = (node: CirclePackingNode<T>) => shownBranch.children?.includes(node) ?? false;

    const stops = $derived(nodes.filter((node) => getIsInView(node) && TreemapUtils.getIsBranch(node, weights)));

    const rovingNode = $derived(TreemapUtils.resolveStop(focusedNode, stops));

    const computeState = (node: CirclePackingNode<T>): CirclePackingCircleState => ({
        ...CirclePackingUtils.project(layout.get(node) ?? EMPTY_CIRCLE, view, side),
        weight: weights.get(node) ?? NOTHING,
        isBranch: TreemapUtils.getIsBranch(node, weights),
        isInView: getIsInView(node),
        depth: depths.get(node) ?? NOTHING,
    });

    const zoomTo = (node: CirclePackingNode<T>) => {
        if (node === shownBranch) return;

        isFocusPending = root?.contains(document.activeElement) ?? false;

        setHeldBranch(node);
    };

    const focusNode = (node: CirclePackingNode<T>) => {
        focusedNode = node;
        (circleRefs.get(node) as SVGElement | undefined)?.focus();
    };

    $effect(() => zoomClock.stop);

    watchChange(
        () => zoom.generation,
        () => {
            zoomClock.start(zoomDurationMs);

            if (!isFocusPending) return;

            isFocusPending = false;

            const target = TreemapUtils.resolveStop(zoom.cameFrom, stops);

            if (target !== undefined) focusNode(target);
            else root?.focus();
        },
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const parent = TreemapUtils.findParent(props.root, shownBranch);

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        if (rovingNode === undefined || e.target !== circleRefs.get(rovingNode)) return;

        const action = TreemapUtils.computeKeyAction(e.key, rovingNode, stops);

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
    };

    const attachCircle =
        (node: CirclePackingNode<T>): Attachment<Element> =>
        (element) => {
            circleRefs.set(node, element);

            return () => {
                if (circleRefs.get(node) === element) circleRefs.delete(node);
            };
        };
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    {@attach (element) => on(element, "click", () => zoomTo(props.root))}
    class={styles.circlePackingRoot}
    tabindex="-1"
>
    <svg
        class={styles.circlePackingCanvas}
        viewBox={`${-getSize().width * HALF} ${-getSize().height * HALF} ${getSize().width} ${getSize().height}`}
        role="list"
        aria-label={props.ariaLabel}
    >
        {#each nodes as node (nodeKeys.get(node))}
            {@const isBranch = TreemapUtils.getIsBranch(node, weights)}
            {@const isInView = getIsInView(node)}
            <g
                role="listitem"
                class={isBranch ? undefined : styles.circlePackingLeaf}
                aria-hidden={isInView ? undefined : "true"}
            >
                <g
                    {@attach attachCircle(node)}
                    class={styles.circlePackingCircle}
                    role={isBranch && isInView ? "button" : undefined}
                    tabindex={isBranch && isInView ? (node === rovingNode ? 0 : -1) : undefined}
                    onclick={(e) => {
                        if (!isBranch || node === shownBranch) return;

                        e.stopPropagation();
                        focusedNode = node;
                        zoomTo(node);
                    }}
                >
                    {@render props.renderCircle(node, computeState(node))}
                </g>
            </g>
        {/each}

        {#if props.renderLabel}
            <g class={styles.circlePackingLabels} aria-hidden="true">
                {#each nodes as node (nodeKeys.get(node))}
                    {@render props.renderLabel(node, computeState(node))}
                {/each}
            </g>
        {/if}
    </svg>
</div>
