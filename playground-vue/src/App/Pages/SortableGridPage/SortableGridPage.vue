<script setup lang="ts">
import { shallowRef } from "vue";

import { SortableGridUtils } from "@thewaver/ss-components-vue";
import type { SortableGridItem } from "@thewaver/ss-components-vue";
import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import InventoryExample from "./Examples/Inventory.vue";
import LootExample from "./Examples/Loot.vue";
import PairExample from "./Examples/Pair.vue";
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

const pack = shallowRef(PACK);

const pairPack = shallowRef(PACK);
const stash = shallowRef(STASH);

const turns = shallowRef(TURNS);

const cellsPack = shallowRef(PACK);

const pickyPack = shallowRef(PACK);
const quiver = shallowRef(ARROWS);

const lockedPack = shallowRef(PACK);
const lockedStash = shallowRef(STASH);

const loot = shallowRef(LOOT);
const lootPack = shallowRef(PACK);

const disabled = shallowRef(PACK);

const walled = shallowRef(SCATTERED);

const dashboard = shallowRef(PACK);

const examples: ExampleDefs[] = [
    {
        key: "pack",
        name: "One grid",
        readout: () =>
            `${room(pack.value, PACK_COLUMNS, PACK_ROWS)} — the page binds R and Shift with R to the two turn commands, and the wheel to the same pair`,
        path: `${EXAMPLES_ROOT}/Inventory.vue`,
    },
    {
        key: "turns",
        name: "An L turns two ways",
        readout: () =>
            `${spots(turns.value)} — clockwise puts the hook's arm where the flint is and is refused, counterclockwise fits`,
        path: `${EXAMPLES_ROOT}/Inventory.vue`,
    },
    {
        key: "cells",
        name: "Painted cell by cell",
        readout: () =>
            `${room(cellsPack.value, PACK_COLUMNS, PACK_ROWS)} — the same items, drawn as their own squares instead of one clipped shape`,
        path: `${EXAMPLES_ROOT}/Inventory.vue`,
    },
    {
        key: "pair",
        name: "Between two grids",
        readout: () =>
            `pack: ${room(pairPack.value, PACK_COLUMNS, PACK_ROWS)} | stash: ${room(stash.value, STASH_COLUMNS, STASH_ROWS)}`,
        span: 2,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "picky",
        name: "A grid that refuses most gear",
        readout: () => `quiver: ${spots(quiver.value)} — the quiver takes arrows and nothing else`,
        span: 2,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "locked",
        name: "A grid that takes nothing",
        readout: () =>
            `stash: ${spots(lockedStash.value)} — it can be rearranged from inside but accepts nothing from outside`,
        span: 2,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "loot",
        name: "From a list into a grid",
        readout: () =>
            `ground: ${
                loot.value.map((item) => item.value.name).join(", ") || "empty"
            } — a list and a grid share one group, so an item crosses between them`,
        span: 2,
        path: `${EXAMPLES_ROOT}/Loot.vue`,
    },
    {
        key: "walls",
        name: "Walls, and a tidy-up",
        readout: () =>
            `${spots(walled.value)} — nothing lands on a hatched cell, and Tidy up pulls everything upward`,
        path: `${EXAMPLES_ROOT}/Inventory.vue`,
    },
    {
        key: "dashboard",
        name: "Packed after every move",
        readout: () => `${spots(dashboard.value)} — each drop is followed by compact(), so no hole stays open`,
        path: `${EXAMPLES_ROOT}/Inventory.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `${spots(disabled.value)} — nothing moves, by pointer or by key`,
        path: `${EXAMPLES_ROOT}/Inventory.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples" :min-column-width="400">
        <template #pack>
            <InventoryExample
                v-model:items="pack"
                group-id="pack"
                ariaLabel="Pack"
                empty-text="Empty pack"
                is-turnable
                has-turn-buttons
            />
        </template>

        <template #turns>
            <InventoryExample
                v-model:items="turns"
                group-id="turns"
                ariaLabel="Bench"
                empty-text="Empty bench"
                :columns="TURNS_COLUMNS"
                :rows="TURNS_ROWS"
                is-turnable
                has-turn-buttons
            />
        </template>

        <template #cells>
            <InventoryExample
                v-model:items="cellsPack"
                group-id="cells"
                ariaLabel="Pack"
                empty-text="Empty pack"
                paint="cells"
                is-turnable
            />
        </template>

        <template #pair>
            <PairExample
                v-model:pack="pairPack"
                v-model:side="stash"
                group-id="pair"
                side-label="Stash"
                side-empty-text="Empty stash"
            />
        </template>

        <template #picky>
            <PairExample
                v-model:pack="pickyPack"
                v-model:side="quiver"
                group-id="picky"
                side-label="Quiver"
                side-empty-text="Arrows only"
                is-side-narrow
                :compute-can-accept="(value: Gear) => ARROW_IDS.includes(value.id)"
            />
        </template>

        <template #locked>
            <PairExample
                v-model:pack="lockedPack"
                v-model:side="lockedStash"
                group-id="locked"
                side-label="Stash"
                side-empty-text="Empty stash"
                is-side-locked
            />
        </template>

        <template #loot>
            <LootExample v-model:loot="loot" v-model:pack="lootPack" group-id="loot" />
        </template>

        <template #walls>
            <InventoryExample
                v-model:items="walled"
                group-id="walls"
                ariaLabel="Walled pack"
                empty-text="Empty pack"
                is-turnable
                has-tidy-button
                :compute-is-spot-blocked="computeIsWall"
            />
        </template>

        <template #dashboard>
            <InventoryExample
                v-model:items="dashboard"
                group-id="dashboard"
                ariaLabel="Packed pack"
                empty-text="Empty pack"
                is-turnable
                is-compacting
            />
        </template>

        <template #disabled>
            <InventoryExample
                v-model:items="disabled"
                group-id="disabled"
                ariaLabel="Disabled pack"
                empty-text="Empty pack"
                is-disabled
            />
        </template>
    </PageExamples>
</template>
