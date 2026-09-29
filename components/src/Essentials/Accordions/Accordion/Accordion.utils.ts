import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { AccordionItem } from "./Accordion.types";

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
     * @param key The key that was pressed.
     * @param headers Each section's header element, by section index.
     * @param navigable What {@link computeNavigableIndexes} answered.
     * @param active The element focus is on now.
     * @returns The index of the header to focus, or `undefined` when the key is not the accordion's to answer.
     */
    export const computeFocusTarget = (
        key: string,
        headers: readonly (HTMLElement | null | undefined)[],
        navigable: number[],
        active: Element | null,
    ) => {
        const focused = headers.findIndex((header) => active !== null && header === active);

        if (navigable.length < 1 || focused < 0) return undefined;

        const position = NavigatorUtils.computeNextPosition(key, navigable.indexOf(focused), navigable.length);

        return position === undefined ? undefined : navigable[position];
    };
}
