import { useState } from "react";

import { Sortable } from "@thewaver/ss-components-react";
import type { SortableItem } from "@thewaver/ss-components-react";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    HAND,
    LIST_GAP,
    LIST_MIN_HEIGHT,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import {
    PageSortableMarker,
    PageSortableRoom,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { RESTING_FLAGS, renderSortableCard } from "../SortablePageReact.const";

export const RightToLeftDocsExample = () => {
    const items = useState<SortableItem<Card>[]>(HAND);

    return (
        <div dir={"rtl"}>
            <PageSortableRoom>
                <Sortable
                    groupId={"rightToLeft"}
                    ariaLabel={"Row in a right-to-left box"}
                    orientation={"horizontal"}
                    announcements={SORTABLE_ANNOUNCEMENTS}
                    gap={LIST_GAP}
                    minHeight={LIST_MIN_HEIGHT}
                    items={items}
                    computeItemKey={computeCardKey}
                    computeItemLabel={computeCardLabel}
                    renderItem={renderSortableCard}
                    renderCarried={(item) => renderSortableCard(item, RESTING_FLAGS)}
                    renderMarker={(orientation) => <PageSortableMarker orientation={orientation} />}
                    renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={"No cards"} />}
                />
            </PageSortableRoom>
        </div>
    );
};
