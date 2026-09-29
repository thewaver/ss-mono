<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        CarrierUtils,
        type CarryMode,
        type InteractionFlags,
        LiveAnnouncerUtils,
        TIMELINE_DEFAULTS,
        type TimelineEdge,
        type TimelineItemRenderProps,
        type TimelineSpan,
        TimelineUtils,
        TimelineStyles as styles,
    } from "@thewaver/ss-components";
    import type { Point2d } from "@thewaver/ss-utils";

    import { CarrierSvelteUtils } from "../../Abstracts/Carrier/CarrierSvelte.utils.svelte.js";
    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { TimelineController, TimelineProps } from "./Timeline.types.js";
    import TimelineItem from "./TimelineItem.svelte";

    const DEFAULT_FOCUS_RATIO = 0.5;
    const MIN_VIEW_SHARE = 0.001;
    const PERCENT = 100;
    const NOTHING = 0;
    const FIRST_ARIA_POSITION = 1;
    const ROVING_TAB_INDEX = 0;
    const NO_MARKERS: number[] = [];
    const DEFAULT_EDGE: TimelineEdge = "end";

    const getIsSameSpan = (a: TimelineSpan, b: TimelineSpan) => a.start === b.start && a.end === b.end;

    let { view: storedView = $bindable(), ...props }: TimelineProps<T> = $props();

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    const timelineId = $props.id();
    const hintId = `${timelineId}-hint`;

    const itemRefs = new Map<number, HTMLElement>();

    let root = $state<HTMLDivElement>();
    let focusedIndex = $state<number>();
    let heldEdge = $state<TimelineEdge>(DEFAULT_EDGE);

    let isFocusFollowing = false;
    let edgeGrabOffset = NOTHING;

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root);

    const range = $derived(props.range);
    const minViewExtent = $derived(props.minViewExtent ?? TimelineUtils.getExtent(range) * MIN_VIEW_SHARE);

    const rawView = $derived(storedView ?? range);

    let lastView: TimelineSpan | undefined;

    const view = $derived.by(() => {
        const next = TimelineUtils.clampView(rawView, range, minViewExtent);

        if (lastView && getIsSameSpan(lastView, next)) return lastView;

        lastView = next;

        return next;
    });

    const items = $derived(props.items);
    const spans = $derived(items.map((item, index) => props.computeSpan(item, index)));

    const lanes = $derived.by(() => {
        const computeLane = props.computeLane;

        return computeLane === undefined
            ? TimelineUtils.packLanes(spans)
            : items.map((item, index) => computeLane(item, index));
    });

    const laneCount = $derived(props.laneCount ?? TimelineUtils.computeLaneCount(lanes));
    const laneGap = $derived(props.laneGap ?? TIMELINE_DEFAULTS.laneGap);
    const axisSize = $derived(props.axisSize ?? TIMELINE_DEFAULTS.axisSize);
    const height = $derived(TimelineUtils.computeHeight(axisSize, laneCount, props.laneSize, laneGap));

    const isDisabled = $derived(props.isDisabled ?? false);

    const getIsItemDisabled = (index: number) =>
        isDisabled || (props.computeIsItemDisabled?.(items[index], index) ?? false);

    const isEditable = $derived(props.onSpanChange !== undefined && !isDisabled);
    const edgeAnnouncements = $derived(props.edgeAnnouncements ?? TIMELINE_DEFAULTS.edgeAnnouncements);
    const edgeGrabSize = $derived(props.edgeGrabSize ?? TIMELINE_DEFAULTS.edgeGrabSize);
    const isPannable = $derived((props.isPannable ?? true) && !isDisabled);
    const isZoomable = $derived((props.isZoomable ?? true) && !isDisabled);

    const steps = $derived(
        TimelineUtils.chooseSteps(
            TimelineUtils.getExtent(view),
            getSize().width,
            props.minTickGap ?? TIMELINE_DEFAULTS.minTickGap,
            props.tickSteps,
        ),
    );

    const getPointerRatio = (clientX: number) =>
        TimelineUtils.computePointerRatio(clientX, root?.getBoundingClientRect());

    const zone = TimelineUtils.createEdgeZone({
        getGroupId: () => timelineId,
        getLabel: () => props.ariaLabel ?? "",
        getRootRef: () => root ?? undefined,
        getIsEditable: () => isEditable,
        getAnnouncements: () => edgeAnnouncements,
        getHeldEdge: () => heldEdge,
        getGrabOffset: () => edgeGrabOffset,
        getView: () => view,
        getRange: () => range,
        getSpans: () => spans,
        getStep: () => steps.step,
        computePointerRatio: getPointerRatio,
        get computeSnapValue() {
            return props.computeSnapValue;
        },
        onSpanChange: (index, span) => props.onSpanChange?.(items[index], index, span),
    });

    CarrierSvelteUtils.registerZone(zone);

    const edgeCarry = $derived(CarrierSvelteUtils.getSourceZone() === zone ? CarrierSvelteUtils.getCarry() : undefined);
    const heldIndex = $derived(TimelineUtils.getCarriedIndex(edgeCarry));

    const shownSpans = $derived(
        TimelineUtils.computeShownSpans(
            spans,
            heldIndex,
            CarrierSvelteUtils.getTargetPlace() as TimelineSpan | undefined,
        ),
    );

    const order = $derived(TimelineUtils.computeOrder(spans, lanes));
    const placements = $derived(TimelineUtils.computePlacements(shownSpans, lanes, order, view));
    const stops = $derived(
        TimelineUtils.computeStops(
            spans,
            lanes,
            order,
            items.map((_unused, index) => getIsItemDisabled(index)),
        ),
    );
    const rovingIndex = $derived(TimelineUtils.computeRovingIndex(stops, focusedIndex));
    const placementMap = $derived(new Map(placements.map((placement) => [placement.index, placement])));
    const renderedIndices = $derived(TimelineUtils.computeRenderedIndices(placements, rovingIndex));
    const ticks = $derived(TimelineUtils.computeTicks(view, steps));
    const markers = $derived(TimelineUtils.computeMarkers(props.markers ?? NO_MARKERS, view));

    const setView = (next: TimelineSpan) => {
        const clamped = TimelineUtils.clampView(next, range, minViewExtent);

        if (getIsSameSpan(clamped, view)) return false;

        storedView = clamped;

        return true;
    };

    const controller: TimelineController = {
        getView: () => view,
        zoomBy: (factor, focusRatio) =>
            setView(TimelineUtils.zoomView(view, factor, focusRatio ?? DEFAULT_FOCUS_RATIO, range, minViewExtent)),
        panBy: (ratio) => setView(TimelineUtils.panView(view, ratio, range)),
        showSpan: (span) => setView(TimelineUtils.revealView(span, view, range)),
    };

    $effect(() => untrack(() => props.onMount?.(controller)));

    const gestures = TimelineUtils.createGestureTracker({
        getIsPannable: () => isPannable,
        getIsZoomable: () => isZoomable,
        getWidth: () => getSize().width,
        computePointerRatio: getPointerRatio,
        zoomBy: (factor, focusRatio) => controller.zoomBy(factor, focusRatio),
        panBy: (ratio) => controller.panBy(ratio),
    });

    $effect(() => {
        const index = rovingIndex;

        renderedIndices;

        untrack(() => {
            const element = index === undefined ? undefined : itemRefs.get(index);

            if (!isFocusFollowing || element === undefined) return;

            isFocusFollowing = false;
            element.tabIndex = ROVING_TAB_INDEX;
            element.focus();
        });
    });

    const getEdgeCarry = () => (CarrierUtils.getSourceZone() === zone ? CarrierUtils.getCarry() : undefined);

    const moveTo = (index: number) => {
        isFocusFollowing = root?.contains(document.activeElement) ?? false;

        focusedIndex = index;
        setView(TimelineUtils.revealView(spans[index], view, range));
    };

    const activateItem = (index: number) => {
        if (getIsItemDisabled(index)) return;

        focusedIndex = index;
        props.onItemActivate?.(items[index], index);
    };

    const focusItem = (index: number) => {
        const element = itemRefs.get(index);

        focusedIndex = index;

        if (element === undefined) return;

        element.tabIndex = ROVING_TAB_INDEX;
        element.focus();
    };

    const pickUpEdge = (index: number, edge: TimelineEdge, mode: CarryMode, from?: Point2d) => {
        if (!isEditable || getIsItemDisabled(index)) return;

        const span = spans[index];

        edgeGrabOffset =
            from === undefined ? NOTHING : TimelineUtils.toValue(getPointerRatio(from.x), view) - span[edge];

        heldEdge = edge;

        CarrierUtils.start(
            zone,
            span,
            TimelineUtils.computeEdgeCarry(timelineId, index, props.computeItemAriaLabel?.(items[index], index) ?? ""),
            mode,
        );
    };

    const revealHeldEdge = () => {
        const place = CarrierUtils.getTargetPlace() as TimelineSpan | undefined;

        if (place === undefined) return;

        const value = place[heldEdge];

        setView(TimelineUtils.revealView({ start: value, end: value }, view, range));
    };

    const holdEdge = (edge: TimelineEdge) => {
        const carry = getEdgeCarry();
        const place = CarrierUtils.getTargetPlace();

        if (!carry || place === undefined || edge === heldEdge) return;

        heldEdge = edge;

        LiveAnnouncerUtils.announce(
            edgeAnnouncements.computeAimed(zone.computePlaceLabel(place, carry), zone.getLabel()),
        );
    };

    const handleEdgePointerDown = (index: number, edge: TimelineEdge, e: PointerEvent) => {
        if (!TimelineUtils.getIsPrimaryPress(e)) return;

        e.stopPropagation();

        if (!root || CarrierUtils.getCarry()) return;

        CarrierUtils.dragFromPointer(root, e, (from) => pickUpEdge(index, edge, "drag", from));
    };

    const handleEdgeClick = (index: number, edge: TimelineEdge, e: MouseEvent) => {
        e.stopPropagation();

        if (CarrierUtils.getCarry()) return;

        pickUpEdge(index, edge, "tap");
        focusItem(index);
    };

    const handleFocusOut = (e: FocusEvent) => {
        if (!getEdgeCarry() || CarrierUtils.getCarryMode() !== "key") return;
        if (root?.contains(e.relatedTarget as Node | null)) return;

        CarrierUtils.end("cancel");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = rovingIndex;

        if (from === undefined || isDisabled) return;

        const action = TimelineUtils.computeKeyAction(e.key, {
            isHolding: !!getEdgeCarry() && CarrierUtils.getCarryMode() !== "drag",
            isEditable,
        });

        if (action === undefined || action.kind === "ignore") return;

        if (action.kind === "step") {
            const next = TimelineUtils.computeStepIndex(action.step, from, stops);

            if (next === undefined) return;

            e.preventDefault();
            moveTo(next);

            return;
        }

        e.preventDefault();

        if (action.kind === "cancel") CarrierUtils.end("cancel");
        if (action.kind === "drop") CarrierUtils.end("drop");
        if (action.kind === "hold") pickUpEdge(from, "end", "key");
        if (action.kind === "activate") activateItem(from);

        if (action.kind !== "aim") return;

        if (action.edge !== undefined) holdEdge(action.edge);
        if (action.nudge !== undefined) CarrierUtils.aimAtNudge({ x: action.nudge });

        revealHeldEdge();
    };

    const isEdgeCarried = $derived(edgeCarry !== undefined);

    $effect(() => {
        const element = root;

        if (!element) return;

        const handleWheel = (e: WheelEvent) => gestures.wheel(e);

        element.addEventListener("wheel", handleWheel, { passive: false });

        return () => element.removeEventListener("wheel", handleWheel);
    });

    $effect(() => {
        if (!isEdgeCarried) return;

        const trackPoint = (e: PointerEvent) => {
            if (CarrierUtils.getCarryMode() !== "tap") return;

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
        };

        document.addEventListener("pointermove", trackPoint, true);

        return () => document.removeEventListener("pointermove", trackPoint, true);
    });

    $effect(() => {
        const element = root;

        if (!element) return;

        const dropAtClick = (e: MouseEvent) => {
            if (CarrierUtils.getSourceZone() !== zone || !CarrierUtils.getCarry()) return;
            if (CarrierUtils.getCarryMode() === "drag") return;

            e.preventDefault();
            e.stopPropagation();

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
            CarrierUtils.end("drop");
        };

        element.addEventListener("click", dropAtClick, true);

        return () => element.removeEventListener("click", dropAtClick, true);
    });

    $effect(() => {
        if (isEditable || !isEdgeCarried) return;

        untrack(() => CarrierUtils.end("cancel"));
    });

    $effect(() => () => {
        if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
    });

    const setItemRef = (index: number, element: HTMLElement | undefined) => {
        if (element) itemRefs.set(index, element);
        else itemRefs.delete(index);
    };
