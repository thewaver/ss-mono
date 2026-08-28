import type { Signal } from "solid-js";

import type { SortableItem } from "@thewaver/ss-components";

import type { Card } from "../SortablePage.types";
import { CardsExample } from "./Cards";

import * as styles from "../SortablePage.css";

type Props = {
    groupId: string;
    handSignal: Signal<SortableItem<Card>[]>;
    boardSignal: Signal<SortableItem<Card>[]>;
    isBoardLocked?: () => boolean;
    computeCanAccept?: (value: Card, fromLabel: string) => boolean;
};

export const PairExample = (props: Props) => (
    <div class={styles.sortablePair}>
        <div class={styles.sortableColumn}>
            <div class={styles.sortableCaption}>Hand</div>

            <CardsExample
                groupId={props.groupId}
                itemsSignal={props.handSignal}
                ariaLabel={"Hand"}
                emptyText={"No cards"}
            />
        </div>

        <div class={styles.sortableColumn}>
            <div class={styles.sortableCaption}>Board</div>

            <CardsExample
                groupId={props.groupId}
                itemsSignal={props.boardSignal}
                ariaLabel={"Board"}
                emptyText={"Play a card here"}
                isLocked={() => props.isBoardLocked?.() ?? false}
                computeCanAccept={props.computeCanAccept}
            />
        </div>
    </div>
);
