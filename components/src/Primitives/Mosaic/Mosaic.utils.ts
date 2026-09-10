import type { Size2d } from "@thewaver/ss-utils";

import type { MosaicPackDefs, MosaicPlacement } from "./Mosaic.types";

/** One flat stretch of the packing frontier: where it starts, how wide it runs, and how high it stands. */
type MosaicSkylineSegment = {
    x: number;
    width: number;
    y: number;
};

/** A candidate position for an item. */
type MosaicSpot = {
    x: number;
    y: number;
};

/** Slack when deciding whether two items really do overlap. Placements arrive from division, so edges meant to line up can be fractions of a pixel apart. */
const CUT_TOLERANCE_PX = 0.5;

/** How high the frontier stands across a stretch, which is where an item of that width would have to sit. */
const getSkylineTop = (skyline: MosaicSkylineSegment[], x: number, width: number) =>
    skyline.reduce(
        (top, segment) => (segment.x + segment.width <= x || segment.x >= x + width ? top : Math.max(top, segment.y)),
        0,
    );

/**
 * The lowest place an item of a given width fits.
 *
 * Only the starts of existing segments are tried, since a lower position elsewhere would mean a
 * segment starting there — so this covers every candidate without scanning every pixel.
 */
const getLowestSpot = (skyline: MosaicSkylineSegment[], width: number, limit: number): MosaicSpot =>
    skyline
        .filter((segment) => segment.x + width <= limit)
        .map((segment) => ({ x: segment.x, y: getSkylineTop(skyline, segment.x, width) }))
        .reduce((lowest, spot) => (spot.y < lowest.y ? spot : lowest));

/**
 * Raises the frontier across a stretch, after an item has been placed there.
 *
 * Segments the stretch covers are trimmed or removed, the new top is inserted, and adjacent segments
 * of the same height are merged back together — without that the frontier would fragment into a
 * segment per item and the search would slow as the packing went on.
 */
const withSkylineTop = (skyline: MosaicSkylineSegment[], x: number, width: number, top: number) => {
    const end = x + width;

    const split = skyline.flatMap((segment) => {
        if (segment.x + segment.width <= x || segment.x >= end) return [segment];

        const head = segment.x < x ? [{ x: segment.x, width: x - segment.x, y: segment.y }] : [];
        const tail =
            segment.x + segment.width > end ? [{ x: end, width: segment.x + segment.width - end, y: segment.y }] : [];

        return [...head, ...tail];
    });

    const sorted = [...split, { x, width, y: top }].sort((a, b) => a.x - b.x);
    const merged: MosaicSkylineSegment[] = [];

    for (const segment of sorted) {
        const last = merged[merged.length - 1];

        if (last && last.y === segment.y && last.x + last.width === segment.x) {
            last.width += segment.width;
        } else {
            merged.push({ ...segment });
        }
    }

    return merged;
};

/** A run of items sharing a row, from one index up to but not including another. */
type MosaicRow = {
    from: number;
    to: number;
};

/** An item reduced to its aspect ratio, which is all the scaled packing needs. */
type MosaicCell = {
    index: number;
    ratio: number;
};

/**
 * How tall a row of items becomes when stretched to fill the width.
 *
 * Items in a row keep their aspect ratios and share the width, so their common height falls out of
 * the ratios: the wider the items, the shorter the row. Reports `Infinity` for a row that cannot fit
 * its own gaps, which is what excludes it from the search.
 */
const getRowExtent = (ratioSums: number[], row: MosaicRow, anchoredExtent: number, gap: number) => {
    const span = anchoredExtent - (row.to - row.from - 1) * gap;
    const ratioSum = ratioSums[row.to] - ratioSums[row.from];

    return span > 0 && ratioSum > 0 ? span / ratioSum : Infinity;
};

/** How tall a whole set of rows comes to, gaps included. */
const getTotalExtent = (rows: MosaicRow[], ratioSums: number[], anchoredExtent: number, gap: number) =>
    rows.reduce((extent, row) => extent + getRowExtent(ratioSums, row, anchoredExtent, gap), 0) +
    (rows.length - 1) * gap;

/**
 * Splits the items into a given number of rows, as evenly as possible.
 *
 * The items keep their order, so the only choice is where to cut — and a greedy pass cuts badly,
 * leaving one row much taller than the rest. This costs every possible set of cuts and keeps the
 * cheapest, charging the square of each row's departure from the target height so one bad row
 * outweighs several slightly wrong ones. Solved by building up from one row at a time, so the work
 * grows with the item count rather than exploding.
 *
 * Gives `undefined` when the items cannot be divided into that many rows at all.
 */
