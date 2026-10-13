import type { Accessor, JSX } from "solid-js";

import type {
    BaseTableOfContentsCbs,
    BaseTableOfContentsValues,
    InteractionFlags,
    PlacementRect,
    TableOfContentsFlags,
    TableOfContentsLink,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor } from "../../Utils/typeUtils";

export type TableOfContentsItemProps<T> = AccessorProps<Omit<InteractionControlProps<TableOfContentsFlags>, "id">> & {
    /** The link this item stands for. */
    link: MaybeAccessor<TableOfContentsLink<T>>;
    /** Runs once a press has taken the reader to the link's target. */
    onGo: () => void;
};

export type TableOfContentsProps<T> = AccessorValues<BaseTableOfContentsValues<T>> &
    BaseTableOfContentsCbs<T> & {
        /**
         * Draws one link. It is handed the link's record, whether its section is current together with the
         * interaction state, and the placement for a layout that put it somewhere other than in a run. The record's
         * `depth` is what to indent by. Its text is the link's name.
         */
        renderLink: (
            getLink: Accessor<TableOfContentsLink<T>>,
            getFlags: () => InteractionFlags<TableOfContentsFlags>,
            getPlacement: () => PlacementRect | undefined,
        ) => JSX.Element;
    };
