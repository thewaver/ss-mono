import type { Accessor, JSX } from "solid-js";

import type {
    BaseMosaicCbs,
    BaseMosaicValues,
    BaseMosaicWalkProps,
    MosaicImageSource,
    MosaicItemState,
    MosaicState,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, AccessorValues, MaybeAccessor } from "../../Utils/typeUtils";

export type MosaicWalkProps = BaseMosaicWalkProps<MaybeAccessor<string>>;

export type MosaicProps = AccessorValues<BaseMosaicValues> &
    BaseMosaicCbs & {
        /** Draws one tile, and is told which item it is and how it was placed. */
        renderItem: (getIndex: Accessor<number>, getState: Accessor<MosaicItemState>) => JSX.Element;
    };

export type ImageMosaicProps = MosaicWalkProps &
    AccessorProps<
        MosaicState & {
            /**
             * The pictures to pack. A tile is known by its picture's address, so taking one out moves the others
             * rather than handing each the next one's picture.
             */
            sources: MosaicImageSource[];
            /** The shape the mosaic aims to come out as. */
            targetAspectRatio?: Size2d;
            /** Draws one tile. The picture is handed in rather than built, so the consumer decides what surrounds it. */
            renderItem?: (renderImage: () => JSX.Element, getState: Accessor<MosaicItemState>) => JSX.Element;
        }
    >;

export type ElementMosaicProps<T> = AccessorProps<MosaicState> &
    MosaicWalkProps & {
        /**
         * The items to pack. Each one keeps its own element for as long as it is in the list, so taking one out
         * moves the others rather than handing each the next one's contents.
         */
        items: MaybeAccessor<T[]>;
        /** Draws one item, and is told how it was placed. */
        renderItem: (getItem: Accessor<T>, getState: Accessor<MosaicItemState>) => JSX.Element;
    };
