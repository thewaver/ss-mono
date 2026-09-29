<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        AnchorUtils,
        CarrierUtils,
        type CarrierZone,
        type CarryMode,
        type InteractionFlags,
        type InteractionSizing,
        PlacementUtils,
        SORTABLE_DEFAULTS,
        type SortableItemFlags,
        SortableUtils,
        ViewportUtils,
        SortableStyles as styles,
    } from "@thewaver/ss-components";
    import type { Point2d, Size2d } from "@thewaver/ss-utils";

    import { CarrierSvelteUtils } from "../../Abstracts/Carrier/CarrierSvelte.utils.svelte.js";
    import { ElevationSvelteUtils } from "../../Abstracts/Elevation/ElevationSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { getViewportContext } from "../../Abstracts/Viewport/Viewport.context.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import { attachPortal } from "../../Utils/portalUtils.js";
    import { LabelSvelteUtils } from "../Input/Label/LabelSvelte.utils.svelte.js";
    import type { SortableItem, SortableProps } from "./Sortable.types.js";
    import SortableItemSlot from "./SortableItemSlot.svelte";

    const PLACED_SIZING: InteractionSizing = "fill";

    let { items = $bindable(), ref = $bindable(), ...props }: SortableProps<T> = $props();

    const listId = $props.id();
    const hintId = `${listId}-hint`;

    const viewportContext = getViewportContext();

    const itemRefs: Array<HTMLElement | undefined> = [];

    let root = $state<HTMLDivElement>();
    let box = $state<HTMLElement>();
    let focusedIndex = $state(0);
    let carriedPoint = $state<Point2d>();
    let carriedSize = $state<Size2d>();
    let markerOffset = $state<number>();
    let grabOffset = $state.raw<Point2d>({ x: 0, y: 0 });

    let hasPendingClick = false;

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);

    const isDisabled = $derived(props.isDisabled ?? false);
    const isLocked = $derived(props.isLocked ?? false);
    const orientation = $derived(props.orientation ?? SORTABLE_DEFAULTS.orientation);
    const gap = $derived(props.gap ?? SORTABLE_DEFAULTS.gap);
    const endRoom = $derived(gap * 0.5);
    const isHorizontal = $derived(orientation === "horizontal");

    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const getItemRects = () =>
        itemRefs
            .slice(0, items.length)
            .filter((element): element is HTMLElement => element !== undefined)
            .map((element) => element.getBoundingClientRect());

    const zone: CarrierZone = SortableUtils.createZone({
        getItems: () => items,
        updateItems: (update) => {
            items = update(items);
        },
        getGroupId: () => props.groupId,
        getLabel: () => props.ariaLabel,
        getRootRef: () => root ?? undefined,
        getBoxRef: () => box ?? undefined,
        getIsDisabled: () => isDisabled,
        getIsLocked: () => isLocked,
        getAnnouncements: () => props.announcements,
        getOrientation: () => orientation,
        getDirection,
        getLayout: () => layout,
        getItemRects,
        getSourceIndex: () =>
            SortableUtils.computeSourceIndex(CarrierUtils.getSourceZone(), CarrierUtils.getSourcePlace(), zone),
        getPlaceCount: () =>
            SortableUtils.computePlaceCount(items.length, CarrierUtils.getCarry(), CarrierUtils.getSourceZone(), zone),
        computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
        onTransfer: (transfer) => props.onTransfer?.(transfer),
    });

    CarrierSvelteUtils.registerZone(zone);

    const carry = $derived(CarrierSvelteUtils.getCarry());

    const sourceIndex = $derived(
        SortableUtils.computeSourceIndex(CarrierSvelteUtils.getSourceZone(), CarrierSvelteUtils.getSourcePlace(), zone),
    );

    const placeCount = $derived(
        SortableUtils.computePlaceCount(items.length, carry, CarrierSvelteUtils.getSourceZone(), zone),
    );

    const layout = $derived(props.computeLayout?.({ itemCount: placeCount }));
    const isPlaced = $derived(layout !== undefined);

    const isSource = $derived(CarrierSvelteUtils.getSourceZone() === zone);
    const isReceiving = $derived(CarrierSvelteUtils.getTargetZone() === zone);
    const carriedKey = $derived(isSource ? carry?.key : undefined);

    const landingIndex = $derived(
        SortableUtils.computeLandingIndex(
            CarrierSvelteUtils.getTargetZone(),
            CarrierSvelteUtils.getTargetPlace(),
            sourceIndex,
            zone,
        ),
    );

    const markerPlacement = $derived(
        layout === undefined || landingIndex === undefined
            ? undefined
            : PlacementUtils.getGapPlacement(layout.placements, landingIndex),
    );

    $effect(() => {
        const listRoot = root;
        const index = landingIndex;
        const markerOpts = { orientation, direction: getDirection(), scale: viewportContext.getScale() };

        items;

        untrack(() => {
            markerOffset =
                index === undefined || !listRoot
                    ? undefined
                    : SortableUtils.computeMarkerOffset(listRoot, getItemRects(), index, markerOpts);
        });
    });

    const navigable = $derived(SortableUtils.computeNavigableIndexes(items));
    const rovingIndex = $derived(SortableUtils.computeRovingIndex(navigable, focusedIndex));

    const getItemId = (index: number) => `${listId}-item-${index}`;

    const focusIndex = (index: number) => {
        focusedIndex = index;
        itemRefs[index]?.focus();
    };

    const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
        if (isDisabled) return;

        const item = items[index];

        if (!item || item.isDisabled) return;

        const rect = itemRefs[index]?.getBoundingClientRect();

        if (rect) {
            const pickUpGeometry = SortableUtils.computePickUp(rect, viewportContext, from);

            carriedSize = pickUpGeometry.size;
            grabOffset = pickUpGeometry.grabOffset;
            carriedPoint = pickUpGeometry.point;
        }

        CarrierUtils.start(
            zone,
            index,
            SortableUtils.computeCarry(
                item,
                props.groupId,
                props.computeItemKey(item.value),
                props.computeItemLabel(item.value),
            ),
            mode,
        );
    };

    const handlePointerDown = (index: number) => (e: PointerEvent) => {
        if (e.button !== 0 || isDisabled) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;
        if (CarrierUtils.getCarry()) return;

        const element = itemRefs[index];

        if (!element) return;

        CarrierUtils.dragFromPointer(
            element,
            e,
            (from) => pickUp(index, "drag", from),
            () => {
                hasPendingClick = true;
            },
        );
    };

    const handleClick = (index: number) => (e: MouseEvent) => {
        if (isDisabled) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;

        const action = SortableUtils.computeClickAction(
            CarrierUtils.getCarry() ? CarrierUtils.getCarryMode() : undefined,
        );

        if (action === "pickUp") {
            pickUp(index, "tap", { x: e.clientX, y: e.clientY });
            focusIndex(index);

            return;
        }

        if (action === undefined) return;

        if (action === "aimAndDrop") {
            const rect = itemRefs[index]?.getBoundingClientRect();

            if (rect) CarrierUtils.aimAtPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
        }

        CarrierUtils.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
        if (isDisabled) return;

        const action = SortableUtils.computeKeyAction(e.key, {
            index,
            isShifted: e.shiftKey,
            isCarrying: CarrierUtils.getCarry() !== undefined && CarrierUtils.getCarryMode() !== "drag",
            isPlaced,
            orientation,
            direction: getDirection(),
            navigable,
        });

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "cancel") CarrierUtils.end("cancel");
        if (action.kind === "drop") CarrierUtils.end("drop");
        if (action.kind === "pickUp") pickUp(index, "key");
        if (action.kind === "aimAtNextZone") CarrierUtils.aimAtNextZone(action.step);
        if (action.kind === "nudge") CarrierUtils.aimAtNudge(action.nudge);
        if (action.kind === "focus") focusIndex(action.index);
    };

    const handleRootClick = (e: MouseEvent) => {
        const current = CarrierUtils.getCarry();

        if (isDisabled || !current) return;

        const action = SortableUtils.computeClickAction(CarrierUtils.getCarryMode());

        if (action === undefined) return;
        if (e.target !== root) return;
        if (!zone.computeCanAccept(current) && !isSource) return;

        if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierUtils.end("drop");
    };

    $effect(() => {
        if (!isSource) {
            untrack(() => {
                carriedPoint = undefined;
                carriedSize = undefined;
            });

            return;
        }

        const trackPoint = (e: PointerEvent) => {
            carriedPoint = ViewportUtils.getAdjustedClientPoint({ x: e.clientX, y: e.clientY }, viewportContext);

            if (CarrierUtils.getCarryMode() !== "tap") return;

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
        };

        document.addEventListener("pointermove", trackPoint, true);

        return () => document.removeEventListener("pointermove", trackPoint, true);
    });

    $effect(() => {
        const listRoot = root;

        if (!listRoot) return;

        const swallowClick = (e: MouseEvent) => {
            if (!hasPendingClick) return;

            hasPendingClick = false;

            e.preventDefault();
            e.stopPropagation();
        };

        listRoot.addEventListener("click", swallowClick, true);

        return () => listRoot.removeEventListener("click", swallowClick, true);
    });

    $effect(() => {
        const length = items.length;

        if (focusedIndex < length) return;

        focusedIndex = Math.max(length - 1, 0);
    });

    $effect(() => {
        if (!isDisabled || !carry || CarrierSvelteUtils.getSourceZone() !== zone) return;

        untrack(() => CarrierUtils.end("cancel"));
    });

    $effect(() => () => {
        if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
    });

    const roleDescription = $derived(props.itemRoleDescription ?? SORTABLE_DEFAULTS.itemRoleDescription);

    const carriedItem = $derived(carry?.value as SortableItem<T> | undefined);

    const carriedZIndex = $derived(
        Math.max(AnchorUtils.getStackingBase(root ?? undefined), ElevationSvelteUtils.getBase(root ?? undefined)) + 1,
    );
