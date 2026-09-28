import type { SortableItem } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.css";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { CardsExample } from "./Cards";

type Props = {
    groupId: string;
    handState: readonly [SortableItem<Card>[], (items: SortableItem<Card>[]) => void];
    boardState: readonly [SortableItem<Card>[], (items: SortableItem<Card>[]) => void];
    isBoardLocked?: boolean;
    computeCanAccept?: (value: Card, fromLabel: string) => boolean;
};

export const PairExample = (props: Props) => (
    <div className={styles.sortablePair}>
        <div className={styles.sortableColumn}>
            <div className={styles.sortableCaption}>Hand</div>

            <CardsExample
                groupId={props.groupId}
                itemsState={props.handState}
                ariaLabel={"Hand"}
                emptyText={"No cards"}
            />
        </div>

        <div className={styles.sortableColumn}>
            <div className={styles.sortableCaption}>Board</div>

            <CardsExample
                groupId={props.groupId}
                itemsState={props.boardState}
                ariaLabel={"Board"}
                emptyText={"Play a card here"}
                isLocked={props.isBoardLocked ?? false}
                computeCanAccept={props.computeCanAccept}
            />
        </div>
    </div>
);
