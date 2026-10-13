import { useState } from "react";

import type { SortableItem } from "@thewaver/ss-components-react";
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
            name: EXAMPLE_NAMES.reorder,
            readout: () =>
                `order: ${names(queueState[0])} — Second is disabled, so arrows skip it and it cannot be picked up`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample groupId={"queue"} items={queueState} ariaLabel={"Queue"} emptyText={"No cards"} />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Cards.tsx`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            readout: () =>
                `order: ${names(rowState[0])} — left and right walk it, because the direction decides the keys`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample
                        groupId={"row"}
                        items={rowState}
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
                `order: ${names(rightToLeftState[0])} — the box around the row sets dir="rtl", so the cards run from the right and a carried card moves on to a later place with the left arrow`,
            component: () => <RightToLeftExample items={rightToLeftState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "ring",
            name: EXAMPLE_NAMES.ring,
            readout: () =>
                `order: ${names(ringState[0])} — dropping picks the nearest place rather than comparing one axis, because a ring has no axis to compare`,
            component: () => (
                <PageSortableRoom>
                    <RingExample items={ringState} />
                </PageSortableRoom>
            ),
            path: `${EXAMPLES_ROOT}/Ring.tsx`,
        },
        {
            key: "pair",
            name: EXAMPLE_NAMES.pair,
            readout: () => `hand: ${names(handState[0])} | board: ${names(boardState[0])}`,
            component: () => <PairExample groupId={"pair"} hand={handState} board={boardState} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "picky",
            name: EXAMPLE_NAMES.picky,
            readout: () =>
                `hand: ${names(pickyHandState[0])} | board: ${names(pickyBoardState[0])} — the board takes nothing costing more than ${CHEAP_ONLY}`,
            component: () => (
                <PairExample
                    groupId={"picky"}
                    hand={pickyHandState}
                    board={pickyBoardState}
                    computeCanAccept={(value) => value.cost <= CHEAP_ONLY}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "locked",
            name: EXAMPLE_NAMES.locked,
            readout: () =>
                `hand: ${names(lockedHandState[0])} | board: ${names(lockedBoardState[0])} — the board can be reordered but accepts nothing from outside`,
            component: () => (
                <PairExample groupId={"locked"} hand={lockedHandState} board={lockedBoardState} isBoardLocked={true} />
            ),
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `order: ${names(disabledState[0])} — nothing moves, by pointer or by key`,
            component: () => (
                <PageSortableRoom>
                    <CardsExample
                        groupId={"disabled"}
                        items={disabledState}
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
