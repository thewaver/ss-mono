import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { CollapsibleSide } from "../Collapsible/Collapsible.types";
import type {
    AccordionItem,
    AccordionMoveDirection,
    AccordionOrientation,
    AccordionSizing,
    AccordionWidthOpts,
} from "./Accordion.types";

const NO_WIDTH = 0;

/** The part of an accordion that is not about drawing it: which sections open, and how the arrow keys walk them. */
export namespace AccordionUtils {
    /**
     * The positions of the sections the arrow keys may land on.
     *
     * A disabled section is skipped unless it asked to stay reachable, in which case focus can land on it and read
     * its name even though it cannot be opened.
     *
     * @param items The sections, in the order they are shown.
     * @returns Their indexes, in order, with the unreachable ones left out.
     */
    export const computeNavigableIndexes = <T>(items: AccordionItem<T>[]) =>
        items.reduce<number[]>((acc, item, index) => {
            if (!item.isDisabled || item.isReachableWhenDisabled) acc.push(index);

            return acc;
        }, []);

    /**
     * The open sections after one header is pressed.
     *
     * Pressing an open header closes it and pressing a closed one opens it, except that the last open section stays
     * open when one is required, and that opening a section closes the rest when only one may be open.
     *
     * @param expanded The values of the sections open now.
     * @param value The value of the section whose header was pressed.
     * @param opts.isSingleExpand Whether at most one section may be open.
     * @param opts.isExpandRequired Whether the last open section refuses to close.
     * @returns The new list, or `expanded` itself when nothing changes.
     */
    export const computeToggled = <T>(
        expanded: T[],
        value: T,
        opts: { isSingleExpand?: boolean; isExpandRequired?: boolean },
    ) => {
        const isExpanded = expanded.includes(value);
        const isLastExpanded = isExpanded && expanded.length === 1;

        if (isLastExpanded && (opts.isExpandRequired ?? false)) return expanded;

        if (opts.isSingleExpand) return isExpanded ? [] : [value];

        return isExpanded ? expanded.filter((entry) => entry !== value) : [...expanded, value];
    };

    /**
     * The header a key press moves focus to.
     *
     * The walk runs over the reachable headers only and wraps at the ends, with Home and End going to the first and
     * last of them. It answers nothing when focus is not on a header, so a key pressed inside an open panel is left
     * to the panel.
     *
     * The arrows that walk are the ones along the accordion: up and down for a column, left and right for a row,
     * where the text's direction decides which of the two goes forward.
     *
     * @param key The key that was pressed.
     * @param headers Each section's header element, by section index.
     * @param navigable What {@link computeNavigableIndexes} answered.
     * @param active The element focus is on now.
     * @param opts.orientation Which way the sections run. Left out, a column.
     * @param opts.direction Which way the page's text runs, which only a row reads.
     * @returns The index of the header to focus, or `undefined` when the key is not the accordion's to answer.
     */
    export const computeFocusTarget = (
        key: string,
        headers: readonly (HTMLElement | null | undefined)[],
        navigable: number[],
        active: Element | null,
        opts?: { orientation?: AccordionOrientation; direction?: NavigatorDirection },
    ) => {
        const focused = headers.findIndex((header) => active !== null && header === active);

        if (navigable.length < 1 || focused < 0) return undefined;

        const orientation = opts?.orientation ?? "vertical";
        const position = NavigatorUtils.computeNextPosition(key, navigable.indexOf(focused), navigable.length, {
            orientation,
            direction: orientation === "horizontal" ? opts?.direction : undefined,
        });

        return position === undefined ? undefined : navigable[position];
    };

    /**
     * Which side each section's panel opens toward: below its header in a column, beside it in a row.
     *
     * @param orientation Which way the sections run.
     */
    export const getPanelSide = (orientation: AccordionOrientation): CollapsibleSide =>
        orientation === "horizontal" ? "right" : "bottom";

