import { createMemo, createSignal } from "solid-js";

import type { SortableItem } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CardsExample } from "./Examples/Cards";
import { PairExample } from "./Examples/Pair";
import { BOARD, CHEAP_ONLY, HAND, QUEUE } from "./SortablePage.const";
import type { Card } from "./SortablePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/SortablePage/Examples";

const names = (items: SortableItem<Card>[]) => items.map((item) => item.value.name).join(", ") || "empty";

export const SortablePage = () => {
    const queueSignal = createSignal(QUEUE);
    const rowSignal = createSignal(HAND);

    const handSignal = createSignal(HAND);
    const boardSignal = createSignal(BOARD);

    const pickyHandSignal = createSignal(HAND);
    const pickyBoardSignal = createSignal<SortableItem<Card>[]>([]);

    const lockedHandSignal = createSignal(HAND);
    const lockedBoardSignal = createSignal(BOARD);

    const disabledSignal = createSignal(HAND);

    const getExamples = createMemo(() => [
        {
            key: "reorder",
            name: "Reordering one list",
            readout: () =>
                `order: ${names(queueSignal[0]())} — Second is disabled, so arrows skip it and it cannot be picked up`,
            component: () => (
                <CardsExample groupId={"queue"} itemsSignal={queueSignal} ariaLabel={"Queue"} emptyText={"No cards"} />
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
        {
            key: "row",
            name: "Laid out in a row",
            readout: () =>
                `order: ${names(rowSignal[0]())} — left and right walk it, because the direction decides the keys`,
            component: () => (
                <CardsExample
                    groupId={"row"}
                    itemsSignal={rowSignal}
                    ariaLabel={"Row"}
                    emptyText={"No cards"}
                    dir={"row"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
        {
            key: "pair",
            name: "Between two lists",
            readout: () => `hand: ${names(handSignal[0]())} | board: ${names(boardSignal[0]())}`,
            component: () => <PairExample groupId={"pair"} handSignal={handSignal} boardSignal={boardSignal} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "picky",
            name: "A list that refuses some cards",
            readout: () =>
                `hand: ${names(pickyHandSignal[0]())} | board: ${names(pickyBoardSignal[0]())} — the board takes nothing costing more than ${CHEAP_ONLY}`,
            component: () => (
                <PairExample
                    groupId={"picky"}
                    handSignal={pickyHandSignal}
                    boardSignal={pickyBoardSignal}
                    computeCanAccept={(value) => value.cost <= CHEAP_ONLY}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "locked",
            name: "A list that takes nothing",
            readout: () =>
                `hand: ${names(lockedHandSignal[0]())} | board: ${names(lockedBoardSignal[0]())} — the board can be reordered but accepts nothing from outside`,
            component: () => (
                <PairExample
                    groupId={"locked"}
                    handSignal={lockedHandSignal}
                    boardSignal={lockedBoardSignal}
                    isBoardLocked={() => true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `order: ${names(disabledSignal[0]())} — nothing moves, by pointer or by key`,
            component: () => (
                <CardsExample
                    groupId={"disabled"}
                    itemsSignal={disabledSignal}
                    ariaLabel={"Disabled list"}
                    emptyText={"No cards"}
                    isDisabled={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} minColumnWidth={420} />;
};