const partitionIntoRows = (
    ratioSums: number[],
    rowCount: number,
    anchoredExtent: number,
    gap: number,
    targetRowExtent: number,
) => {
    const cellCount = ratioSums.length - 1;
    const cost = Array.from({ length: rowCount + 1 }, () => new Array<number>(cellCount + 1).fill(Infinity));
    const cut = Array.from({ length: rowCount + 1 }, () => new Array<number>(cellCount + 1).fill(0));

    cost[0][0] = 0;

    for (let row = 1; row <= rowCount; row++) {
        for (let end = row; end <= cellCount; end++) {
            for (let start = row - 1; start < end; start++) {
                if (cost[row - 1][start] === Infinity) continue;

                const extent = getRowExtent(ratioSums, { from: start, to: end }, anchoredExtent, gap);

                if (extent === Infinity) continue;

                const total = cost[row - 1][start] + (extent - targetRowExtent) ** 2;

                if (total >= cost[row][end]) continue;

                cost[row][end] = total;
                cut[row][end] = start;
            }
        }
    }

    if (cost[rowCount][cellCount] === Infinity) return undefined;

    const rows: MosaicRow[] = [];
    let end = cellCount;

    for (let row = rowCount; row > 0; row--) {
        const from = cut[row][end];

        rows.unshift({ from, to: end });
        end = from;
    }

    return rows;
};

/** Where a placement begins along the axis currently being cut. */
const getBandStart = (placement: MosaicPlacement, isBanded: boolean) => (isBanded ? placement.y : placement.x);

/** Where a placement ends along the axis currently being cut. */
const getBandEnd = (placement: MosaicPlacement, isBanded: boolean) =>
    isBanded ? placement.y + placement.height : placement.x + placement.width;

/**
 * Splits placements into groups that can be separated by a straight cut across one axis.
 *
 * A group ends where the next placement starts beyond everything so far — anything overlapping stays
 * in the same group, since no line could pass between them.
 */
const splitIntoBands = (placements: MosaicPlacement[], isBanded: boolean) => {
    const sorted = [...placements].sort(
        (a, b) => getBandStart(a, isBanded) - getBandStart(b, isBanded) || a.index - b.index,
    );

    const bands: MosaicPlacement[][] = [];
    let frontier = -Infinity;

    for (const placement of sorted) {
        if (!bands.length || getBandStart(placement, isBanded) + CUT_TOLERANCE_PX >= frontier) {
            bands.push([]);
            frontier = -Infinity;
        }

        bands[bands.length - 1].push(placement);
        frontier = Math.max(frontier, getBandEnd(placement, isBanded));
    }

    return bands;
};

/** Orders placements by their top-left corners, as a last resort. */
const compareByReadingCorner = (a: MosaicPlacement, b: MosaicPlacement) => a.y - b.y || a.x - b.x || a.index - b.index;

/**
 * Orders placements by cutting the layout apart, alternating axes.
 *
 * A mosaic has no rows and columns to read along, so reading order is found by splitting it
 * horizontally, splitting each piece vertically, and so on down until every piece holds one item.
 * That gives the order a person's eye follows even for a layout of mixed sizes, where sorting by
 * position alone would jump about.
 *
 * Where a piece cannot be cut on either axis — the items genuinely overlap both ways — it falls back
 * to top-left corner order, which is at least stable.
 */
const cutIntoReadingOrder = (
    placements: MosaicPlacement[],
    isBanded: boolean,
    hasTriedBothAxes: boolean,
): MosaicPlacement[] => {
    if (placements.length < 2) return placements;

    const bands = splitIntoBands(placements, isBanded);

    if (bands.length > 1) return bands.flatMap((band) => cutIntoReadingOrder(band, !isBanded, false));

    if (hasTriedBothAxes) return [...placements].sort(compareByReadingCorner);

    return cutIntoReadingOrder(placements, !isBanded, true);
};

/**
 * Packs items of differing sizes into a mosaic, and works out what order to read them in.
 *
 * Two packings, for two different intentions. The fixed one keeps every item at its own size and
 * fits them together like bricks, leaving gaps where nothing fits. The scaled one keeps every item's
 * aspect ratio but stretches rows to the full width, so there are no gaps at all — the price being
 * that items change size.
 *
 * Both work along one axis and are given the other as fixed, which is what lets a mosaic run either
 * down or across: the caller transposes on the way in and back on the way out.
 */
export namespace MosaicUtils {
    /** Swaps a size's two axes. */
    export const transposeSize = (size: Size2d): Size2d => ({ width: size.height, height: size.width });

    /** Swaps a placement's two axes, so a packing done one way round can be used the other. */
    export const transposePlacement = (placement: MosaicPlacement): MosaicPlacement => ({
        index: placement.index,
        x: placement.y,
        y: placement.x,
        width: placement.height,
        height: placement.width,
    });

    /**
     * How far the packing reached along the free axis.
     *
     * This is the mosaic's own height, once the width has been filled.
     *
     * @param placements The packed placements.
     */
    export const getFreeExtent = (placements: MosaicPlacement[]) =>
        placements.reduce((extent, placement) => Math.max(extent, placement.y + placement.height), 0);

