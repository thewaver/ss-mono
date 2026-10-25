import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

import { Sortable } from "@thewaver/ss-components-solid";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-solid";
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
import { RESTING_FLAGS } from "../SortablePageSolid.const";

const renderCard = (getItem: Accessor<SortableItem<Card>>, getFlags: () => InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={getFlags} detail={() => `${getItem().value.cost}`} isCentered={true}>
        {getItem().value.name}
    </PageSortableItemContent>
);

export const RingDocsExample = () => {
    const items = createSignal<SortableItem<Card>[]>(QUEUE);

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
                    renderCarried={(getItem) => renderCard(getItem, () => RESTING_FLAGS)}
                    renderMarker={() => <PageSortableRingMarker />}
                    renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={"No cards"} />}
                />
            </div>
        </PageSortableRoom>
    );
};
