import type { NavigatorOrientation } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { MenuItemKind } from "../Menus/Menu/Menu.types";
import type {
    ToolbarActionRecord,
    ToolbarKeyDefs,
    ToolbarKeyStep,
    ToolbarOverflowDefs,
    ToolbarOverflowItem,
    ToolbarOverflowSource,
} from "./Toolbar.types";

/** The fewest stops a walk needs before an arrow has anywhere to go. */
const WALKABLE_STOPS = 2;
/** A straight row is walked by the arrows that run along it. */
const ROW_ORIENTATION: NavigatorOrientation = "horizontal";
/** A laid-out bar has no single axis, so both pairs of arrows walk it. */
const PLACED_ORIENTATION: NavigatorOrientation = "both";
/** A pressable action that has collapsed becomes a checkbox in the overflow menu. */
const PRESSED_ITEM_KIND: MenuItemKind = "checkbox";
/** The arrows that hand an open menubar menu on to the next word or the previous one. */
const MENU_SWITCH_KEYS = ["ArrowLeft", "ArrowRight"];

/**
 * Decides which toolbar items fit and which go into the overflow menu, and how the row is walked.
 *
 * The row is one tab stop. Its stops are the shown actions the walk can land on, plus the overflow button
 * last while it has anything to hold; the overflow button is named by {@link ToolbarUtils.OVERFLOW_STOP}
 * rather than by a position, since it is not one of the actions.
 */
export namespace ToolbarUtils {
    /** The stop that stands for the overflow button. */
    export const OVERFLOW_STOP = -1;
    /**
     * The items the overflow menu holds, one per collapsed action.
     *
     * Each carries the action's value, its disabled state and its tooltip, so an action is described once whether
     * it is in the row or in the menu. A menubar's word keeps the items of its menu, which become a submenu; a
     * pressable toolbar's action becomes a checkbox, so its pressed state reads as checked.
     *
     * @param actions The bar's actions.
     * @param collapsedIndexes The collapsed ones, from {@link OverflowUtils.computeCut}.
     * @param defs.hasSubmenus Whether the actions are menubar words carrying menus.
     * @param defs.isPressable Whether the actions are toggle buttons.
     * @returns The menu items, in the order the actions were collapsed in.
     */
    export const computeOverflowItems = <T, TItem, TTooltipDefs = unknown>(
        actions: ToolbarOverflowSource<T, TItem, TTooltipDefs>[],
        collapsedIndexes: number[],
        defs: ToolbarOverflowDefs,
    ): ToolbarOverflowItem<T, TItem, TTooltipDefs>[] =>
        collapsedIndexes.map((index) => {
            const action = actions[index];
            const item: ToolbarOverflowItem<T, TItem, TTooltipDefs> = {
                value: action.value,
                isDisabled: action.isDisabled,
                isReachableWhenDisabled: action.isReachableWhenDisabled,
                tooltipDefs: action.tooltipDefs,
            };

            if (defs.hasSubmenus) return { ...item, items: action.items };

            return defs.isPressable ? { ...item, kind: PRESSED_ITEM_KIND } : item;
        });

    /**
     * The actions in the row the walk can land on: shown, and either enabled or kept reachable while disabled.
     *
     * @param actions The bar's actions.
     * @param shownIndexes The shown ones, from {@link OverflowUtils.computeCut}.
     * @returns Their positions, in drawing order. The overflow button is not among them.
     */
    export const computeStops = <T>(actions: ToolbarActionRecord<T>[], shownIndexes: number[]) =>
        shownIndexes.filter((index) => {
            const action = actions[index];

            return !action.isDisabled || (action.isReachableWhenDisabled ?? false);
        });

    /**
     * The stop that holds the row's one tab stop.
     *
     * Where focus last was, while that is still a stop; otherwise the first action, or the overflow button when
     * no action is left to hold it.
     *
     * @param stops The row's stops, from {@link ToolbarUtils.computeStops}.
     * @param focused The stop focus last landed on, if any.
     * @param hasOverflow Whether the overflow button has anything to hold.
     * @returns The stop, or `undefined` when there is nothing to tab to.
     */
    export const computeRovingStop = (stops: number[], focused: number | undefined, hasOverflow: boolean) => {
        if (focused === OVERFLOW_STOP && hasOverflow) return focused;
        if (focused !== undefined && stops.includes(focused)) return focused;

        return stops[0] ?? (hasOverflow ? OVERFLOW_STOP : undefined);
    };

