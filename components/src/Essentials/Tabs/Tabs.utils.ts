import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { Tab, TabsKeyStep, TabsOrientation } from "./Tabs.types";

/** What the library prints when tabs that switch in place are not wired to their panels. */
const UNPAIRED_WARNING =
    "a tab switching in place needs an id and a panelId, and a TabPanel carrying the other end of the pair, or a screen reader is never told which panel a tab opens.";

/**
 * The part of a tab strip that is not about drawing it: which tab is selected, which one holds the tab stop, where
 * an arrow key goes, and where the selected marker sits.
 */
export namespace TabsUtils {
    /**
     * Warns, in the console, that tabs are not wired to their panels.
     *
     * Call it once per tab strip, when it is set up. A tab that switches in place must name the panel it opens
     * (`panelId`) and be named back by it (`id`); without both, assistive technology cannot tell which panel a tab
     * controls. A tab with an `href` is left out, since it navigates to a page of its own rather than opening a panel
     * beside the strip. Nothing is blocked or filled in, and the warning is printed once however many tabs are
     * missing the pairing.
     *
     * @param tabs The tabs, in the order they are shown.
     */
    export const warnIfUnpaired = <T>(tabs: Tab<T>[]) => {
        const unpaired = tabs.flatMap((tab, index) =>
            tab.href === undefined && (tab.id === undefined || tab.panelId === undefined) ? [index] : [],
        );

        if (unpaired.length < 1) return;

        console.warn(
            `Tabs: the tabs at position ${unpaired.join(", ")} are not wired to a panel — ${UNPAIRED_WARNING}`,
        );
    };

    /**
     * Where the selected tab sits in the list.
     *
     * @param tabs The tabs, in the order they are shown.
     * @param selectedValue The value that is selected, compared with each tab's by identity.
     * @returns Its index, or `-1` when no tab carries that value — including when nothing is selected.
     */
    export const computeSelectedIndex = <T>(tabs: Tab<T>[], selectedValue: T | undefined) =>
        tabs.findIndex((tab) => tab.value === selectedValue);

    /**
     * The tabs the arrow keys walk, as indexes into the list.
     *
     * A disabled tab is left out unless it asked to stay reachable, so the walk steps over it rather than landing on
     * something that cannot be used and says nothing about why.
     *
     * @param tabs The tabs, in the order they are shown.
     * @returns The indexes of the walkable tabs, in order.
     */
    export const computeNavigableIndexes = <T>(tabs: Tab<T>[]) =>
        tabs.reduce<number[]>((acc, tab, index) => {
            if (!tab.isDisabled || tab.isReachableWhenDisabled) acc.push(index);

            return acc;
        }, []);

    /**
     * Which tab holds the strip's single tab stop.
     *
     * The tab the arrows last moved to keeps it; failing that, the selected tab does, so tabbing into the strip lands
     * on the choice already made; failing that, the first walkable tab.
     *
     * @param tabs The tabs, in the order they are shown.
     * @param selectedValue The value that is selected.
     * @param focusedValue The value of the tab the arrows last moved to, if they have moved since the selection last
     * changed.
     * @returns The index of the tab to make tabbable, or `undefined` when no tab can take focus at all — which is
     * what drops the strip out of the tab order.
     */
    export const computeRovingIndex = <T>(
        tabs: Tab<T>[],
        selectedValue: T | undefined,
        focusedValue: T | undefined,
    ) => {
        const navigable = computeNavigableIndexes(tabs);
        const focusedIndex = navigable.find((index) => tabs[index].value === focusedValue);

        if (focusedIndex !== undefined) return focusedIndex;

        const selectedIndex = computeSelectedIndex(tabs, selectedValue);

        if (navigable.includes(selectedIndex)) return selectedIndex;

        return navigable[0];
    };

    /**
     * Where an arrow, Home or End key sends focus, and whether it takes the selection along.
     *
     * The walk runs over the walkable tabs only and wraps at both ends. It selects the tab it lands on only when the
     * strip activates automatically, the tab is not disabled, and it is not already the selected one — so a reachable
     * disabled tab can be landed on without ever being chosen.
     *
     * @param key The `key` of the keyboard event.
     * @param tabs The tabs, in the order they are shown.
     * @param opts.selectedValue The value that is selected.
     * @param opts.focusedValue The value of the tab the arrows last moved to, as {@link computeRovingIndex} takes it.
     * @param opts.orientation Which pair of arrows walks the strip.
     * @param opts.direction Which way the tabs run across the screen. Leave it out for tabs a layout placed, which do
     * not follow the flow of text.
     * @param opts.hasAutoActivation Whether landing on a tab selects it.
     * @returns Where focus goes, or `undefined` when the key means nothing here and should be left alone.
     */
    export const computeKeyStep = <T>(
        key: string,
        tabs: Tab<T>[],
        opts: {
            selectedValue: T | undefined;
            focusedValue: T | undefined;
            orientation: TabsOrientation;
            direction: NavigatorDirection | undefined;
            hasAutoActivation: boolean;
        },
    ): TabsKeyStep<T> | undefined => {
        const navigable = computeNavigableIndexes(tabs);

        if (navigable.length < 1) return;

        const from = navigable.indexOf(computeRovingIndex(tabs, opts.selectedValue, opts.focusedValue) ?? navigable[0]);
        const position = NavigatorUtils.computeNextPosition(key, from, navigable.length, {
            orientation: opts.orientation,
            direction: opts.direction,
        });

        if (position === undefined) return;

        const index = navigable[position];
        const tab = tabs[index];

        return {
            index,
            value: tab.value,
            isSelecting: opts.hasAutoActivation && !tab.isDisabled && tab.value !== opts.selectedValue,
        };
    };
}
