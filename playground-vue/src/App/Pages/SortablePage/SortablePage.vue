<script setup lang="ts">
import { shallowRef } from "vue";

import type { SortableItem } from "@thewaver/ss-components-vue";
import {
    BOARD,
    CHEAP_ONLY,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    HAND,
    QUEUE,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageSortableRoom from "../../StyledComponents/SortableContent/PageSortableRoom.vue";
import CardsExample from "./Examples/Cards.vue";
import PairExample from "./Examples/Pair.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import RingExample from "./Examples/Ring.vue";

const names = (items: SortableItem<Card>[]) => items.map((item) => item.value.name).join(", ") || "empty";

const queue = shallowRef<SortableItem<Card>[]>(QUEUE);
const row = shallowRef<SortableItem<Card>[]>(HAND);
const rightToLeft = shallowRef<SortableItem<Card>[]>(HAND);

const hand = shallowRef<SortableItem<Card>[]>(HAND);
const board = shallowRef<SortableItem<Card>[]>(BOARD);

const pickyHand = shallowRef<SortableItem<Card>[]>(HAND);
const pickyBoard = shallowRef<SortableItem<Card>[]>([]);

const lockedHand = shallowRef<SortableItem<Card>[]>(HAND);
const lockedBoard = shallowRef<SortableItem<Card>[]>(BOARD);

const disabled = shallowRef<SortableItem<Card>[]>(HAND);
const ring = shallowRef<SortableItem<Card>[]>(QUEUE);

const examples: ExampleDefs[] = [
    {
        key: "reorder",
        name: EXAMPLE_NAMES.reorder,
        readout: () =>
            `order: ${names(queue.value)} — Second is disabled, so arrows skip it and it cannot be picked up`,
        path: `${EXAMPLES_ROOT}/Cards.vue`,
    },
    {
        key: "row",
        name: EXAMPLE_NAMES.row,
        readout: () => `order: ${names(row.value)} — left and right walk it, because the direction decides the keys`,
        path: `${EXAMPLES_ROOT}/Cards.vue`,
    },
    {
        key: "rightToLeft",
        name: EXAMPLE_NAMES.rightToLeft,
        readout: () =>
            `order: ${names(rightToLeft.value)} — the box around the row sets dir="rtl", so the cards run from the right and a carried card moves on to a later place with the left arrow`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "pair",
        name: EXAMPLE_NAMES.pair,
        readout: () => `hand: ${names(hand.value)} | board: ${names(board.value)}`,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "picky",
        name: EXAMPLE_NAMES.picky,
        readout: () =>
            `hand: ${names(pickyHand.value)} | board: ${names(pickyBoard.value)} — the board takes nothing costing more than ${CHEAP_ONLY}`,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "locked",
        name: EXAMPLE_NAMES.locked,
        readout: () =>
            `hand: ${names(lockedHand.value)} | board: ${names(lockedBoard.value)} — the board can be reordered but accepts nothing from outside`,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "disabled",
        name: EXAMPLE_NAMES.disabled,
        readout: () => `order: ${names(disabled.value)} — nothing moves, by pointer or by key`,
        path: `${EXAMPLES_ROOT}/Cards.vue`,
    },
    {
        key: "ring",
        name: EXAMPLE_NAMES.ring,
        readout: () =>
            `order: ${names(ring.value)} — dropping picks the nearest place rather than comparing one axis, because a ring has no axis to compare`,
        path: `${EXAMPLES_ROOT}/Ring.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples" :min-column-width="520">
        <template #reorder>
            <PageSortableRoom>
                <CardsExample v-model:items="queue" group-id="queue" ariaLabel="Queue" empty-text="No cards" />
            </PageSortableRoom>
        </template>

        <template #row>
            <PageSortableRoom>
                <CardsExample
                    v-model:items="row"
                    group-id="row"
                    ariaLabel="Row"
                    empty-text="No cards"
                    orientation="horizontal"
                />
            </PageSortableRoom>
        </template>

        <template #rightToLeft>
            <RightToLeftExample v-model:items="rightToLeft" />
        </template>

        <template #ring>
            <PageSortableRoom>
                <RingExample v-model:items="ring" />
            </PageSortableRoom>
        </template>

        <template #pair>
            <PairExample v-model:hand="hand" v-model:board="board" group-id="pair" />
        </template>

        <template #picky>
            <PairExample
                v-model:hand="pickyHand"
                v-model:board="pickyBoard"
                group-id="picky"
                :compute-can-accept="(value: Card) => value.cost <= CHEAP_ONLY"
            />
        </template>

        <template #locked>
            <PairExample v-model:hand="lockedHand" v-model:board="lockedBoard" group-id="locked" is-board-locked />
        </template>

        <template #disabled>
            <PageSortableRoom>
                <CardsExample
                    v-model:items="disabled"
                    group-id="disabled"
                    ariaLabel="Disabled list"
                    empty-text="No cards"
                    is-disabled
                />
            </PageSortableRoom>
        </template>
    </PageExamples>
</template>
