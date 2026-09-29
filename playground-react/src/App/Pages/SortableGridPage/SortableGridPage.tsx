import { useState } from "react";

import { SortableGridUtils } from "@thewaver/ss-components-react";
import type { SortableGridItem } from "@thewaver/ss-components-react";
import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

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

export const SortableGridPage = () => {
    const packState = useState(PACK);

    const pairPackState = useState(PACK);
    const stashState = useState(STASH);

    const turnsState = useState(TURNS);

    const cellsPackState = useState(PACK);

    const pickyPackState = useState(PACK);
    const quiverState = useState(ARROWS);

    const lockedPackState = useState(PACK);
    const lockedStashState = useState(STASH);

    const lootState = useState(LOOT);
    const lootPackState = useState(PACK);

    const disabledState = useState(PACK);

    const walledState = useState(SCATTERED);

    const dashboardState = useState(PACK);

    const examples = [
        {
            key: "pack",
            name: "One grid",
            readout: () =>
                `${room(packState[0], PACK_COLUMNS, PACK_ROWS)} — the page binds R and Shift with R to the two turn commands, and the wheel to the same pair`,
            component: () => (
                <InventoryExample
                    groupId={"pack"}
                    items={packState}
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
                `${spots(turnsState[0])} — clockwise puts the hook's arm where the flint is and is refused, counterclockwise fits`,
            component: () => (
                <InventoryExample
                    groupId={"turns"}
                    items={turnsState}
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
                `${room(cellsPackState[0], PACK_COLUMNS, PACK_ROWS)} — the same items, drawn as their own squares instead of one clipped shape`,
            component: () => (
                <InventoryExample
                    groupId={"cells"}
                    items={cellsPackState}
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
                `pack: ${room(pairPackState[0], PACK_COLUMNS, PACK_ROWS)} | stash: ${room(stashState[0], STASH_COLUMNS, STASH_ROWS)}`,
            span: 2,
            component: () => (
                <PairExample
                    groupId={"pair"}
                    pack={pairPackState}
                    side={stashState}
                    sideLabel={"Stash"}
                    sideEmptyText={"Empty stash"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "picky",
            name: "A grid that refuses most gear",
            readout: () => `quiver: ${spots(quiverState[0])} — the quiver takes arrows and nothing else`,
            span: 2,
            component: () => (
                <PairExample
                    groupId={"picky"}
                    pack={pickyPackState}
                    side={quiverState}
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
                `stash: ${spots(lockedStashState[0])} — it can be rearranged from inside but accepts nothing from outside`,
            span: 2,
            component: () => (
                <PairExample
                    groupId={"locked"}
                    pack={lockedPackState}
                    side={lockedStashState}
                    sideLabel={"Stash"}
                    sideEmptyText={"Empty stash"}
                    isSideLocked={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "loot",
            name: "From a list into a grid",
            readout: () =>
                `ground: ${
                    lootState[0].map((item) => item.value.name).join(", ") || "empty"
                } — a list and a grid share one group, so an item crosses between them`,
            span: 2,
            component: () => <LootExample groupId={"loot"} loot={lootState} pack={lootPackState} />,
            path: `${EXAMPLES_ROOT}/Loot.tsx`,
        },
        {
            key: "walls",
            name: "Walls, and a tidy-up",
            readout: () =>
                `${spots(walledState[0])} — nothing lands on a hatched cell, and Tidy up pulls everything upward`,
            component: () => (
                <InventoryExample
                    groupId={"walls"}
                    items={walledState}
                    ariaLabel={"Walled pack"}
                    emptyText={"Empty pack"}
                    isTurnable={true}
                    hasTidyButton={true}
                    computeIsSpotBlocked={computeIsWall}
                />
            ),
            path: `${EXAMPLES_ROOT}/Inventory.tsx`,
        },
        {
            key: "dashboard",
            name: "Packed after every move",
            readout: () => `${spots(dashboardState[0])} — each drop is followed by compact(), so no hole stays open`,
            component: () => (
                <InventoryExample
                    groupId={"dashboard"}
                    items={dashboardState}
                    ariaLabel={"Packed pack"}
                    emptyText={"Empty pack"}
                    isTurnable={true}
                    isCompacting={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Inventory.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `${spots(disabledState[0])} — nothing moves, by pointer or by key`,
            component: () => (
                <InventoryExample
                    groupId={"disabled"}
                    items={disabledState}
                    ariaLabel={"Disabled pack"}
                    emptyText={"Empty pack"}
                    isDisabled={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Inventory.tsx`,
        },
    ];

    return <PageExamples items={examples} minColumnWidth={400} />;
};
