<script lang="ts">
    import { on } from "svelte/events";

    import { Button, SortableGrid } from "@thewaver/ss-components-svelte";
    import type {
        InteractionFlags,
        SortableGridController,
        SortableGridGeometry,
        SortableGridItem,
        SortableGridItemFlags,
        SortableGridSpot,
    } from "@thewaver/ss-components-svelte";
    import { SORTABLE_GRID_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
    import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageSortableGridCell from "../../../StyledComponents/SortableGridContent/PageSortableGridCell.svelte";
    import PageSortableGridItemContent from "../../../StyledComponents/SortableGridContent/PageSortableGridItemContent.svelte";
    import PageSortableGridLanding from "../../../StyledComponents/SortableGridContent/PageSortableGridLanding.svelte";
    import PageSortableGridSurface from "../../../StyledComponents/SortableGridContent/PageSortableGridSurface.svelte";
    import type { SortableGridPaint } from "../../../StyledComponents/SortableGridContent/SortableGridContent.types";
    import {
        CELL_SIZE,
        GRID_GAP,
        PACK_COLUMNS,
        PACK_ROWS,
        computeGearHue,
        computeGearKey,
        computeGearLabel,
    } from "../SortableGridPage.const";

    type Props = {
        groupId: string;
        items: SortableGridItem<Gear>[];
        ariaLabel: string;
        emptyText: string;
        columns?: number;
        rows?: number;
        paint?: SortableGridPaint;
        isDisabled?: boolean;
        isLocked?: boolean;
        isTurnable?: boolean;
        hasTurnButtons?: boolean;
        hasTidyButton?: boolean;
        isCompacting?: boolean;
        computeCanAccept?: (value: Gear, fromLabel: string) => boolean;
        computeIsSpotBlocked?: (spot: SortableGridSpot) => boolean;
    };

    const RESTING_FLAGS: InteractionFlags<SortableGridItemFlags> = { isCarried: false };

    const TURN_KEY = "r";

    let { items = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<SortableGridController>();

    const isCarrying = $derived(controller?.getIsCarrying() ?? false);

    const isTurnable = $derived(props.isTurnable ?? false);

    const turn = (step: number) => {
        if (step > 0) controller?.turnCw();
        else controller?.turnCcw();
    };

    const handleMount = (mounted: SortableGridController) => {
        controller = mounted;

        if (props.isCompacting) mounted.compact();
    };

    $effect(() => {
        if (!isTurnable) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!controller?.getIsCarrying() || e.key.toLowerCase() !== TURN_KEY) return;

            e.preventDefault();
            turn(e.shiftKey ? -1 : 1);
        };

        const handleWheel = (e: WheelEvent) => {
            if (!controller?.getIsCarrying()) return;

            e.preventDefault();
            turn(e.deltaY > 0 ? 1 : -1);
        };

        const offKeyDown = on(window, "keydown", handleKeyDown);
        const offWheel = on(window, "wheel", handleWheel, { passive: false });

        return () => {
            offKeyDown();
            offWheel();
        };
    });
</script>

{#snippet renderGear(
    item: SortableGridItem<Gear>,
    flags: InteractionFlags<SortableGridItemFlags>,
    geometry: SortableGridGeometry,
)}
    <PageSortableGridItemContent
        {flags}
        {geometry}
        glyph={item.value.glyph}
        name={item.value.name}
        paint={props.paint ?? "contour"}
        hue={computeGearHue(item.value)}
    />
{/snippet}

<div class={styles.sortableGridStack}>
    {#if props.hasTurnButtons}
        <div class={styles.sortableGridTurnControls}>
            <Button ariaLabel={"Turn counterclockwise"} isDisabled={!isCarrying} onClick={() => turn(-1)}>
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{"↺"}</PageButtonContent>
                {/snippet}
            </Button>

            <Button ariaLabel={"Turn clockwise"} isDisabled={!isCarrying} onClick={() => turn(1)}>
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{"↻"}</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    {/if}

    {#if props.hasTidyButton}
        <div class={styles.sortableGridTurnControls}>
            <Button
                ariaLabel={"Tidy up"}
                onClick={() => {
                    controller?.compact();
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{"Tidy up"}</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    {/if}

    <SortableGrid
        groupId={props.groupId}
        ariaLabel={props.ariaLabel}
        announcements={SORTABLE_GRID_ANNOUNCEMENTS}
        columns={props.columns ?? PACK_COLUMNS}
        rows={props.rows ?? PACK_ROWS}
        cellSize={CELL_SIZE}
        gap={GRID_GAP}
        isDisabled={props.isDisabled ?? false}
        isLocked={props.isLocked ?? false}
        {isTurnable}
        bind:items
        computeItemKey={computeGearKey}
        computeItemLabel={computeGearLabel}
        computeCanAccept={props.computeCanAccept}
        computeIsSpotBlocked={props.computeIsSpotBlocked}
        renderItem={renderGear}
        onTransfer={() => {
            if (props.isCompacting) controller?.compact();
        }}
        onMount={handleMount}
    >
        {#snippet renderCarried(item, geometry)}
            {@render renderGear(item, RESTING_FLAGS, geometry)}
        {/snippet}

        {#snippet renderCell(spot, flags)}
            <PageSortableGridCell {spot} isBlocked={flags.isBlocked} />
        {/snippet}

        {#snippet renderLanding(isAllowed, geometry)}
            <PageSortableGridLanding {isAllowed} {geometry} />
        {/snippet}

        {#snippet renderDecoration(flags)}
            <PageSortableGridSurface {flags} emptyText={props.emptyText} />
        {/snippet}
    </SortableGrid>
</div>
