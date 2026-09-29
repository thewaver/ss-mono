import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import type { Tab, TabsFloaterBounds, TabsKeyStep, TabsOrientation } from "./Tabs.types";

/** A placement's position is its center, so the box starts half its size back from it. */
const HALF = 0.5;

/** A placement with no angle is drawn upright. */
const NO_ANGLE = 0;

/**
 * The part of a tab strip that is not about drawing it: which tab is selected, which one holds the tab stop, where
 * an arrow key goes, and where the selected marker sits.
 */
export namespace TabsUtils {
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

    /**
     * Where the selected marker's box goes for a tab a layout placed.
     *
     * @param placement The placement the layout gave the selected tab.
     * @returns The box, in shares of the strip's width so it scales with it, turned the way the tab was.
     */
    export const computePlacedBounds = (placement: PlacementRect): TabsFloaterBounds => ({
        top: PlacementUtils.toContainerWidth(placement.topShare - placement.heightShare * HALF),
        left: PlacementUtils.toContainerWidth(placement.leftShare - placement.widthShare * HALF),
        width: PlacementUtils.toContainerWidth(placement.widthShare),
        height: PlacementUtils.toContainerWidth(placement.heightShare),
        transform: `rotate(${placement.angle ?? NO_ANGLE}deg)`,
    });

    /**
     * Where the selected marker's box goes, and keeps going, for a strip laid out as a plain row or column.
     *
     * The box is the one around the selected tab, measured against the strip, and it is measured again whenever
     * either of the two changes size — so a label that grows, or a strip that is squeezed, carries the marker with
     * it. The first reading arrives as soon as observing starts.
     *
     * @param root The strip itself.
     * @param item The selected tab's element. Its offset parent, the box the tab is wrapped in, is what is measured.
     * @param onBounds Called with each reading.
     * @returns The function that stops measuring. Nothing is measured, and stopping does nothing, when the tab has no
     * box around it yet.
     */
    export const observeSelectedBounds = (
        root: HTMLElement,
        item: HTMLElement,
        onBounds: (bounds: TabsFloaterBounds) => void,
    ) => {
        const wrapper = item.offsetParent as HTMLElement | null;

        if (!wrapper) return () => {};

        const observer = new ResizeObserver(() => {
            onBounds({
                top: `${wrapper.offsetTop}px`,
                left: `${wrapper.offsetLeft}px`,
                width: `${wrapper.offsetWidth}px`,
                height: `${wrapper.offsetHeight}px`,
            });
        });

        observer.observe(root);
        observer.observe(wrapper);

        return () => observer.disconnect();
    };
}