</script>

{#snippet itemAt(item: SortableItem<T>, index: number, isItemPlaced: boolean)}
    <InteractionWrapper
        sizing={isItemPlaced ? PLACED_SIZING : isHorizontal ? "fit-content" : "fill"}
        isDisabled={item.isDisabled ?? false}
        isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
        isTabbable={rovingIndex === index}
        tooltipDefs={item.tooltipDefs}
        extraFlags={{
            isCarried: carriedKey === props.computeItemKey(item.value),
            isLandingBefore: landingIndex === index,
        }}
        bind:ref={() => itemRefs[index], (element) => (itemRefs[index] = element)}
    >
        {#snippet renderControl(attachElement, itemFlags)}
            {#snippet itemContent(contentFlags: InteractionFlags<SortableItemFlags>)}
                {@render props.renderItem(item, contentFlags)}
            {/snippet}
            <SortableItemSlot
                {attachElement}
                id={getItemId(index)}
                {hintId}
                label={props.computeItemLabel(item.value)}
                {roleDescription}
                position={index + 1}
                setSize={items.length}
                flags={itemFlags}
                renderContent={itemContent}
                onPointerDown={handlePointerDown(index)}
                onKeyDown={handleKeyDown(index)}
                onClick={handleClick(index)}
                onFocus={() => {
                    focusedIndex = index;
                }}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet listContent()}
    {#each items as item, index (index)}
        {@const placement = layout?.placements[index]}
        {#if placement}
            <PlacementItem {placement}>
                {@render itemAt(item, index, true)}
            </PlacementItem>
        {:else}
            {@render itemAt(item, index, false)}
        {/if}
    {/each}

    {#if props.renderMarker && markerPlacement}
        <PlacementItem placement={markerPlacement}>
            <div class={styles.sortableMarkerPlaced} aria-hidden="true">
                {@render props.renderMarker(orientation)}
            </div>
        </PlacementItem>
    {/if}
{/snippet}

<div id={hintId} class={styles.sortableHint}>
    {props.announcements.restingKeyHint}
</div>

<InteractionWrapper
    {...props}
    bind:ref
    sizing={layout !== undefined ? "fill" : (props.sizing ?? "fit-content")}
    extraFlags={{
        isCarrying: carry !== undefined,
        isReceiving,
        isSource,
        isEmpty: items.length < 1,
    }}
>
    {#snippet renderControl(attachElement)}
        <div
            bind:this={root}
            {@attach attachElement}
            {@attach (element) => on(element, "click", handleRootClick)}
            id={listId}
            class={isHorizontal ? styles.sortableRow : styles.sortableColumn}
            style:gap={`${gap}px`}
            style:padding={`${endRoom}px`}
            role="list"
            aria-label={getAriaLabel()}
            aria-disabled={isDisabled || undefined}
        >
            {#if layout}
                <PlacementBox bind:ref={box} {layout} computeEffect={props.computeEffect}>
                    {@render listContent()}
                </PlacementBox>
            {:else}
                {@render listContent()}
            {/if}

            {#if props.renderMarker && layout === undefined && markerOffset !== undefined}
                <div
                    class={isHorizontal ? styles.sortableMarkerRow : styles.sortableMarkerColumn}
                    style:left={isHorizontal ? `${markerOffset}px` : `${endRoom}px`}
                    style:top={isHorizontal ? `${endRoom}px` : `${markerOffset}px`}
                    style:bottom={isHorizontal ? `${endRoom}px` : undefined}
                    style:right={isHorizontal ? undefined : `${endRoom}px`}
                    aria-hidden="true"
                >
                    {@render props.renderMarker(orientation)}
                </div>
            {/if}
        </div>
    {/snippet}
</InteractionWrapper>

{#if props.renderCarried && isSource && carriedPoint}
    <div
        {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}
        class={styles.sortableCarried}
        style:transform={`translate(${carriedPoint.x - grabOffset.x}px, ${carriedPoint.y - grabOffset.y}px)`}
        style:width={`${carriedSize?.width ?? 0}px`}
        style:height={`${carriedSize?.height ?? 0}px`}
        style:z-index={carriedZIndex}
        aria-hidden="true"
    >
        {#if carriedItem}
            {@render props.renderCarried(carriedItem)}
        {/if}
    </div>
{/if}
