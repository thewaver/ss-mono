<script lang="ts">
    import { SortableGridUtils } from "@thewaver/ss-components-svelte";
    import type { SortableGridItem, SortableItem } from "@thewaver/ss-components-svelte";
    import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import InventoryExample from "./Examples/Inventory.svelte";
    import LootExample from "./Examples/Loot.svelte";
    import PairExample from "./Examples/Pair.svelte";
    import {
        ARROWS,
        ARROW_IDS,
        LOOT,
        PACK,
        PACK_COLUMNS,
        PACK_ROWS,
        SCATTERED,
        STASH,
        STASH_COLUMNS,
        STASH_ROWS,
        TURNS,
        TURNS_COLUMNS,
        TURNS_ROWS,
        computeIsWall,
    } from "./SortableGridPage.const";

    const EXAMPLES_ROOT = "/src/App/Pages/SortableGridPage/Examples";

    const filled = (items: SortableGridItem<Gear>[]) =>
        items.reduce((cells, item) => cells + SortableGridUtils.getItemShape(item).cells.length, 0);

    const room = (items: SortableGridItem<Gear>[], columns: number, rows: number) =>
        `${columns * rows - filled(items)} of ${columns * rows} cells free`;

    const spots = (items: SortableGridItem<Gear>[]) =>
        items.map((item) => `${item.value.name} at ${item.spot.col + 1},${item.spot.row + 1}`).join(" | ") || "empty";

    let pack = $state.raw<SortableGridItem<Gear>[]>(PACK);

    let pairPack = $state.raw<SortableGridItem<Gear>[]>(PACK);
    let stash = $state.raw<SortableGridItem<Gear>[]>(STASH);

    let turns = $state.raw<SortableGridItem<Gear>[]>(TURNS);

    let cellsPack = $state.raw<SortableGridItem<Gear>[]>(PACK);

    let pickyPack = $state.raw<SortableGridItem<Gear>[]>(PACK);
    let quiver = $state.raw<SortableGridItem<Gear>[]>(ARROWS);

    let lockedPack = $state.raw<SortableGridItem<Gear>[]>(PACK);
    let lockedStash = $state.raw<SortableGridItem<Gear>[]>(STASH);

    let loot = $state.raw<SortableItem<Gear>[]>(LOOT);
    let lootPack = $state.raw<SortableGridItem<Gear>[]>(PACK);

    let disabled = $state.raw<SortableGridItem<Gear>[]>(PACK);

    let walled = $state.raw<SortableGridItem<Gear>[]>(SCATTERED);

    let dashboard = $state.raw<SortableGridItem<Gear>[]>(PACK);

    const examples: ExampleDefs[] = [
        {
            key: "pack",
            name: "One grid",
            readout: () =>
                `${room(pack, PACK_COLUMNS, PACK_ROWS)} — the page binds R and Shift with R to the two turn commands, and the wheel to the same pair`,
            component: packExample,
            path: `${EXAMPLES_ROOT}/Inventory.svelte`,
        },
        {
            key: "turns",
            name: "An L turns two ways",
            readout: () =>
                `${spots(turns)} — clockwise puts the hook's arm where the flint is and is refused, counterclockwise fits`,
            component: turnsExample,
            path: `${EXAMPLES_ROOT}/Inventory.svelte`,
        },
        {
            key: "cells",
            name: "Painted cell by cell",
            readout: () =>
                `${room(cellsPack, PACK_COLUMNS, PACK_ROWS)} — the same items, drawn as their own squares instead of one clipped shape`,
            component: cellsExample,
            path: `${EXAMPLES_ROOT}/Inventory.svelte`,
        },
        {
            key: "pair",
            name: "Between two grids",
            readout: () =>
                `pack: ${room(pairPack, PACK_COLUMNS, PACK_ROWS)} | stash: ${room(stash, STASH_COLUMNS, STASH_ROWS)}`,
            span: 2,
            component: pairExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "picky",
            name: "A grid that refuses most gear",
            readout: () => `quiver: ${spots(quiver)} — the quiver takes arrows and nothing else`,
            span: 2,
            component: pickyExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "locked",
            name: "A grid that takes nothing",
            readout: () =>
                `stash: ${spots(lockedStash)} — it can be rearranged from inside but accepts nothing from outside`,
            span: 2,
            component: lockedExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "loot",
            name: "From a list into a grid",
            readout: () =>
                `ground: ${
                    loot.map((item) => item.value.name).join(", ") || "empty"
                } — a list and a grid share one group, so an item crosses between them`,
            span: 2,
            component: lootExample,
            path: `${EXAMPLES_ROOT}/Loot.svelte`,
        },
        {
            key: "walls",
            name: "Walls, and a tidy-up",
            readout: () => `${spots(walled)} — nothing lands on a hatched cell, and Tidy up pulls everything upward`,
            component: wallsExample,
            path: `${EXAMPLES_ROOT}/Inventory.svelte`,
        },
        {
            key: "dashboard",
            name: "Packed after every move",
            readout: () => `${spots(dashboard)} — each drop is followed by compact(), so no hole stays open`,
            component: dashboardExample,
            path: `${EXAMPLES_ROOT}/Inventory.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `${spots(disabled)} — nothing moves, by pointer or by key`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Inventory.svelte`,
        },
    ];
