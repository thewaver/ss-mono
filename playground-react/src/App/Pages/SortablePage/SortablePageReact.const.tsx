import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-react";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { PageSortableItemContent } from "../../StyledComponents/SortableContent/SortableContent";

export const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

export const renderSortableCard = (item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={flags} detail={`${item.value.cost}`}>
        {item.value.name}
    </PageSortableItemContent>
);