    /**
     * The stop an element belongs to, for keeping the walk's starting point wherever focus actually is.
     *
     * The published toolbar pattern moves the one tab stop to whichever action last took focus, however it got
     * there — so a click on an action, or a tab into it, is where the arrows walk on from. An element inside an action
     * counts as that action; one in the overflow button counts as the overflow stop; anything else, including a menu
     * portaled out of the row, belongs to no stop.
     *
     * @param target The element that took focus.
     * @param itemElements Each action's element, in order.
     * @param overflowElement The overflow button, if there is one.
     * @returns The stop, or `undefined` when the element belongs to none.
     */
    export const computeStopAt = (
        target: EventTarget | null,
        itemElements: (HTMLElement | null | undefined)[],
        overflowElement: HTMLElement | null | undefined,
    ) => {
        if (!(target instanceof Node)) return;
        if (overflowElement?.contains(target)) return OVERFLOW_STOP;

        const index = itemElements.findIndex((element) => element?.contains(target));

        return index < 0 ? undefined : index;
    };

    /**
     * Whether a stop is still there to hold a menu open: the overflow button while it holds anything, or an
     * action still in the walk.
     *
     * @param stop The stop to ask about.
     * @param stops The row's stops.
     * @param hasOverflow Whether the overflow button has anything to hold.
     */
    export const getIsStopPresent = (stop: number, stops: number[], hasOverflow: boolean) =>
        stop === OVERFLOW_STOP ? hasOverflow : stops.includes(stop);

    /**
     * Where focus goes once the action holding it has left the row.
     *
     * A resize can collapse the focused action, and it has just gone into the overflow menu — so focus follows it
     * to the overflow button, or to the first action where there is no overflow button.
     *
     * @param stops The row's stops.
     * @param focused The stop focus last landed on, if any.
     * @param hasOverflow Whether the overflow button has anything to hold.
     * @returns The stop to land on, which may itself be `undefined` when nothing is left, or `undefined` in
     * place of the whole answer while the focused stop is still there.
     */
    export const computeFocusLanding = (stops: number[], focused: number | undefined, hasOverflow: boolean) => {
        if (focused === undefined || focused === OVERFLOW_STOP || stops.includes(focused)) return undefined;

        return { landing: hasOverflow ? OVERFLOW_STOP : stops[0] };
    };

    /**
     * Which stop has its menu open after one stop's menu opens or closes.
     *
     * One value says which stop is open, so opening one closes whichever was open before it. A stop closing only
     * clears the value when it was the one open, so a late close from a menu already switched away from does not
     * close the menu that replaced it.
     *
     * @param open The stop open now, if any.
     * @param stop The stop whose menu changed.
     * @param isOpen Whether it opened.
     */
    export const computeNextOpenStop = (open: number | undefined, stop: number, isOpen: boolean) =>
        isOpen ? stop : open === stop ? undefined : open;

    /**
     * Where a key moves focus along the bar.
     *
     * A key from inside the row walks the stops, overflow button last, wrapping at the ends; the arrows along the
     * row are read the way its text runs, and both pairs walk a laid-out bar. While a menubar's menu is open a
     * left or right arrow pressed inside it that the menu did not use itself also moves on, and switches the open
     * menu with it. A key already claimed by something inside the bar never reaches here.
     *
     * @param key The key pressed.
     * @param defs.isFromRow Whether the key was pressed inside the row, rather than inside a menu the row opened.
     * @param defs.stops The row's stops.
     * @param defs.hasOverflow Whether the overflow button has anything to hold.
     * @param defs.openStop The stop whose menu is open, for a menubar; always `undefined` for a toolbar.
     * @param defs.rovingStop The stop holding the tab stop, from {@link ToolbarUtils.computeRovingStop}.
     * @param defs.isPlaced Whether the bar is laid out.
     * @param defs.direction Which way the row's text runs.
     * @returns The stop to move to and whether the open menu moves with it, or `undefined` for a key the bar
     * leaves alone.
     */
    export const computeKeyStep = (key: string, defs: ToolbarKeyDefs): ToolbarKeyStep | undefined => {
        const { openStop } = defs;

        if (!defs.isFromRow && (openStop === undefined || !MENU_SWITCH_KEYS.includes(key))) return undefined;

        const stops = [...defs.stops, ...(defs.hasOverflow ? [OVERFLOW_STOP] : [])];
        const from = stops.indexOf(openStop ?? defs.rovingStop ?? stops[0]);

        if (stops.length < WALKABLE_STOPS || from < 0) return undefined;

        const position = NavigatorUtils.computeNextPosition(key, from, stops.length, {
            orientation: defs.isPlaced ? PLACED_ORIENTATION : ROW_ORIENTATION,
            direction: defs.isPlaced ? undefined : defs.direction,
        });

        if (position === undefined) return undefined;

        return { stop: stops[position], isSwitch: openStop !== undefined };
    };
}
