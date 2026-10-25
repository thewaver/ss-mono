import { useState } from "react";

import { Sortable } from "@thewaver/ss-components-react";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-react";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    LIST_GAP,
    QUEUE,
    RING_LAYOUT,
    RING_WIDTH,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import {
    PageSortableItemContent,
    PageSortableRingMarker,
    PageSortableRoom,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { RESTING_FLAGS } from "../SortablePageReact.const";

const renderCard = (item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={flags} detail={`${item.value.cost}`} isCentered={true}>
        {item.value.name}
    </PageSortableItemContent>
);

export const RingDocsExample = () => {
    const items = useState<SortableItem<Card>[]>(QUEUE);

    return (
        <PageSortableRoom>
            <div style={{ width: RING_WIDTH }}>
                <Sortable
                    groupId={"ring"}
                    ariaLabel={"Ring"}
                    announcements={SORTABLE_ANNOUNCEMENTS}
                    gap={LIST_GAP}
                    items={items}
                    computeLayout={RING_LAYOUT}
                    computeItemKey={computeCardKey}
                    computeItemLabel={computeCardLabel}
                    renderItem={renderCard}
                    renderCarried={(item) => renderCard(item, RESTING_FLAGS)}
                    renderMarker={() => <PageSortableRingMarker />}
                    renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={"No cards"} />}
                />
            </div>
        </PageSortableRoom>
    );
};
