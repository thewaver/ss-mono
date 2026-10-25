import type { Accessor } from "solid-js";

import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-solid";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { PageSortableItemContent } from "../../StyledComponents/SortableContent/SortableContent";

export const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

export const renderSortableCard = (
    getItem: Accessor<SortableItem<Card>>,
    getFlags: () => InteractionFlags<SortableItemFlags>,
) => (
    <PageSortableItemContent flags={getFlags} detail={() => `${getItem().value.cost}`}>
        {getItem().value.name}
    </PageSortableItemContent>
);
