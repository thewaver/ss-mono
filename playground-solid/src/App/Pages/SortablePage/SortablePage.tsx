import { createMemo, createSignal } from "solid-js";

import type { SortableItem } from "@thewaver/ss-components-solid";
import {
    BOARD,
    CHEAP_ONLY,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    HAND,
    QUEUE,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSortableRoom } from "../../StyledComponents/SortableContent/SortableContent";
import { CardsExample } from "./Examples/Cards";
import { PairExample } from "./Examples/Pair";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { RingExample } from "./Examples/Ring";

const names = (items: SortableItem<Card>[]) => items.map((item) => item.value.name).join(", ") || "empty";

export const SortablePage = () => {
    const queueSignal = createSignal<SortableItem<Card>[]>(QUEUE);
    const rowSignal = createSignal<SortableItem<Card>[]>(HAND);
    const rightToLeftSignal = createSignal<SortableItem<Card>[]>(HAND);

    const handSignal = createSignal<SortableItem<Card>[]>(HAND);
    const boardSignal = createSignal<SortableItem<Card>[]>(BOARD);

    const pickyHandSignal = createSignal<SortableItem<Card>[]>(HAND);
    const pickyBoardSignal = createSignal<SortableItem<Card>[]>([]);

    const lockedHandSignal = createSignal<SortableItem<Card>[]>(HAND);
    const lockedBoardSignal = createSignal<SortableItem<Card>[]>(BOARD);

    const disabledSignal = createSignal<SortableItem<Card>[]>(HAND);
    const ringSignal = createSignal<SortableItem<Card>[]>(QUEUE);

    const getExamples = createMemo(() => [
        {
            key: "reorder",
            name: EXAMPLE_NAMES.reorder,
            readout: () =>
                `order: ${names(queueSignal[0]())} — Second is disabled, so arrows skip it and it cannot be picked up`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample groupId={"queue"} items={queueSignal} ariaLabel={"Queue"} emptyText={"No cards"} />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            readout: () =>
                `order: ${names(rowSignal[0]())} — left and right walk it, because the direction decides the keys`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample
                        groupId={"row"}
                        items={rowSignal}
                        ariaLabel={"Row"}
                        emptyText={"No cards"}
                        orientation={"horizontal"}
                    />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `order: ${names(rightToLeftSignal[0]())} — the box around the row sets dir="rtl", so the cards run from the right and a carried card moves on to a later place with the left arrow`,
            component: () => <RightToLeftExample items={rightToLeftSignal} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "pair",
            name: EXAMPLE_NAMES.pair,
            readout: () => `hand: ${names(handSignal[0]())} | board: ${names(boardSignal[0]())}`,
            component: () => <PairExample groupId={"pair"} hand={handSignal} board={boardSignal} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "picky",
            name: EXAMPLE_NAMES.picky,
            readout: () =>
                `hand: ${names(pickyHandSignal[0]())} | board: ${names(pickyBoardSignal[0]())} — the board takes nothing costing more than ${CHEAP_ONLY}`,
            component: () => (
                <PairExample
                    groupId={"picky"}
                    hand={pickyHandSignal}
                    board={pickyBoardSignal}
                    computeCanAccept={(value) => value.cost <= CHEAP_ONLY}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "locked",
            name: EXAMPLE_NAMES.locked,
            readout: () =>
                `hand: ${names(lockedHandSignal[0]())} | board: ${names(lockedBoardSignal[0]())} — the board can be reordered but accepts nothing from outside`,
            component: () => (
                <PairExample
                    groupId={"locked"}
                    hand={lockedHandSignal}
                    board={lockedBoardSignal}
                    isBoardLocked={() => true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `order: ${names(disabledSignal[0]())} — nothing moves, by pointer or by key`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample
                        groupId={"disabled"}
                        items={disabledSignal}
                        ariaLabel={"Disabled list"}
                        emptyText={"No cards"}
                        isDisabled={true}
                    />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
        {
            key: "ring",
            name: EXAMPLE_NAMES.ring,
            readout: () =>
                `order: ${names(ringSignal[0]())} — dropping picks the nearest place rather than comparing one axis, because a ring has no axis to compare`,
            component: () => (
                <PageSortableRoom>
                    <RingExample items={ringSignal} />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Ring.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} minColumnWidth={520} />;
};