</script>

{#snippet itemAt(index: number)}
    {@const placement = placementMap.get(index) ?? TimelineUtils.getBlankPlacement(index)}
    {@const box = TimelineUtils.computeItemBox(placement, axisSize, props.laneSize, laneGap)}
    {@const isItemDisabled = getIsItemDisabled(index)}
    <li
        class={styles.timelineItem}
        style:left={`${box.left}%`}
        style:width={`${box.width}%`}
        style:top={`${box.top}px`}
        style:height={`${box.height}px`}
        aria-posinset={placement.order + FIRST_ARIA_POSITION}
        aria-setsize={items.length}
    >
        <InteractionWrapper
            sizing="fill"
            isDisabled={isItemDisabled}
            isTabbable={index === rovingIndex}
            extraFlags={{
                index,
                placement,
                span: shownSpans[index],
                isFocused: focusedIndex === index,
                heldEdge: heldIndex === index ? heldEdge : undefined,
            }}
            bind:ref={() => itemRefs.get(index), (element) => setItemRef(index, element)}
        >
            {#snippet renderControl(attachElement, flags)}
                {#snippet itemContent(itemFlags: InteractionFlags<TimelineItemRenderProps>)}
                    {@render props.renderItem(items[index], itemFlags)}
                {/snippet}
                <TimelineItem
                    id={`${timelineId}-item-${index}`}
                    {attachElement}
                    ariaLabel={props.computeItemAriaLabel?.(items[index], index)}
                    ariaDescribedBy={isEditable ? hintId : undefined}
                    {flags}
                    renderContent={itemContent}
                    onActivate={() => activateItem(index)}
                    onFocused={() => {
                        focusedIndex = index;
                    }}
                />
            {/snippet}
        </InteractionWrapper>

        {#if isEditable && !isItemDisabled}
            <div
                class={styles.timelineEdge}
                style:left={`${-edgeGrabSize * 0.5}px`}
                style:width={`${edgeGrabSize}px`}
                aria-hidden="true"
                onpointerdown={(e) => handleEdgePointerDown(index, "start", e)}
                onclick={(e) => handleEdgeClick(index, "start", e)}
            ></div>

            <div
                class={styles.timelineEdge}
                style:right={`${-edgeGrabSize * 0.5}px`}
                style:width={`${edgeGrabSize}px`}
                aria-hidden="true"
                onpointerdown={(e) => handleEdgePointerDown(index, "end", e)}
                onclick={(e) => handleEdgeClick(index, "end", e)}
            ></div>
        {/if}
    </li>
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    {@attach (element) => on(element, "pointerdown", (e) => gestures.press(e))}
    {@attach (element) => on(element, "pointermove", (e) => gestures.move(e, e.currentTarget))}
    {@attach (element) => on(element, "pointerup", (e) => gestures.release(e, e.currentTarget))}
    {@attach (element) => on(element, "pointercancel", (e) => gestures.release(e, e.currentTarget))}
    id={timelineId}
    class={styles.timelineRoot}
    style:height={`${height}px`}
    style:touch-action={isPannable || isZoomable ? "pan-y" : undefined}
    onfocusout={handleFocusOut}
>
    <div class={styles.timelineTicks} aria-hidden="true">
        {#each ticks as tick}
            <div class={styles.timelineTick} style:left={`${tick.ratio * PERCENT}%`}>
                {@render props.renderTick?.(tick)}
            </div>
        {/each}
    </div>

    {#if isEditable}
        <div id={hintId} class={styles.timelineHint}>
            {edgeAnnouncements.restingKeyHint}
        </div>
    {/if}

    <ul class={styles.timelineList} role="list" aria-label={props.ariaLabel}>
        {#each renderedIndices as index (index)}
            {@render itemAt(index)}
        {/each}
    </ul>

    <div class={styles.timelineMarkers} aria-hidden="true">
        {#each markers as marker, index}
            <div class={styles.timelineMarker} style:left={`${marker.ratio * PERCENT}%`}>
                {@render props.renderMarker?.(marker, index)}
            </div>
        {/each}
    </div>
</div>
