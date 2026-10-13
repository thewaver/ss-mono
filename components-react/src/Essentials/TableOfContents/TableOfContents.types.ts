import type { ReactNode } from "react";

import type {
    BaseTableOfContentsProps,
    InteractionFlags,
    PlacementRect,
    TableOfContentsFlags,
    TableOfContentsLink,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type TableOfContentsItemProps<T> = Omit<InteractionControlProps<TableOfContentsFlags>, "id"> & {
    /** The link this item stands for. */
    link: TableOfContentsLink<T>;
    /** Runs once a press has taken the reader to the link's target. */
    onGo: () => void;
};

export type TableOfContentsProps<T> = BaseTableOfContentsProps<T> & {
    /**
     * Draws one link. It is handed the link's record, whether its section is current together with the interaction
     * state, and the placement for a layout that put it somewhere other than in a run. The record's `depth` is what to
     * indent by. Its text is the link's name.
     */
    renderLink: (
        link: TableOfContentsLink<T>,
        flags: InteractionFlags<TableOfContentsFlags>,
        placement: PlacementRect | undefined,
    ) => ReactNode;
};
