import { createMemo, createSignal } from "solid-js";

import { SortableGridUtils } from "@thewaver/ss-components";
import type { SortableGridItem } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { InventoryExample } from "./Examples/Inventory";
import { LootExample } from "./Examples/Loot";
import { PairExample } from "./Examples/Pair";
import {
    ARROWS,
    ARROW_IDS,
    LOOT,
    PACK,
    PACK_COLUMNS,
    PACK_ROWS,
    STASH,
    STASH_COLUMNS,
    STASH_ROWS,
    TURNS,
    TURNS_COLUMNS,
    TURNS_ROWS,
} from "./SortableGridPage.const";
import type { Gear } from "./SortableGridPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/SortableGridPage/Examples";

const filled = (items: SortableGridItem<Gear>[]) =>
    items.reduce((cells, item) => cells + SortableGridUtils.getItemShape(item).cells.length, 0);

const room = (items: SortableGridItem<Gear>[], columns: number, rows: number) =>
    `${columns * rows - filled(items)} of ${columns * rows} cells free`;

const spots = (items: SortableGridItem<Gear>[]) =>
    items.map((item) => `${item.value.name} at ${item.spot.x + 1},${item.spot.y + 1}`).join(" | ") || "empty";

export const SortableGridPage = () => {
    const packSignal = createSignal(PACK);

    const pairPackSignal = createSignal(PACK);
    const stashSignal = createSignal(STASH);

    const turnsSignal = createSignal(TURNS);

    const cellsPackSignal = createSignal(PACK);

    const pickyPackSignal = createSignal(PACK);
    const quiverSignal = createSignal(ARROWS);

    const lockedPackSignal = createSignal(PACK);
    const lockedStashSignal = createSignal(STASH);

    const lootSignal = createSignal(LOOT);
    const lootPackSignal = createSignal(PACK);

    const disabledSignal = createSignal(PACK);

    const getExamples = createMemo(() => [
        {
            key: "pack",
            name: "One grid",
            readout: () =>
                `${room(packSignal[0](), PACK_COLUMNS, PACK_ROWS)} — the page binds R and Shift with R to the two turn commands, and the wheel to the same pair`,
            component: () => (
                <InventoryExample
                    groupId={"pack"}
                    itemsSignal={packSignal}
                    ariaLabel={"Pack"}
                    emptyText={"Empty pack"}
                    isTurnable={true}
                    hasTurnButtons={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Inventory.tsx`,
        },
        {
            key: "turns",
            name: "An L turns two ways",
            readout: () =>
                `${spots(turnsSignal[0]())} — clockwise puts the hook's arm where the flint is and is refused, anticlockwise fits`,
            component: () => (
                <InventoryExample
                    groupId={"turns"}
                    itemsSignal={turnsSignal}
                    ariaLabel={"Bench"}
                    emptyText={"Empty bench"}
                    columns={TURNS_COLUMNS}
                    rows={TURNS_ROWS}
                    isTurnable={true}
                    hasTurnButtons={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Inventory.tsx`,
        },
        {
            key: "cells",
            name: "Painted cell by cell",
            readout: () =>
                `${room(cellsPackSignal[0](), PACK_COLUMNS, PACK_ROWS)} — the same items, drawn as their own squares instead of one clipped shape`,
            component: () => (
                <InventoryExample
                    groupId={"cells"}
                    itemsSignal={cellsPackSignal}
                    ariaLabel={"Pack"}
                    emptyText={"Empty pack"}
                    paint={"cells"}
                    isTurnable={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Inventory.tsx`,
        },
        {
            key: "pair",
            name: "Between two grids",
            readout: () =>
                `pack: ${room(pairPackSignal[0](), PACK_COLUMNS, PACK_ROWS)} | stash: ${room(stashSignal[0](), STASH_COLUMNS, STASH_ROWS)}`,
            span: 2,
            component: () => (
                <PairExample
                    groupId={"pair"}
                    packSignal={pairPackSignal}
                    sideSignal={stashSignal}
                    sideLabel={"Stash"}
                    sideEmptyText={"Empty stash"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "picky",
            name: "A grid that refuses most gear",
            readout: () => `quiver: ${spots(quiverSignal[0]())} — the quiver takes arrows and nothing else`,
            span: 2,
            component: () => (
                <PairExample
                    groupId={"picky"}
                    packSignal={pickyPackSignal}
                    sideSignal={quiverSignal}
                    sideLabel={"Quiver"}
                    sideEmptyText={"Arrows only"}
                    isSideNarrow={true}
                    computeCanAccept={(value) => ARROW_IDS.includes(value.id)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "locked",
            name: "A grid that takes nothing",
            readout: () =>
                `stash: ${spots(lockedStashSignal[0]())} — it can be rearranged from inside but accepts nothing from outside`,
            span: 2,
            component: () => (
                <PairExample
                    groupId={"locked"}
                    packSignal={lockedPackSignal}
                    sideSignal={lockedStashSignal}
                    sideLabel={"Stash"}
                    sideEmptyText={"Empty stash"}
                    isSideLocked={() => true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "loot",
            name: "From a list into a grid",
            readout: () =>
                `ground: ${
                    lootSignal[0]()
                        .map((item) => item.value.name)
                        .join(", ") || "empty"
                } — a list and a grid share one group, so an item crosses between them`,
            span: 2,
            component: () => <LootExample groupId={"loot"} lootSignal={lootSignal} packSignal={lootPackSignal} />,
            path: `${EXAMPLES_ROOT}/Loot.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `${spots(disabledSignal[0]())} — nothing moves, by pointer or by key`,
            component: () => (
                <InventoryExample
                    groupId={"disabled"}
                    itemsSignal={disabledSignal}
                    ariaLabel={"Disabled pack"}
                    emptyText={"Empty pack"}
                    isDisabled={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Inventory.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} minColumnWidth={420} />;
};
