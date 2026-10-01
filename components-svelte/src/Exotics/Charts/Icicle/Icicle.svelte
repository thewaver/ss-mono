<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { on } from "svelte/events";

    import {
        ICICLE_DEFAULTS,
        type IcicleNode,
        type IcicleSpan,
        IcicleUtils,
        NavigatorUtils,
        TreemapUtils,
        IcicleStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { IcicleProps } from "./Icicle.types.js";

    const NOTHING = 0;
    const SETTLED = 1;
    const NEXT = 1;
    const EMPTY_SPAN: IcicleSpan = { start: 0, end: 0, column: 0 };

    let { focus = $bindable(), ...props }: IcicleProps<T> = $props();

    let root = $state<HTMLDivElement>();
    let cursorNode = $state.raw<IcicleNode<T>>();

    const cellRefs = new Map<IcicleNode<T>, HTMLElement>();

    let isFocusPending = false;

    const zoomClock = TreemapUtils.createZoomClock();

    const getProgress = readStore(zoomClock);
    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);
    const columnCount = $derived(Math.max(SETTLED, props.columnCount ?? ICICLE_DEFAULTS.columnCount));
    const zoomDurationMs = $derived(props.zoomDurationMs ?? ICICLE_DEFAULTS.zoomDurationMs);

    const weights = $derived(TreemapUtils.computeWeights(props.root));
    const spans = $derived(IcicleUtils.computeSpans(props.root, weights));
    const parents = $derived(IcicleUtils.computeParents(props.root));
    const allNodes = $derived(IcicleUtils.listNodes(spans, weights));
    const nodeKeys = $derived(new Map(allNodes.map((node, index) => [node, index])));

    const [getHeldFocus, setHeldFocus] = createHeldValue([
        () => focus,
        (next) => {
            focus = next;
        },
    ]);

    const shownFocus = $derived.by(() => {
        const held = getHeldFocus() ?? props.root;

        return allNodes.includes(held) ? held : props.root;
    });

    let zoom = $state.raw<{
        focus: IcicleNode<T>;
        cameFrom: IcicleNode<T> | undefined;
        fromViews: Map<IcicleNode<T>, IcicleSpan>;
        generation: number;
    }>({
        focus: untrack(() => shownFocus),
        cameFrom: undefined,
        fromViews: new Map(),
        generation: NOTHING,
    });

    const computeShownView = (node: IcicleNode<T>, center: IcicleNode<T>) =>
        IcicleUtils.computeShownSpan(
            spans.get(node) ?? EMPTY_SPAN,
            spans.get(center) ?? EMPTY_SPAN,
            zoom.fromViews.get(node),
            getProgress(),
        );

    watchChange(
        () => shownFocus,
        (next) => {
            if (zoom.focus === next) return;

            zoom = {
                focus: next,
                cameFrom: zoom.focus,
                fromViews: new Map(allNodes.map((node) => [node, computeShownView(node, zoom.focus)])),
                generation: zoom.generation + NEXT,
            };
        },
        { isBeforeRender: true },
    );

    const focusSpan = $derived(spans.get(shownFocus) ?? EMPTY_SPAN);

    const targetViews = $derived(
        new Map(allNodes.map((node) => [node, IcicleUtils.computeView(spans.get(node) ?? EMPTY_SPAN, focusSpan)])),
    );

    const isZooming = $derived(getProgress() < SETTLED);

    const getIsVisibleAtTarget = (node: IcicleNode<T>) =>
        IcicleUtils.getIsVisible(targetViews.get(node) ?? EMPTY_SPAN, columnCount);

    const getIsVisibleAtStart = (node: IcicleNode<T>) =>
        IcicleUtils.getIsVisible(zoom.fromViews.get(node) ?? EMPTY_SPAN, columnCount);

    const renderedNodes = $derived(
        allNodes.filter((node) => getIsVisibleAtTarget(node) || (isZooming && getIsVisibleAtStart(node))),
    );

    const stops = $derived(allNodes.filter(getIsVisibleAtTarget));

    const rovingNode = $derived(cursorNode !== undefined && stops.includes(cursorNode) ? cursorNode : shownFocus);

    const zoomTo = (node: IcicleNode<T>) => {
        if (node === shownFocus) return;

        isFocusPending = root?.contains(document.activeElement) ?? false;

        setHeldFocus(node);
    };

    const activate = (node: IcicleNode<T>) => {
        const target = IcicleUtils.computeActivationTarget(node, shownFocus, parents);

        if (target) zoomTo(target);
    };

    const moveCursor = (node: IcicleNode<T>) => {
        cursorNode = node;
        cellRefs.get(node)?.focus();
    };

    $effect(() => zoomClock.stop);

    watchChange(
        () => zoom.generation,
        () => {
            zoomClock.start(zoomDurationMs);

            if (!isFocusPending) return;

            isFocusPending = false;

            moveCursor(zoom.cameFrom !== undefined && stops.includes(zoom.cameFrom) ? zoom.cameFrom : shownFocus);
        },
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const parent = parents.get(shownFocus);

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        if (e.target !== cellRefs.get(rovingNode)) return;

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

    const attachCell =
        (node: IcicleNode<T>): Attachment<HTMLElement> =>
        (element) => {
            cellRefs.set(node, element);

            return () => {
                if (cellRefs.get(node) === element) cellRefs.delete(node);
            };
        };
</script>

<div bind:this={root} {@attach (element) => on(element, "keydown", handleKeyDown)} class={styles.icicleRoot}>
    <ul class={styles.icicleList} aria-label={props.ariaLabel}>
        {#each renderedNodes as node (nodeKeys.get(node))}
            {@const isInView = getIsVisibleAtTarget(node)}
            {@const rect = IcicleUtils.toRect(computeShownView(node, shownFocus), getSize(), columnCount)}
            <li
                class={[styles.icicleItem, !isInView && styles.icicleLeaving]}
                style={toStyle(TreemapUtils.toBox(rect))}
                aria-hidden={isInView ? undefined : "true"}
            >
                <div
                    {@attach attachCell(node)}
                    {@attach (element) =>
                        on(element, "click", () => {
                            if (!isInView) return;

                            cursorNode = node;
                            activate(node);
                        })}
                    class={styles.icicleCell}
                    role="button"
                    tabindex={isInView ? (node === rovingNode ? 0 : -1) : undefined}
                >
                    {@render props.renderCell(node, {
                        rect,
                        weight: weights.get(node) ?? NOTHING,
                        isBranch: TreemapUtils.getIsBranch(node, weights),
                        isFocus: node === shownFocus,
                        isInView,
                    })}
                </div>
            </li>
        {/each}
    </ul>
</div>