    /**
     * Which way the open sections moved when the open set changed, so a panel's content can slide in from the side
     * the person came from.
     *
     * A section that opened is compared with one that closed in the same change, or, when nothing closed, with the
     * nearest section that was already open. Later in the list is forward and earlier is backward, whichever way the
     * list runs on screen.
     *
     * @param previous The positions of the sections open before.
     * @param next The positions of the sections open now.
     * @returns The direction, or `undefined` when nothing opened or nothing was open to move from.
     */
    export const computeMoveDirection = (
        previous: readonly number[],
        next: readonly number[],
    ): AccordionMoveDirection | undefined => {
        const opened = next.find((index) => !previous.includes(index));

        if (opened === undefined) return undefined;

        const closed = previous.find((index) => !next.includes(index));
        const from =
            closed ??
            previous.reduce<number | undefined>(
                (nearest, index) =>
                    nearest === undefined || Math.abs(index - opened) < Math.abs(nearest - opened) ? index : nearest,
                undefined,
            );

        if (from === undefined) return undefined;

        return opened > from ? "forward" : "backward";
    };

    /**
     * A panel width from {@link computeOpenWidths} as CSS.
     *
     * @param width The width in pixels, or `undefined` for none.
     * @returns The width with its unit, or `undefined`, which leaves the panel as wide as its content.
     */
    export const toWidthStyle = (width: number | undefined) => (width === undefined ? undefined : `${width}px`);

    /**
     * Whether a row's open panels take widths from the row rather than from their content.
     *
     * Only a row with a width of its own can hand one out: a column's panels grow in height, and a row sized to fit its
     * content would be asking its panels how wide to be while they ask it.
     *
     * @param orientation Which way the sections run.
     * @param sizing Whether the accordion fills its container.
     */
    export const getHasRowWidths = (orientation: AccordionOrientation, sizing: AccordionSizing) =>
        orientation === "horizontal" && sizing === "fill";

    /**
     * How wide each open section's panel is in a row, from the open width its item carries and the room left over.
     *
     * A section with an `openWidthShare` takes that share of the row, its header strip included, so its panel is
     * the share less the strip. The open sections without one split evenly whatever the closed strips, the gaps and
     * the shared sections leave. When the shares ask for more than the row has, they are scaled down together until
     * they fit, and the unshared sections get nothing. A closed section keeps the width it last had, so its content
     * does not reflow while it folds away.
     *
     * @param items The sections, in the order they are shown.
     * @param expandedIndexes The positions of the open sections.
     * @param opts The row's measurements.
     * @param previous The widths this returned last time, which a closed section keeps.
     * @returns One panel width per section, in pixels, or `undefined` for a section never yet opened, which is left
     * as wide as its content.
     */
    export const computeOpenWidths = <T>(
        items: readonly AccordionItem<T>[],
        expandedIndexes: readonly number[],
        opts: AccordionWidthOpts,
        previous: readonly (number | undefined)[] = [],
    ): (number | undefined)[] => {
        const stripTotal = items.reduce((sum, _, index) => sum + (opts.stripWidths[index] ?? NO_WIDTH), NO_WIDTH);
        const gapTotal = Math.max(items.length - 1, NO_WIDTH) * opts.gap;
        const freeWidth = Math.max(opts.rowWidth - stripTotal - gapTotal, NO_WIDTH);
        const getStrip = (index: number) => opts.stripWidths[index] ?? NO_WIDTH;

        const sharedIndexes = expandedIndexes.filter((index) => items[index]?.openWidthShare !== undefined);
        const fillIndexes = expandedIndexes.filter((index) => items[index]?.openWidthShare === undefined);

        const askedWidths = sharedIndexes.map((index) =>
            Math.max(items[index].openWidthShare! * opts.rowWidth - getStrip(index), NO_WIDTH),
        );
        const askedTotal = askedWidths.reduce((sum, width) => sum + width, NO_WIDTH);
        const sharedScale = askedTotal > freeWidth && askedTotal > NO_WIDTH ? freeWidth / askedTotal : 1;
        const fillWidth =
            fillIndexes.length > 0
                ? Math.max(freeWidth - askedTotal * sharedScale, NO_WIDTH) / fillIndexes.length
                : NO_WIDTH;

        return items.map((_, index) => {
            const sharedAt = sharedIndexes.indexOf(index);

            if (sharedAt >= 0) return askedWidths[sharedAt] * sharedScale;
            if (fillIndexes.includes(index)) return fillWidth;

            return previous[index];
        });
    };
}