    /**
     * Fits items together at their own sizes, brick fashion.
     *
     * Items are placed tallest first, each into the lowest place it fits, and the frontier of what has
     * been placed is kept as a set of flat stretches rather than as a grid — which is what lets items of
     * any size interlock. Sorting by height first matters: taking them in their own order leaves ledges
     * that nothing later can fill.
     *
     * Items wider than the mosaic keep their width and are reserved against the full width, so an
     * oversized item takes a row of its own rather than being dropped.
     *
     * @param defs.sizes The items' sizes.
     * @param defs.anchoredExtent The width to fill.
     * @param defs.gap The space between items.
     * @returns One placement per item, in the order they were placed rather than the order they were
     * given — each carries its own `index`, so the caller can match them up. Items with no width or
     * height are left out.
     */
    export const packFixed = ({ sizes, anchoredExtent, gap }: MosaicPackDefs): MosaicPlacement[] => {
        const limit = anchoredExtent + gap;
        const cells = sizes
            .map((size, index) => ({ index, width: size.width + gap, height: size.height + gap }))
            .filter((cell) => cell.width > gap && cell.height > gap)
            .sort((a, b) => b.height - a.height || b.width - a.width || a.index - b.index);

        const placements: MosaicPlacement[] = [];
        let skyline: MosaicSkylineSegment[] = [{ x: 0, width: limit, y: 0 }];

        for (const cell of cells) {
            const reserved = Math.min(cell.width, limit);
            const spot = getLowestSpot(skyline, reserved, limit);

            placements.push({
                index: cell.index,
                x: spot.x,
                y: spot.y,
                width: cell.width - gap,
                height: cell.height - gap,
            });

            skyline = withSkylineTop(skyline, spot.x, reserved, spot.y + cell.height);
        }

        return placements;
    };

    /**
     * Fills rows edge to edge, scaling items to make them fit.
     *
     * Items keep their aspect ratios and keep their order; what is chosen is where to break the rows.
     * Every row count is tried, the cuts within each are placed as evenly as possible, and the one whose
     * total height comes closest to the target is kept. The search stops as soon as a row count
     * overshoots the target, since adding rows only makes it taller.
     *
     * @param defs.sizes The items' sizes. Only their aspect ratios are used.
     * @param defs.anchoredExtent The width to fill.
     * @param defs.gap The space between items.
     * @param targetAspectRatio The proportion the whole mosaic should aim for. Without a width it falls
     * back to a square.
     * @returns One placement per item, in reading order. Items with no height are left out, and an empty
     * list comes back when nothing can be placed.
     */
    export const packScaled = (
        { sizes, anchoredExtent, gap }: MosaicPackDefs,
        targetAspectRatio: Size2d,
    ): MosaicPlacement[] => {
        const cells: MosaicCell[] = sizes
            .map((size, index) => ({ index, ratio: size.height > 0 ? size.width / size.height : 0 }))
            .filter((cell) => cell.ratio > 0);

        if (!cells.length) return [];

        const ratioSums = cells.reduce((sums, cell) => [...sums, sums[sums.length - 1] + cell.ratio], [0]);

        const targetExtent =
            targetAspectRatio.width > 0
                ? (anchoredExtent * targetAspectRatio.height) / targetAspectRatio.width
                : anchoredExtent;

        let best: MosaicRow[] | undefined;
        let bestDistance = Infinity;

        for (let rowCount = 1; rowCount <= cells.length; rowCount++) {
            const targetRowExtent = Math.max(0, (targetExtent - (rowCount - 1) * gap) / rowCount);
            const rows = partitionIntoRows(ratioSums, rowCount, anchoredExtent, gap, targetRowExtent);

            if (!rows) continue;

            const extent = getTotalExtent(rows, ratioSums, anchoredExtent, gap);
            const distance = Math.abs(extent - targetExtent);

            if (distance < bestDistance) {
                best = rows;
                bestDistance = distance;
            }

            if (extent >= targetExtent) break;
        }

        if (!best) return [];

        const placements: MosaicPlacement[] = [];
        let y = 0;

        for (const row of best) {
            const extent = getRowExtent(ratioSums, row, anchoredExtent, gap);
            let x = 0;

            for (let at = row.from; at < row.to; at++) {
                const width = cells[at].ratio * extent;

                placements.push({ index: cells[at].index, x, y, width, height: extent });
                x += width + gap;
            }

            y += extent + gap;
        }

        return placements;
    };

    /**
     * Orders placements the way a person's eye would follow them.
     *
     * This is what the keyboard and a screen reader walk, so it has to match what is seen rather than the
     * order the items were given in.
     *
     * @param placements The packed placements.
     * @returns The same placements, reordered.
     */
    export const sortIntoReadingOrder = (placements: MosaicPlacement[]) => cutIntoReadingOrder(placements, true, false);
}