</script>

{#snippet packExample()}
    <InventoryExample
        groupId={"pack"}
        bind:items={pack}
        ariaLabel={"Pack"}
        emptyText={"Empty pack"}
        isTurnable={true}
        hasTurnButtons={true}
    />
{/snippet}

{#snippet turnsExample()}
    <InventoryExample
        groupId={"turns"}
        bind:items={turns}
        ariaLabel={"Bench"}
        emptyText={"Empty bench"}
        columns={TURNS_COLUMNS}
        rows={TURNS_ROWS}
        isTurnable={true}
        hasTurnButtons={true}
    />
{/snippet}

{#snippet cellsExample()}
    <InventoryExample
        groupId={"cells"}
        bind:items={cellsPack}
        ariaLabel={"Pack"}
        emptyText={"Empty pack"}
        paint={"cells"}
        isTurnable={true}
    />
{/snippet}

{#snippet pairExample()}
    <PairExample
        groupId={"pair"}
        bind:pack={pairPack}
        bind:side={stash}
        sideLabel={"Stash"}
        sideEmptyText={"Empty stash"}
    />
{/snippet}

{#snippet pickyExample()}
    <PairExample
        groupId={"picky"}
        bind:pack={pickyPack}
        bind:side={quiver}
        sideLabel={"Quiver"}
        sideEmptyText={"Arrows only"}
        isSideNarrow={true}
        computeCanAccept={(value) => ARROW_IDS.includes(value.id)}
    />
{/snippet}

{#snippet lockedExample()}
    <PairExample
        groupId={"locked"}
        bind:pack={lockedPack}
        bind:side={lockedStash}
        sideLabel={"Stash"}
        sideEmptyText={"Empty stash"}
        isSideLocked={true}
    />
{/snippet}

{#snippet lootExample()}
    <LootExample groupId={"loot"} bind:loot bind:pack={lootPack} />
{/snippet}

{#snippet wallsExample()}
    <InventoryExample
        groupId={"walls"}
        bind:items={walled}
        ariaLabel={"Walled pack"}
        emptyText={"Empty pack"}
        isTurnable={true}
        hasTidyButton={true}
        computeIsSpotBlocked={computeIsWall}
    />
{/snippet}

{#snippet dashboardExample()}
    <InventoryExample
        groupId={"dashboard"}
        bind:items={dashboard}
        ariaLabel={"Packed pack"}
        emptyText={"Empty pack"}
        isTurnable={true}
        isCompacting={true}
    />
{/snippet}

{#snippet disabledExample()}
    <InventoryExample
        groupId={"disabled"}
        bind:items={disabled}
        ariaLabel={"Disabled pack"}
        emptyText={"Empty pack"}
        isDisabled={true}
    />
{/snippet}

<PageExamples items={examples} minColumnWidth={400} />
