import { useState } from "react";

import { Sortable } from "@thewaver/ss-components-react";
import type { SortableItem } from "@thewaver/ss-components-react";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    CHEAP_ONLY,
    HAND,
    LIST_GAP,
    LIST_MIN_HEIGHT,
    LIST_MIN_WIDTH,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.css";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { PageSortableMarker, PageSortableSurface } from "../../../StyledComponents/SortableContent/SortableContent";
import { RESTING_FLAGS, renderSortableCard } from "../SortablePageReact.const";

export const PickyDocsExample = () => {
    const hand = useState<SortableItem<Card>[]>(HAND);
    const board = useState<SortableItem<Card>[]>([]);

    return (
        <div className={styles.sortablePair}>
            <div className={styles.sortableColumn}>
                <div className={styles.sortableCaption}>Hand</div>

                <Sortable
                    groupId={"picky"}
                    ariaLabel={"Hand"}
                    announcements={SORTABLE_ANNOUNCEMENTS}
                    gap={LIST_GAP}
                    minHeight={LIST_MIN_HEIGHT}
                    minWidth={LIST_MIN_WIDTH}
                    items={hand}
                    computeItemKey={computeCardKey}
                    computeItemLabel={computeCardLabel}
                    renderItem={renderSortableCard}
                    renderCarried={(item) => renderSortableCard(item, RESTING_FLAGS)}
                    renderMarker={(orientation) => <PageSortableMarker orientation={orientation} />}
                    renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={"No cards"} />}
                />
            </div>

            <div className={styles.sortableColumn}>
                <div className={styles.sortableCaption}>Board</div>

                <Sortable
                    groupId={"picky"}
                    ariaLabel={"Board"}
                    announcements={SORTABLE_ANNOUNCEMENTS}
                    gap={LIST_GAP}
                    minHeight={LIST_MIN_HEIGHT}
                    minWidth={LIST_MIN_WIDTH}
                    items={board}
                    computeItemKey={computeCardKey}
                    computeItemLabel={computeCardLabel}
                    computeCanAccept={(card) => card.cost <= CHEAP_ONLY}
                    renderItem={renderSortableCard}
                    renderCarried={(item) => renderSortableCard(item, RESTING_FLAGS)}
                    renderMarker={(orientation) => <PageSortableMarker orientation={orientation} />}
                    renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={"Play a card here"} />}
                />
            </div>
        </div>
    );
};
