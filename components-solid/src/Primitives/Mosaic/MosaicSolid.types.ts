import type { Accessor, JSX } from "solid-js";

import type {
    MosaicImageSource,
    MosaicItemState,
    MosaicPackDefs,
    MosaicPlacement,
    MosaicState,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type MosaicWalkProps =
    | AccessorProps<{
          /**
           * Names the mosaic for assistive technology. Required with {@link MosaicWalkProps.onActivate}, since a
           * set of tiles walked as one stop is announced by this name before any tile is.
           */
          ariaLabel: string;
          /**
           * Runs when a tile is pressed, or activated with Enter or Space, and is told which item it was, counting
           * in the order the items were given. Giving it makes the mosaic a single tab stop: Left and Right walk
           * the reading order, Up and Down go to the tile below or above that overlaps this one the most, and
           * Home and End go to the first and last.
           */
          onActivate: (index: number) => void;
      }>
    | {
          /** Only with {@link MosaicWalkProps.onActivate}; a mosaic that is not walked is not a stop to name. */
          ariaLabel?: undefined;
          /** Left out, the mosaic is no tab stop of its own and whatever the tiles hold takes focus as usual. */
          onActivate?: undefined;
      };

export type MosaicProps = AccessorProps<
    MosaicState & {
        /**
         * Whether the tiles have sizes of their own that the packing has to honor, rather than being given whatever
         * shape is left.
         */
        isItemSized: boolean;
        /** The size of each tile, where they have their own. */
        sizes: Size2d[];
        /** Packs the tiles, answering with a rectangle each. */
        computePlacements: (defs: MosaicPackDefs) => MosaicPlacement[];
        /**
         * What each tile is, in the order the items were given. A tile keeps its element for as long as its key
         * is in the list, so taking one out moves the others rather than handing each the next one's contents.
         * Left out, a tile is known by its position.
         */
        keys?: unknown[];
        /** Names the mosaic, when it is walked by the arrow keys. */
        ariaLabel?: string;
        /** Makes the mosaic one tab stop walked by the arrow keys, and runs when a tile is activated. */
        onActivate?: (index: number) => void;
        /** Draws one tile, and is told which item it is and how it was placed. */
        renderItem: (getIndex: Accessor<number>, getState: Accessor<MosaicItemState>) => JSX.Element;
    }
>;

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
