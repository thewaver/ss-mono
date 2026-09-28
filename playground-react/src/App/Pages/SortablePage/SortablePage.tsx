import { useState } from "react";

import type { SortableItem } from "@thewaver/ss-components-react";
import { BOARD, CHEAP_ONLY, HAND, QUEUE } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSortableRoom } from "../../StyledComponents/SortableContent/SortableContent";
import { CardsExample } from "./Examples/Cards";
import { PairExample } from "./Examples/Pair";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { RingExample } from "./Examples/Ring";

const EXAMPLES_ROOT = "/src/App/Pages/SortablePage/Examples";

const names = (items: SortableItem<Card>[]) => items.map((item) => item.value.name).join(", ") || "empty";

export const SortablePage = () => {
    const queueState = useState<SortableItem<Card>[]>(QUEUE);
    const rowState = useState<SortableItem<Card>[]>(HAND);
    const rightToLeftState = useState<SortableItem<Card>[]>(HAND);

    const handState = useState<SortableItem<Card>[]>(HAND);
    const boardState = useState<SortableItem<Card>[]>(BOARD);

    const pickyHandState = useState<SortableItem<Card>[]>(HAND);
    const pickyBoardState = useState<SortableItem<Card>[]>([]);

    const lockedHandState = useState<SortableItem<Card>[]>(HAND);
    const lockedBoardState = useState<SortableItem<Card>[]>(BOARD);

    const disabledState = useState<SortableItem<Card>[]>(HAND);
    const ringState = useState<SortableItem<Card>[]>(QUEUE);

    const examples = [
        {
            key: "reorder",
            name: "Reordering one list",
            readout: () =>
                `order: ${names(queueState[0])} — Second is disabled, so arrows skip it and it cannot be picked up`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample
                        groupId={"queue"}
                        itemsState={queueState}
                        ariaLabel={"Queue"}
                        emptyText={"No cards"}
                    />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
        {
            key: "row",
            name: "Laid out in a row",
            readout: () =>
                `order: ${names(rowState[0])} — left and right walk it, because the direction decides the keys`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample
                        groupId={"row"}
                        itemsState={rowState}
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
            name: "A row in a right-to-left box",
            readout: () =>
                `order: ${names(rightToLeftState[0])} — the box around the row sets dir="rtl", so the cards run from the right and a carried card moves on to a later place with the left arrow`,
            component: () => <RightToLeftExample itemsState={rightToLeftState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "ring",
            name: "Reordering round a ring",
            readout: () =>
                `order: ${names(ringState[0])} — dropping picks the nearest place rather than comparing one axis, because a ring has no axis to compare`,
            component: () => (
                <PageSortableRoom>
                    <RingExample itemsState={ringState} />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Ring.tsx`,
        },
        {
            key: "pair",
            name: "Between two lists",
            readout: () => `hand: ${names(handState[0])} | board: ${names(boardState[0])}`,
            component: () => <PairExample groupId={"pair"} handState={handState} boardState={boardState} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "picky",
            name: "A list that refuses some cards",
            readout: () =>
                `hand: ${names(pickyHandState[0])} | board: ${names(pickyBoardState[0])} — the board takes nothing costing more than ${CHEAP_ONLY}`,
            component: () => (
                <PairExample
                    groupId={"picky"}
                    handState={pickyHandState}
                    boardState={pickyBoardState}
                    computeCanAccept={(value) => value.cost <= CHEAP_ONLY}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "locked",
            name: "A list that takes nothing",
            readout: () =>
                `hand: ${names(lockedHandState[0])} | board: ${names(lockedBoardState[0])} — the board can be reordered but accepts nothing from outside`,
            component: () => (
                <PairExample
                    groupId={"locked"}
                    handState={lockedHandState}
                    boardState={lockedBoardState}
                    isBoardLocked={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `order: ${names(disabledState[0])} — nothing moves, by pointer or by key`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample
                        groupId={"disabled"}
                        itemsState={disabledState}
                        ariaLabel={"Disabled list"}
                        emptyText={"No cards"}
                        isDisabled={true}
                    />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
    ];

    return <PageExamples items={examples} minColumnWidth={520} />;
};
