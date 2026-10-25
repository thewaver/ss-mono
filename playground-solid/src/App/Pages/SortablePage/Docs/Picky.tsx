import { createSignal } from "solid-js";

import { Sortable } from "@thewaver/ss-components-solid";
import type { SortableItem } from "@thewaver/ss-components-solid";
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
import { RESTING_FLAGS, renderSortableCard } from "../SortablePageSolid.const";

export const PickyDocsExample = () => {
    const hand = createSignal<SortableItem<Card>[]>(HAND);
    const board = createSignal<SortableItem<Card>[]>([]);

    return (
        <div class={styles.sortablePair}>
            <div class={styles.sortableColumn}>
                <div class={styles.sortableCaption}>Hand</div>

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
                    renderCarried={(getItem) => renderSortableCard(getItem, () => RESTING_FLAGS)}
                    renderMarker={(getOrientation) => <PageSortableMarker orientation={getOrientation} />}
                    renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={"No cards"} />}
                />
            </div>

            <div class={styles.sortableColumn}>
                <div class={styles.sortableCaption}>Board</div>

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
                    renderCarried={(getItem) => renderSortableCard(getItem, () => RESTING_FLAGS)}
                    renderMarker={(getOrientation) => <PageSortableMarker orientation={getOrientation} />}
                    renderDecoration={(getFlags) => (
                        <PageSortableSurface flags={getFlags} emptyText={"Play a card here"} />
                    )}
                />
            </div>
        </div>
    );
};
