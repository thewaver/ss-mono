<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { on } from "svelte/events";

    import {
        SUNBURST_DEFAULTS,
        type SunburstNode,
        type SunburstSpan,
        SunburstUtils,
        TreemapUtils,
        SunburstStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { SunburstProps } from "./Sunburst.types.js";

    const NOTHING = 0;
    const SETTLED = 1;
    const NEXT = 1;
    const HALF = 0.5;
    const CENTER_RINGS = 1;
    const EMPTY_SPAN: SunburstSpan = { start: 0, end: 0, inner: 0, outer: 0 };

    let { branch = $bindable(), ...props }: SunburstProps<T> = $props();

    let root = $state<HTMLDivElement>();
    let focusedNode = $state.raw<SunburstNode<T>>();

    const arcRefs = new Map<SunburstNode<T>, Element>();

    let isFocusPending = false;

    const zoomClock = TreemapUtils.createZoomClock();

    const getProgress = readStore(zoomClock);
    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);
    const side = $derived(Math.min(getSize().width, getSize().height));
    const ringCount = $derived(Math.max(SETTLED, props.ringCount ?? SUNBURST_DEFAULTS.ringCount));
    const ringWidth = $derived((side * HALF) / (ringCount + CENTER_RINGS));
    const zoomDurationMs = $derived(props.zoomDurationMs ?? SUNBURST_DEFAULTS.zoomDurationMs);

    const weights = $derived(TreemapUtils.computeWeights(props.root));
    const spans = $derived(SunburstUtils.computeSpans(props.root, weights));
    const allNodes = $derived(SunburstUtils.listNodes(props.root, weights));
    const nodeKeys = $derived(new Map(allNodes.map((node, index) => [node, index])));

    const [getHeldBranch, setHeldBranch] = createHeldValue([
        () => branch,
        (next) => {
            branch = next;
        },
    ]);

    const shownBranch = $derived(TreemapUtils.resolveBranch(getHeldBranch() ?? props.root, props.root, weights));

    let zoom = $state.raw<{
        branch: SunburstNode<T>;
        cameFrom: SunburstNode<T> | undefined;
        fromViews: Map<SunburstNode<T>, SunburstSpan>;
        generation: number;
    }>({
        branch: untrack(() => shownBranch),
        cameFrom: undefined,
        fromViews: new Map(),
        generation: NOTHING,
    });

    const computeShownView = (node: SunburstNode<T>, center: SunburstNode<T>) =>
        SunburstUtils.computeShownSpan(
            spans.get(node) ?? EMPTY_SPAN,
            spans.get(center) ?? EMPTY_SPAN,
            zoom.fromViews.get(node),
            getProgress(),
        );

    watchChange(
        () => shownBranch,
        (next) => {
            if (zoom.branch === next) return;

            zoom = {
                branch: next,
                cameFrom: zoom.branch,
                fromViews: new Map(allNodes.map((node) => [node, computeShownView(node, zoom.branch)])),
                generation: zoom.generation + NEXT,
            };
        },
        { isBeforeRender: true },
    );

    const centerSpan = $derived(spans.get(shownBranch) ?? EMPTY_SPAN);

    const targetViews = $derived(
        new Map(allNodes.map((node) => [node, SunburstUtils.computeView(spans.get(node) ?? EMPTY_SPAN, centerSpan)])),
    );

    const isZooming = $derived(getProgress() < SETTLED);

    const getIsVisibleAtTarget = (node: SunburstNode<T>) =>
        SunburstUtils.getIsVisible(targetViews.get(node) ?? EMPTY_SPAN, ringCount);

    const getIsVisibleAtStart = (node: SunburstNode<T>) =>
        SunburstUtils.getIsVisible(zoom.fromViews.get(node) ?? EMPTY_SPAN, ringCount);

    const renderedNodes = $derived(
        allNodes.filter((node) => getIsVisibleAtTarget(node) || (isZooming && getIsVisibleAtStart(node))),
    );

    const stops = $derived(
        allNodes.filter((node) => getIsVisibleAtTarget(node) && TreemapUtils.getIsBranch(node, weights)),
    );

    const rovingNode = $derived(TreemapUtils.resolveStop(focusedNode, stops));

    const zoomTo = (node: SunburstNode<T>) => {
        if (node === shownBranch) return;

        isFocusPending = root?.contains(document.activeElement) ?? false;

        setHeldBranch(node);
    };

    const focusNode = (node: SunburstNode<T>) => {
        focusedNode = node;
        (arcRefs.get(node) as SVGElement | undefined)?.focus();
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

        if (rovingNode === undefined || e.target !== arcRefs.get(rovingNode)) return;

        const action = TreemapUtils.computeKeyAction(e.key, rovingNode, stops);

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
    };

    const attachArc =
        (node: SunburstNode<T>): Attachment<Element> =>
        (element) => {
            arcRefs.set(node, element);

            return () => {
                if (arcRefs.get(node) === element) arcRefs.delete(node);
            };
        };
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={styles.sunburstRoot}
    tabindex="-1"
>
    <svg
        class={styles.sunburstCanvas}
        viewBox={`${-side * HALF} ${-side * HALF} ${side} ${side}`}
        role="list"
        aria-label={props.ariaLabel}
    >
        {#each renderedNodes as node (nodeKeys.get(node))}
            {@const isBranch = TreemapUtils.getIsBranch(node, weights)}
            {@const isLeaving = !getIsVisibleAtTarget(node)}
            <g
                role="listitem"
                class={isLeaving ? styles.sunburstLeaving : undefined}
                style:opacity={SunburstUtils.computeOpacity(getIsVisibleAtStart(node), !isLeaving, getProgress())}
                aria-hidden={isLeaving ? "true" : undefined}
            >
                <g
                    {@attach attachArc(node)}
                    class={styles.sunburstArc}
                    role={isBranch ? "button" : undefined}
                    tabindex={isBranch && !isLeaving ? (node === rovingNode ? 0 : -1) : undefined}
                    onclick={() => {
                        if (!isBranch || isLeaving) return;

                        focusedNode = node;
                        zoomTo(node);
                    }}
                >
                    {@render props.renderArc(node, {
                        ...SunburstUtils.toArc(computeShownView(node, shownBranch), ringWidth),
                        weight: weights.get(node) ?? NOTHING,
                        isBranch,
                        ring: (targetViews.get(node) ?? EMPTY_SPAN).inner,
                    })}
                </g>
            </g>
        {/each}
    </svg>
</div>
