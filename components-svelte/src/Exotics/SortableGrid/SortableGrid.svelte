<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        AnchorUtils,
        CarrierUtils,
        type CarrierZone,
        type CarryMode,
        type InteractionFlags,
        SORTABLE_GRID_DEFAULTS,
        type SortableGridItemFlags,
        type SortableGridPlace,
        type SortableGridShape,
        type SortableGridSpot,
        SortableGridUtils,
        SortableUtils,
        ViewportUtils,
        SortableGridStyles as styles,
    } from "@thewaver/ss-components";
    import type { Point2d } from "@thewaver/ss-utils";

    import { CarrierSvelteUtils } from "../../Abstracts/Carrier/CarrierSvelte.utils.svelte.js";
    import { ElevationSvelteUtils } from "../../Abstracts/Elevation/ElevationSvelte.utils.svelte.js";
    import { getViewportContext } from "../../Abstracts/Viewport/Viewport.context.js";
    import { LabelSvelteUtils } from "../../Essentials/Input/Label/LabelSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { InteractionTooltipDefs } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
    import { attachPortal } from "../../Utils/portalUtils.js";
    import type { SortableGridController, SortableGridItem, SortableGridProps } from "./SortableGrid.types.js";
    import SortableGridItemSlot from "./SortableGridItemSlot.svelte";

    const NO_BLOCKED_SPOTS: SortableGridSpot[] = [];

    let { items = $bindable(), ref = $bindable(), ...props }: SortableGridProps<T> = $props();

    const gridId = $props.id();
    const hintId = `${gridId}-hint`;

    const viewportContext = getViewportContext();

    const itemRefs: Array<HTMLElement | undefined> = [];

    let root = $state<HTMLDivElement>();
    let focusedIndex = $state(0);
    let carriedPoint = $state<Point2d>();
    let grabOffset = $state.raw<Point2d>({ x: 0, y: 0 });

    let hasPendingClick = false;

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);

    const isDisabled = $derived(props.isDisabled ?? false);
    const isLocked = $derived(props.isLocked ?? false);
    const isTurnable = $derived(props.isTurnable ?? false);
    const gap = $derived(props.gap ?? SORTABLE_GRID_DEFAULTS.gap);

    const cells = $derived(SortableGridUtils.getSpots(props.columns, props.rows));
    const blockedSpots = $derived.by(() => {
        const computeIsSpotBlocked = props.computeIsSpotBlocked;

        return computeIsSpotBlocked === undefined
            ? NO_BLOCKED_SPOTS
            : cells.filter((spot) => computeIsSpotBlocked(spot));
    });

    const getSpan = (count: number) => SortableGridUtils.getSpan(count, props.cellSize, gap);
    const getOffset = (cell: number) => SortableGridUtils.getOffset(cell, props.cellSize, gap);
    const getGeometry = (shape: SortableGridShape) => SortableGridUtils.getGeometry(shape, props.cellSize, gap);

    const zone: CarrierZone = SortableGridUtils.createZone<T, InteractionTooltipDefs<SortableGridItemFlags>>({
        getZone: () => zone,
        getItems: () => items,
        updateItems: (update) => {
            items = update(items);
        },
        getGroupId: () => props.groupId,
        getLabel: () => props.ariaLabel,
        getRootRef: () => root ?? undefined,
        getIsDisabled: () => isDisabled,
        getIsLocked: () => isLocked,
        getIsTurnable: () => isTurnable,
        getAnnouncements: () => props.announcements,
        getColumns: () => props.columns,
        getRows: () => props.rows,
        getCellSize: () => props.cellSize,
        getGap: () => gap,
        getScale: () => viewportContext.getScale(),
        getBlockedSpots: () => blockedSpots,
        computeItemKey: (value) => props.computeItemKey(value),
        computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
        onTransfer: (transfer) => props.onTransfer?.(transfer),
    });

    CarrierSvelteUtils.registerZone(zone);

    const carry = $derived(CarrierSvelteUtils.getCarry());
    const isSource = $derived(carry !== undefined && CarrierSvelteUtils.getSourceZone() === zone);
    const isReceiving = $derived(carry !== undefined && CarrierSvelteUtils.getTargetZone() === zone);
    const carriedKey = $derived(isSource ? carry?.key : undefined);

    const turn = (step: number) => {
        if (!isTurnable || !isSource) return false;

        CarrierUtils.aimAtNudge({ turn: step });

        return true;
    };

    const controller: SortableGridController = {
        getIsCarrying: () => isSource,
        turnCw: () => turn(1),
        turnCcw: () => turn(-1),
        compact: () => {
            if (CarrierUtils.getCarry() && (isSource || isReceiving)) return false;

            const current = items;
            const compacted = SortableGridUtils.getCompacted(current, blockedSpots);

            if (compacted.every((item, index) => item === current[index])) return false;

            items = compacted;

            return true;
        },
    };

    const landingPlace = $derived(
        isReceiving ? (CarrierSvelteUtils.getTargetPlace() as SortableGridPlace | undefined) : undefined,
    );

    const landingGeometry = $derived(
        carry && landingPlace
            ? getGeometry(SortableGridUtils.getCarriedShape(carry, landingPlace.turns))
            : undefined,
    );

    const carriedItem = $derived(carry?.value as SortableGridItem<T> | undefined);

    const carriedGeometry = $derived(
        carry && isSource
            ? getGeometry(
                  SortableGridUtils.getCarriedShape(
                      carry,
                      SortableGridUtils.getAimedTurns(carry, CarrierSvelteUtils.getTargetPlace()),
                  ),
              )
            : undefined,
    );

    const boxes = $derived(items.map(SortableGridUtils.getItemBox));
    const navigable = $derived(SortableUtils.computeNavigableIndexes(items));
    const readingOrder = $derived(SortableGridUtils.getReadingOrder(boxes));
    const rovingIndex = $derived(SortableUtils.computeRovingIndex(navigable, focusedIndex));

    const getItemId = (index: number) => `${gridId}-item-${index}`;

    const focusIndex = (index: number) => {
        focusedIndex = index;
        itemRefs[index]?.focus();
    };

    const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
        if (isDisabled) return;

        const item = items[index];

        if (!item || item.isDisabled) return;

        const pickUpGeometry = SortableGridUtils.computePickUp(
            itemRefs[index]?.getBoundingClientRect(),
            viewportContext,
            SortableGridUtils.getItemShape(item),
            { cellSize: props.cellSize, gap, from },
        );

        grabOffset = pickUpGeometry.grabOffset;
        carriedPoint = pickUpGeometry.point;

        SortableGridUtils.grab(zone, pickUpGeometry.grabSpot);

        CarrierUtils.start(
            zone,
            { ...item.spot, turns: item.turns ?? 0 } satisfies SortableGridPlace,
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
        if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierUtils.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
        if (isDisabled) return;

        const action = SortableGridUtils.computeKeyAction(e.key, {
            index,
            isShifted: e.shiftKey,
            isCarrying: CarrierUtils.getCarry() !== undefined && CarrierUtils.getCarryMode() !== "drag",
            navigable,
            boxes,
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
        if (CarrierUtils.getCarryMode() === "drag") return;
        if (e.target !== root) return;
        if (!zone.computeCanAccept(current) && !isSource) return;

        if (CarrierUtils.getCarryMode() === "key") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierUtils.end("drop");
    };

    $effect(() => {
        if (!isSource) {
            untrack(() => {
                carriedPoint = undefined;
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
        const gridRoot = root;

        if (!gridRoot) return;

        const swallowClick = (e: MouseEvent) => {
            if (!hasPendingClick) return;

            hasPendingClick = false;

            e.preventDefault();
            e.stopPropagation();
        };

        gridRoot.addEventListener("click", swallowClick, true);

        return () => gridRoot.removeEventListener("click", swallowClick, true);
    });

    $effect(() => {
        const length = items.length;

        if (focusedIndex < length) return;

        focusedIndex = Math.max(length - 1, 0);
    });

    $effect(() => {
        if (!isDisabled || !isSource) return;

        untrack(() => CarrierUtils.end("cancel"));
    });

    $effect(() => () => {
        if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
    });

    $effect(() => untrack(() => props.onMount?.(controller)));

    const carriedZIndex = $derived(
        Math.max(AnchorUtils.getStackingBase(root ?? undefined), ElevationSvelteUtils.getBase(root ?? undefined)) + 1,
    );
</script>

<InteractionWrapper
    {...props}
    bind:ref
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
            id={gridId}
            class={styles.sortableGridRoot}
            style:width={`${SortableGridUtils.getExtent(props.columns, props.cellSize, gap)}px`}
            style:height={`${SortableGridUtils.getExtent(props.rows, props.cellSize, gap)}px`}
            role="list"
            aria-label={getAriaLabel()}
            aria-disabled={isDisabled || undefined}
        >
            {#if props.renderCell}
                <div
                    class={styles.sortableGridCells}
                    style:left={`${gap}px`}
                    style:top={`${gap}px`}
                    style:gap={`${gap}px`}
                    style:grid-template-columns={`repeat(${props.columns}, ${props.cellSize}px)`}
                    style:grid-auto-rows={`${props.cellSize}px`}
                    aria-hidden="true"
                >
                    {#each cells as spot}
                        <div class={styles.sortableGridCell}>
                            {@render props.renderCell?.(spot, {
                                isBlocked: props.computeIsSpotBlocked?.(spot) ?? false,
                            })}
                        </div>
                    {/each}
                </div>
            {/if}

            {#each items as item, index (index)}
                {@const geometry = getGeometry(SortableGridUtils.getItemShape(item))}
                <div
                    class={styles.sortableGridSlot}
                    style:left={`${getOffset(item.spot.col)}px`}
                    style:top={`${getOffset(item.spot.row)}px`}
                    style:width={`${getSpan(geometry.size.colCount)}px`}
                    style:height={`${getSpan(geometry.size.rowCount)}px`}
                >
                    <InteractionWrapper
                        sizing="fill"
                        isDisabled={item.isDisabled ?? false}
                        isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
                        isTabbable={rovingIndex === index}
                        tooltipDefs={item.tooltipDefs}
                        extraFlags={{ isCarried: carriedKey === props.computeItemKey(item.value) }}
                        bind:ref={() => itemRefs[index], (element) => (itemRefs[index] = element)}
                    >
                        {#snippet renderControl(attachItemElement, itemFlags)}
                            {#snippet itemContent(contentFlags: InteractionFlags<SortableGridItemFlags>)}
                                {@render props.renderItem(item, contentFlags, geometry)}
                            {/snippet}
                            <SortableGridItemSlot
                                attachElement={attachItemElement}
                                id={getItemId(index)}
                                {hintId}
                                label={SortableGridUtils.computeItemLabel(props.computeItemLabel(item.value), item)}
                                position={readingOrder.indexOf(index) + 1}
                                setSize={items.length}
                                cells={geometry.cells}
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
                </div>
            {/each}

            {#if props.renderLanding && landingPlace}
                <div
                    class={styles.sortableGridLanding}
                    style:left={`${getOffset(landingPlace.col)}px`}
                    style:top={`${getOffset(landingPlace.row)}px`}
                    style:width={`${getSpan(landingGeometry?.size.colCount ?? 1)}px`}
                    style:height={`${getSpan(landingGeometry?.size.rowCount ?? 1)}px`}
                    aria-hidden="true"
                >
                    {#if landingGeometry}
                        {@render props.renderLanding(CarrierSvelteUtils.getIsTargetAllowed(), landingGeometry)}
                    {/if}
                </div>
            {/if}
            <div id={hintId} class={styles.sortableGridHint}>
                {props.announcements.restingKeyHint}
            </div>
        </div>
    {/snippet}
</InteractionWrapper>

{#if props.renderCarried && isSource && carriedPoint}
    <div
        {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}
        class={styles.sortableGridCarried}
        style:transform={`translate(${carriedPoint.x - grabOffset.x}px, ${carriedPoint.y - grabOffset.y}px)`}
        style:width={`${getSpan(carriedGeometry?.size.colCount ?? 1)}px`}
        style:height={`${getSpan(carriedGeometry?.size.rowCount ?? 1)}px`}
        style:z-index={carriedZIndex}
        aria-hidden="true"
    >
        {#if carriedItem && carriedGeometry}
            {@render props.renderCarried(carriedItem, carriedGeometry)}
        {/if}
    </div>
{/if}
