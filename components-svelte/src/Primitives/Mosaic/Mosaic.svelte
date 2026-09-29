<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import { MOSAIC_DEFAULTS, MosaicUtils, NavigatorUtils, MosaicStyles as styles } from "@thewaver/ss-components";
    import type { Rect } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { MediaQueryMonitorSvelteUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { MosaicProps } from "./Mosaic.types.js";
    import MosaicTile from "./MosaicTile.svelte";

    const NOT_PLACED = -1;
    const NO_TRANSITION_MS = 0;

    let props: MosaicProps = $props();

    const sizeAnchor = $derived(props.sizeAnchor ?? MOSAIC_DEFAULTS.sizeAnchor);
    const gap = $derived(props.gap ?? MOSAIC_DEFAULTS.gap);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? MOSAIC_DEFAULTS.transitionDurationMs);
    const isWalked = $derived(props.onActivate !== undefined);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion(
        () => transitionDurationMs <= NO_TRANSITION_MS,
    );

    const glideDurationMs = $derived(getPrefersReducedMotion() ? NO_TRANSITION_MS : transitionDurationMs);

    let root = $state<HTMLDivElement>();
    let focusedSlot = $state.raw<object>();

    const buttonRefs = new Map<object, HTMLElement>();
    const slotIds = new WeakMap<object, number>();
    const assignSlots = MosaicUtils.createSlotKeeper();

    let nextSlotId = 0;
    let refocusTarget: HTMLElement | undefined;

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root);

    const anchoredExtent = $derived(sizeAnchor === "width" ? getRootSize().width : getRootSize().height);

    const layout = $derived(
        MosaicUtils.computeLayout({
            sizes: props.sizes,
            anchoredExtent,
            sizeAnchor,
            gap,
            computePlacements: props.computePlacements,
        }),
    );

    let lastAnchoredExtent: number | undefined;

    const isRepack = $derived.by(() => {
        const extent = layout.anchoredExtent;
        const isSameExtent = lastAnchoredExtent === extent;

        lastAnchoredExtent = extent;

        return isSameExtent;
    });

    const rectByIndex = $derived(new Map(layout.placements.map((placement) => [placement.index, placement as Rect])));

    const keys = $derived(props.keys ?? props.sizes.map((_, index) => index));

    const slots = $derived(assignSlots(keys));

    const indexBySlot = $derived(new Map(slots.map((slot, index) => [slot, index])));

    let lastSlotOrder: object[] = [];

    const slotOrder = $derived.by(() => {
        const next = MosaicUtils.computeOrder(layout.placements, props.sizes.length).flatMap(
            (index) => slots[index] ?? [],
        );

        if (MosaicUtils.getIsSameList(lastSlotOrder, next)) return lastSlotOrder;

        lastSlotOrder = next;

        return next;
    });

    const rovingIndex = $derived.by(() => {
        const index = focusedSlot === undefined ? undefined : indexBySlot.get(focusedSlot);

        if (index !== undefined && rectByIndex.has(index)) return index;

        return layout.placements[0]?.index;
    });

    $effect.pre(() => {
        slotOrder;

        untrack(() => {
            const active = document.activeElement;

            refocusTarget = active instanceof HTMLElement && root?.contains(active) ? active : undefined;
        });
    });

    watchChange(
        () => slotOrder,
        () => {
            const target = refocusTarget;

            refocusTarget = undefined;

            if (target?.isConnected && document.activeElement !== target) target.focus({ preventScroll: true });
        },
    );

    const getSlotId = (slot: object) => {
        const known = slotIds.get(slot);

        if (known !== undefined) return known;

        const id = nextSlotId++;

        slotIds.set(slot, id);

        return id;
    };

    const attachButton =
        (slot: object): Attachment<HTMLElement> =>
        (element) => {
            buttonRefs.set(slot, element);

            return () => {
                if (buttonRefs.get(slot) === element) buttonRefs.delete(slot);
            };
        };

    const focusIndex = (index: number) => {
        const slot = slots[index];

        if (slot === undefined) return;

        focusedSlot = slot;
        buttonRefs.get(slot)?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isWalked || rovingIndex === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            props.onActivate?.(rovingIndex);

            return;
        }

        const step = MosaicUtils.getStepForKey(e.key);

        if (step === undefined) return;

        const next = MosaicUtils.computeStepIndex(step, rovingIndex, layout.placements);

        if (next === undefined) return;

        e.preventDefault();
        focusIndex(next);
    };
</script>

<div
    bind:this={root}
    class={styles.mosaicRoot}
    style={toStyle(MosaicUtils.computeRootSize(sizeAnchor, layout.freeExtent))}
    role={isWalked ? "list" : undefined}
    aria-label={isWalked ? props.ariaLabel : undefined}
    onkeydown={handleKeyDown}
>
    {#each slotOrder as slot, readingIndex (getSlotId(slot))}
        {@const index = indexBySlot.get(slot) ?? NOT_PLACED}
        <MosaicTile
            {index}
            {readingIndex}
            itemCount={props.sizes.length}
            rect={rectByIndex.get(index)}
            isItemSized={props.isItemSized}
            {isWalked}
            isTabStop={index === rovingIndex}
            {isRepack}
            {glideDurationMs}
            renderItem={props.renderItem}
            attachButton={attachButton(slot)}
            onFocusSlot={() => {
                focusedSlot = slot;
            }}
            onActivate={(activated) => props.onActivate?.(activated)}
        />
    {/each}
</div>
