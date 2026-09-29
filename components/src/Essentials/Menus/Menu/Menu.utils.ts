import type { Point2d } from "@thewaver/ss-utils";

import { InteractionTrackerUtils } from "../../../Abstracts/InteractionTracker/InteractionTracker.utils";
import type { NavigatorOrientation } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { PlacementLayout } from "../../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../../Abstracts/Placement/Placement.utils";
import { SelectionUtils } from "../../../Abstracts/Selection/Selection.utils";
import { TypeaheadUtils } from "../../../Abstracts/Typeahead/Typeahead.utils";
import { ViewportUtils } from "../../../Abstracts/Viewport/Viewport.utils";
import { PopoverUtils } from "../../../Primitives/Popover/Popover.utils";
import type {
    MenuActivation,
    MenuContextRequestDefs,
    MenuFlickDefs,
    MenuFlickHandlers,
    MenuHighlightDefs,
    MenuHighlightPosition,
    MenuItemKind,
    MenuItemRecord,
    MenuItemRole,
    MenuLevelKeyDefs,
    MenuLevelKeyStep,
    MenuRun,
    MenuSubmenuMode,
} from "./Menu.types";

/** What a menu level's popup root carries, and so how an item finds the popup it is drawn in. */
const MENU_POPUP_SELECTOR = '[role="menu"]';

/** An item that does not say otherwise is a plain command. */
const DEFAULT_MENU_ITEM_KIND: MenuItemKind = "command";

/** The role each kind of item announces. */
const MENU_ITEM_ROLES: Record<MenuItemKind, MenuItemRole> = {
    command: "menuitem",
    checkbox: "menuitemcheckbox",
    radio: "menuitemradio",
};

/** Where the back entry sits in a level that has one: first, ahead of the level's own items. */
const BACK_INDEX = 0;
/** The depth of the first level, which has nothing above it to step back to. */
const ROOT_DEPTH = 0;
/** The key that leaves the menu altogether, taking focus on to whatever comes next. */
const DISMISS_KEY = "Tab";
/** The key that opens a submenu in a straight menu, read as though the text ran left to right. */
const SUBMENU_OPEN_KEY = "ArrowRight";
/** The key that closes a submenu in a straight menu, read as though the text ran left to right. */
const SUBMENU_CLOSE_KEY = "ArrowLeft";
/** The key that steps out of one band of a laid-out menu. */
const LEVEL_CLOSE_KEY = "Escape";
/** A laid-out menu has no single axis, so both pairs of arrows walk it. */
const PLACED_ORIENTATION: NavigatorOrientation = "both";
/** The keys that open a closed menu from its trigger onto the first item. */
const TRIGGER_FIRST_KEYS = ["ArrowDown"];
/** The key that opens a closed menu from its trigger onto the last item. */
const TRIGGER_LAST_KEY = "ArrowUp";
/** The key some keyboards carry for opening a context menu. */
const CONTEXT_MENU_KEY = "ContextMenu";
/** Pressed with Shift, the context-menu key on keyboards without one. */
const CONTEXT_MENU_FALLBACK_KEY = "F10";
/** Where a `contextmenu` event raised from the keyboard claims the pointer was. */
const ORIGIN_COORDINATE = 0;
/** How far apart two readings may be, in pixels, and still be the pointer staying put. */
const SAME_POINT_PX = 1;
/** How far a flick has to travel before it picks anything, as a share of the layout's width. */
const FLICK_TRAVEL_RATIO = 0.1;
/** A box with no width, which nothing can be measured against. */
const NO_WIDTH = 0;
/** The middle of a box, as a share of its size. */
const BOX_CENTER = 0.5;
/** A whole, in percent. */
const FULL_PERCENT = 100;
/** A width that says nothing is known yet. */
const NO_EXTENT = 0;
/** A level with no item that opens a submenu of its own. */
const NO_ITEMS = 0;
/** How many readers of the pointer point there are before the first one starts. */
const NO_READERS = 0;
/** One reader of the pointer point. */
const ONE_READER = 1;

/** The last point the pointer moved to, while anything is reading it. */
let pointerPoint: Point2d | undefined;
/** How many menus are reading the pointer point, so the listener goes once the last of them stops. */
let pointerReaderCount = NO_READERS;

/** Records where the pointer moved to. */
const handlePointerPointMove = (e: PointerEvent) => {
    pointerPoint = { x: e.clientX, y: e.clientY };
};

/** The point a pointer event happened at. */
const toPoint = (e: PointerEvent): Point2d => ({ x: e.clientX, y: e.clientY });

/**
 * The rules a menu follows, written once for every framework's view.
 *
 * A menu is written as one list, but a screen reader needs to know which items are radio choices
 * belonging together — a group of three is announced as "1 of 3" only if something says where the
 * group starts and ends. Adjacency is what defines a group, so no explicit grouping is asked of the
 * caller. Beside that sit the rules for one level of a menu — which entries it has, which of them the
 * walk reaches, where the highlight is, what a key or a flick does — and the listeners a menu keeps on
 * the document, so a view holds the state and draws the markup and decides nothing else.
 */
export namespace MenuUtils {
    /** An item's kind, filled in where it was left out. */
    export const getKind = <T>(item: MenuItemRecord<T>): MenuItemKind => item.kind ?? DEFAULT_MENU_ITEM_KIND;

    /** Whether an item carries a state of its own — a checkbox or a radio choice — rather than simply being pressed. */
    export const getIsStateful = <T>(item: MenuItemRecord<T>) => getKind(item) !== "command";

    /**
     * The role an item announces.
     *
     * A command is a `menuitem`, a checkbox a `menuitemcheckbox` and a radio choice a `menuitemradio`, which is
     * what tells a reader whether pressing it does something or changes a state it holds.
     *
     * @param kind The item's kind, from {@link MenuUtils.getKind}.
     */
    export const getItemRole = (kind: MenuItemKind): MenuItemRole => MENU_ITEM_ROLES[kind];

    /**
     * Scrolls a highlighted item into view inside its own menu, and never scrolls the page.
     *
     * An item is highlighted the moment its menu opens, while the popup is still unplaced, so the page's own scrolling
     * must stay out of it; this moves only the scrollers inside the level's popup, through
     * {@link PopoverUtils.revealWithin}. An item drawn outside a menu popup moves nothing.
     *
     * @param item The item's element.
     */
    export const revealItem = (item: HTMLElement) => {
        const popup = item.closest<HTMLElement>(MENU_POPUP_SELECTOR);

        if (popup) PopoverUtils.revealWithin(item, popup);
    };

    /**
     * Whether picking an item leaves the menu open.
     *
     * The item's own `staysOpenOnPick` when it gives one. Otherwise it follows the kind: a checkbox keeps
     * the menu open so several can be toggled in one visit, and a radio choice or a command closes it.
     * `Menu` and `ContextMenu` both ask here, so the two cannot disagree.
     */
    export const getStaysOpenOnPick = <T>(item: MenuItemRecord<T>) =>
        item.staysOpenOnPick ?? getKind(item) === "checkbox";

    /**
     * The checked list a menu should hold after one of its stateful items is picked.
     *
     * A checkbox toggles, so it comes out of the list when it was in it and goes in when it was not. A
     * radio replaces its whole group instead: every value belonging to the group is dropped first, so
     * exactly one of them survives. The caller is spared having to know which of the two rules applies,
     * and `Menu` and `ContextMenu` cannot drift apart on it.
     *
     * @param checked What is checked now.
     * @param item The item being picked. A command never reaches here and is treated as a radio if it does.
     * @param radioGroupValues Every value in the radio group the item belongs to, from
     * {@link MenuUtils.getRadioGroupValues}. Unread for a checkbox.
     * @returns The new list. A fresh array; the one handed in is not touched.
     */
    export const computeNextChecked = <T>(checked: T[], item: MenuItemRecord<T>, radioGroupValues: T[]): T[] =>
        getKind(item) === "checkbox"
            ? SelectionUtils.getToggled(checked, item.value)
            : [...checked.filter((value) => !radioGroupValues.includes(value)), item.value];

    /**
     * The values of the radio group an item belongs to.
     *
     * For the item's own state: a radio choice is selected when the menu's value is its own, and it
     * needs its group's values to know what the alternatives were.
     *
     * @param items The menu's items.
     * @param index The item to ask about.
     * @returns The values of every radio item adjacent to it, itself included, or an empty list when it
     * is not a radio item.
     */
    export const getRadioGroupValues = <T>(items: MenuItemRecord<T>[], index: number): T[] => {
        if (items[index] === undefined || getKind(items[index]) !== "radio") return [];

        let from = index;
        let to = index;

        while (from > 0 && getKind(items[from - 1]) === "radio") from--;
        while (to < items.length - 1 && getKind(items[to + 1]) === "radio") to++;

        return items.slice(from, to + 1).map((item) => item.value);
    };

    /**
     * Splits the items into consecutive runs, radio items grouped.
     *
     * @param items The menu's items, in order.
     * @returns One run per group of adjacent radio items and one per item of any other kind, each
     * carrying the index it starts at so a caller can map back to the original list. A run marked
     * `isRadioGroup` is what gets wrapped in a group element.
     */
    export const getRuns = <T, TItem extends MenuItemRecord<T>>(items: TItem[]): MenuRun<TItem>[] => {
        const runs: MenuRun<TItem>[] = [];

        items.forEach((item, index) => {
            const isRadio = getKind(item) === "radio";
            const last = runs[runs.length - 1];

            if (isRadio && last?.isRadioGroup) {
                last.items.push(item);

                return;
            }

            runs.push({ from: index, items: [item], isRadioGroup: isRadio });
        });

        return runs;
    };

    /**
     * Whether a level starts with a back entry that steps out to the level above.
     *
     * Only a level that replaces the one it came from has one, since a stacked level leaves its parent on
     * screen to go back to; and only a submenu, since the first level came from nothing.
     *
     * @param submenuMode How the menu's levels are drawn.
     * @param hasOpener Whether an item opened this level.
     */
    export const getHasBackEntry = (submenuMode: MenuSubmenuMode, hasOpener: boolean) =>
        submenuMode === "replace" && hasOpener;

    /**
     * Whether the entry at a position is the back entry.
     *
     * @param hasBackEntry Whether the level has one, from {@link MenuUtils.getHasBackEntry}.
     * @param index The position among the level's entries.
     */
    export const getIsBackAt = (hasBackEntry: boolean, index: number) => hasBackEntry && index === BACK_INDEX;

    /**
     * The entries a level shows, in order.
     *
     * The level's own items, with the item that opened it put in front where the level has a back entry:
     * the opener re-drawn at the head of the level is the way back out, and it is an entry like any other —
     * in the walk, in the layout's geometry, carrying the opener's own name.
     *
     * @param items The level's own items.
     * @param openerItem The item that opened this level, for a submenu.
     * @param submenuMode How the menu's levels are drawn.
     * @returns The entries. The list handed in when there is no back entry, so its identity carries over.
     */
    export const computeEntries = <TItem>(
        items: TItem[],
        openerItem: TItem | undefined,
        submenuMode: MenuSubmenuMode,
    ): TItem[] =>
        getHasBackEntry(submenuMode, openerItem !== undefined) && openerItem ? [openerItem, ...items] : items;

    /**
     * Which entries the arrow keys can land on.
     *
     * Every entry that is not disabled, and a disabled one that asked to stay reachable.
     *
     * @param entries The level's entries, from {@link MenuUtils.computeEntries}.
     * @returns Their positions, in order.
     */
    export const computeNavigableIndexes = <T>(entries: MenuItemRecord<T>[]) =>
        entries.reduce<number[]>((acc, item, index) => {
            const isReachable = InteractionTrackerUtils.computeIsReachable(
                item.isDisabled ?? false,
                item.isReachableWhenDisabled ?? false,
            );

            if (!item.isDisabled || isReachable) acc.push(index);

            return acc;
        }, []);

    /**
     * Whether an entry opens a submenu of its own.
     *
     * An entry with children does, except the back entry, which carries its opener's children but only ever
     * steps out.
     *
     * @param entries The level's entries.
     * @param index The entry to ask about.
     * @param hasBackEntry Whether the level has a back entry.
     */
    export const getHasSubmenu = <T>(entries: MenuItemRecord<T>[], index: number, hasBackEntry: boolean) =>
        !getIsBackAt(hasBackEntry, index) && (entries[index]?.items?.length ?? NO_ITEMS) > NO_ITEMS;

    /**
     * Whether hovering or picking an entry opens its submenu: it has one, and it is not disabled.
     *
     * @param entries The level's entries.
     * @param index The entry to ask about.
     * @param hasBackEntry Whether the level has a back entry.
     */
    export const getOpensSubmenu = <T>(entries: MenuItemRecord<T>[], index: number, hasBackEntry: boolean) =>
        getHasSubmenu(entries, index, hasBackEntry) && !entries[index].isDisabled;

    /**
     * Which entry is highlighted.
     *
     * The entry holding the highlighted value, while the walk can reach it. With nothing highlighted yet the
     * level falls back to where it was opened towards — the last entry after the up arrow, otherwise the first
     * entry that is not the way back. A closed level highlights nothing, so a menu fading out does not show
     * its highlight jumping home as it goes.
     *
     * @param defs.isOpen Whether the level is open.
     * @param defs.entries The level's entries.
     * @param defs.navigable The positions the walk reaches, from {@link MenuUtils.computeNavigableIndexes}.
     * @param defs.highlightedValue The value the level last highlighted, if any.
     * @param defs.initialHighlightPosition Where to start when nothing has been highlighted yet.
     * @param defs.hasBackEntry Whether the level has a back entry.
     * @returns The entry's position, or `undefined` while closed or when nothing is reachable.
     */
    export const computeHighlightedIndex = <T>(defs: MenuHighlightDefs<T>) => {
        if (!defs.isOpen) return undefined;

        const { navigable, entries } = defs;
        const highlightedIndex = navigable.find((index) => entries[index].value === defs.highlightedValue);

        if (highlightedIndex !== undefined) return highlightedIndex;

        if (defs.initialHighlightPosition === "last") return navigable[navigable.length - 1];

        return navigable.find((index) => !getIsBackAt(defs.hasBackEntry, index)) ?? navigable[0];
    };

    /**
     * What activating an entry does.
     *
     * The back entry steps out to the level above; an entry with a submenu opens it; anything else is picked,
     * and is handed over with its radio group's values so the menu can keep a group down to one choice.
     *
     * @param entries The level's entries.
     * @param index The entry being activated.
     * @param hasBackEntry Whether the level has a back entry.
     */
    export const computeActivation = <T, TItem extends MenuItemRecord<T>>(
        entries: TItem[],
        index: number,
        hasBackEntry: boolean,
    ): MenuActivation<T, TItem> => {
        if (getIsBackAt(hasBackEntry, index)) return { type: "back" };
        if (getHasSubmenu(entries, index, hasBackEntry)) return { type: "open" };

        return { type: "pick", item: entries[index], radioGroupValues: getRadioGroupValues(entries, index) };
    };

    /**
     * What a key pressed inside a level does, typing aside.
     *
     * Tab leaves the menu. Enter and Space activate the highlighted entry, or are swallowed when it is disabled.
     * In a straight menu the arrow pointing along the text opens the highlighted entry's submenu and the other
     * one closes the level, both read the way the text runs; a laid-out menu has no left or right, so all four
     * arrows walk it and Escape steps out of a band instead — contained, so the menu is not dismissed with it.
     * Anything the walk answers to moves the highlight.
     *
     * The view asks the typeahead first, since a space in the middle of a query belongs to the query.
     *
     * @param key The key pressed.
     * @param defs.entries The level's entries.
     * @param defs.navigable The positions the walk reaches.
     * @param defs.highlightedIndex The highlighted entry, if any.
     * @param defs.hasBackEntry Whether the level has a back entry.
     * @param defs.isLaidOut Whether the level is arranged by a layout rather than drawn as a list.
     * @param defs.depth How many levels sit above this one.
     * @param defs.direction Which way the text runs where the menu was opened.
     * @returns What to do, or `undefined` for a key the level leaves alone. Every step but `undefined` claims
     * the key.
     */
    export const computeLevelKeyStep = <T>(key: string, defs: MenuLevelKeyDefs<T>): MenuLevelKeyStep | undefined => {
        const { entries, navigable, highlightedIndex } = defs;

        if (key === DISMISS_KEY) return { type: "dismiss" };

        if (NavigatorUtils.getIsActivationKey(key)) {
            if (highlightedIndex === undefined || entries[highlightedIndex].isDisabled) return { type: "claim" };

            return { type: "activate", index: highlightedIndex };
        }

        const logicalKey = NavigatorUtils.computeLogicalKey(key, defs.direction);

        if (key === LEVEL_CLOSE_KEY && defs.isLaidOut && defs.depth > ROOT_DEPTH) {
            return { type: "close", isContained: true };
        }

        if (!defs.isLaidOut && logicalKey === SUBMENU_OPEN_KEY && highlightedIndex !== undefined) {
            if (!getOpensSubmenu(entries, highlightedIndex, defs.hasBackEntry)) return undefined;

            return { type: "open", index: highlightedIndex };
        }

        if (!defs.isLaidOut && logicalKey === SUBMENU_CLOSE_KEY && defs.depth > ROOT_DEPTH) {
            return { type: "close", isContained: false };
        }

        if (navigable.length < 1) return undefined;

        const from = navigable.indexOf(highlightedIndex ?? navigable[0]);
        const position = NavigatorUtils.computeNextPosition(key, from, navigable.length, {
            orientation: defs.isLaidOut ? PLACED_ORIENTATION : undefined,
        });

        if (position === undefined) return undefined;

        return { type: "highlight", index: navigable[position] };
    };

    /**
     * Where a typed query moves the highlight.
     *
     * `TypeaheadUtils.computeNextIndex` over the entries the walk reaches, starting from the highlighted one.
     *
     * @param query What has been typed so far.
     * @param navigable The positions the walk reaches.
     * @param highlightedIndex The highlighted entry, if any.
     * @param computeText The text an entry is found by, given its position among the entries.
     * @returns The entry's position among the entries, or `undefined` when nothing matches.
     */
    export const computeTypeaheadIndex = (
        query: string,
        navigable: number[],
        highlightedIndex: number | undefined,
        computeText: (index: number) => string,
    ) => {
        const from = navigable.indexOf(highlightedIndex ?? -1);
        const position = TypeaheadUtils.computeNextIndex(query, from, navigable.length, (index) =>
            computeText(navigable[index]),
        );

        return position === undefined ? undefined : navigable[position];
    };

    /**
     * Which entry a key pressed on a closed trigger opens the menu onto.
     *
     * Enter, Space and the down arrow open onto the first entry, the up arrow onto the last.
     *
     * @param key The key pressed.
     * @returns Where to start, or `undefined` for a key that does not open the menu.
     */
    export const getTriggerOpenPosition = (key: string): MenuHighlightPosition | undefined => {
        if (key === TRIGGER_LAST_KEY) return "last";
        if (NavigatorUtils.getIsActivationKey(key) || TRIGGER_FIRST_KEYS.includes(key)) return "first";

        return undefined;
    };

    /**
     * Whether a pointer entering an entry was the pointer moving there.
     *
     * The browser re-runs hit-testing whenever something changes under a cursor that is standing still, and
     * reports the result as a fresh enter. Such an enter arrives at the point the pointer last moved to; a real
     * one arrives somewhere else. With no point on record every enter counts as real.
     *
     * @param lastPoint Where the pointer last moved to, from {@link MenuUtils.getPointerPoint}.
     * @param eventPoint Where the enter says the pointer is.
     */
    export const getIsPointerLed = (lastPoint: Point2d | undefined, eventPoint: Point2d) =>
        lastPoint === undefined ||
        Math.abs(lastPoint.x - eventPoint.x) >= SAME_POINT_PX ||
        Math.abs(lastPoint.y - eventPoint.y) >= SAME_POINT_PX;

    /**
     * Starts keeping the pointer's last point on record, for {@link MenuUtils.getIsPointerLed}.
     *
     * One document listener serves every menu on the page; it goes, and the point is forgotten, once the last
     * reader stops.
     *
     * @returns The function that stops this reader.
     */
    export const observePointerPoint = () => {
        pointerReaderCount += ONE_READER;

        if (pointerReaderCount === ONE_READER) {
            document.addEventListener("pointermove", handlePointerPointMove, { passive: true });
        }

        let isStopped = false;

        return () => {
            if (isStopped) return;

            isStopped = true;
            pointerReaderCount -= ONE_READER;

            if (pointerReaderCount === NO_READERS) {
                document.removeEventListener("pointermove", handlePointerPointMove);
                pointerPoint = undefined;
            }
        };
    };

    /** Where the pointer last moved to, while anything observes it. */
    export const getPointerPoint = () => pointerPoint;

    /**
     * The width a laid-out level is drawn at.
     *
     * Every level of a laid-out menu is scaled against the first: a band twice the first one's extent is drawn
     * twice its size, which is what keeps nested bands concentric.
     *
     * @param layoutSize The size the menu was given, as a CSS length.
     * @param extent This level's extent.
     * @param rootExtent The first level's extent.
     * @returns A CSS width, or `undefined` when any of the three is missing.
     */
    export const computeLayoutWidth = (
        layoutSize: string | undefined,
        extent: number | undefined,
        rootExtent: number,
    ) => {
        if (layoutSize === undefined || extent === undefined || !rootExtent) return undefined;

        return `calc(${layoutSize} * ${extent / rootExtent})`;
    };

    /**
     * The extent every level is scaled against: the first level's, which a submenu is handed, or this level's
     * own when it is the first.
     *
     * @param rootExtent What the level was handed, nothing for the first level.
     * @param layout This level's layout.
     */
    export const computeRootExtent = (rootExtent: number, layout: PlacementLayout | undefined) =>
        rootExtent || (layout?.extent ?? NO_EXTENT);

    /**
     * The shift that puts a laid-out level's origin where the level is anchored.
     *
     * A popup is positioned by its box, and a layout's origin is not always the box's middle — a fan opens from
     * one edge. Moving the box by the difference is what centers the origin on the anchor.
     *
     * @param layout The level's layout.
     * @returns A CSS transform, or `undefined` for a level with no layout.
     */
    export const computeLayoutShift = (layout: PlacementLayout | undefined) => {
        if (layout === undefined) return undefined;

        const origin = layout.origin ?? { x: BOX_CENTER, y: BOX_CENTER * layout.heightRatio };
        const across = (BOX_CENTER - origin.x) * FULL_PERCENT;
        const down = ((BOX_CENTER * layout.heightRatio - origin.y) / layout.heightRatio) * FULL_PERCENT;

        return `translate(${across}%, ${down}%)`;
    };

    /**
     * Which entry a flick is aimed at.
     *
     * Picked by direction rather than by what the pointer is over: the layout's own pick rule, from where the
     * press went down to where the pointer is now. A flick that has not yet travelled a tenth of the layout's
     * width is aimed at nothing, which is what lets coming back to the middle abort it.
     *
     * @param defs.layout The level's layout.
     * @param defs.origin Where the press went down, in client coordinates.
     * @param defs.point Where the pointer is now, in client coordinates.
     * @param defs.box The layout's box on screen.
     * @param defs.navigable The positions the walk reaches, which are the only ones a flick can pick.
     * @returns The entry's position, or `undefined` when the flick is aimed at nothing.
     */
    export const computeFlickIndex = (defs: MenuFlickDefs) => {
        const { layout, origin, box } = defs;

        if (layout === undefined || origin === undefined || box === undefined || box.width <= NO_WIDTH) return;

        const toLayoutPoint = (point: Point2d) => ({
            x: (point.x - box.x) / box.width,
            y: (point.y - box.y) / box.width,
        });

        const from = toLayoutPoint(origin);
        const to = toLayoutPoint(defs.point);

        if (PlacementUtils.getDistance(from, to) < FLICK_TRAVEL_RATIO) return undefined;

        return PlacementUtils.pickIndex({ layout, point: to, isPickable: (index) => defs.navigable.includes(index) });
    };

    /**
     * Follows a flick across the document until it ends.
     *
     * @param handlers.onMove Runs as the pointer moves, with its point.
     * @param handlers.onRelease Runs when the press comes up, with its point and the node it came up on.
     * @param handlers.onCancel Runs when the system cancels the gesture, with no release at all.
     * @returns The function that stops following.
     */
    export const observeFlick = (handlers: MenuFlickHandlers) => {
        const handleMove = (e: PointerEvent) => handlers.onMove(toPoint(e));

        const handleUp = (e: PointerEvent) => handlers.onRelease(toPoint(e), (e.target as Node | null) ?? undefined);

        const handleCancel = () => handlers.onCancel();

        document.addEventListener("pointermove", handleMove, { passive: true });
        document.addEventListener("pointerup", handleUp);
        document.addEventListener("pointercancel", handleCancel);

        return () => {
            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerup", handleUp);
            document.removeEventListener("pointercancel", handleCancel);
        };
    };

    /**
     * Whether a key opens a context menu: the ContextMenu key, or Shift+F10 on a keyboard without one.
     *
     * @param key The key pressed.
     * @param isShifted Whether Shift was held.
     */
    export const getIsContextMenuKey = (key: string, isShifted: boolean) =>
        key === CONTEXT_MENU_KEY || (key === CONTEXT_MENU_FALLBACK_KEY && isShifted);

    /**
     * Listens on a region for the requests that open its context menu, and says where to open it.
     *
     * A right-click opens the menu at the pointer, as a rect of no size. The ContextMenu key, Shift+F10, and a
     * `contextmenu` event claiming the pointer was at the origin — which is what a keyboard-raised one carries —
     * open it against whatever inside the region has focus, or the region itself, so the menu lands against
     * something the person can see. Both are converted into the space the positioner works in, which a
     * `Viewport` scaling everything around the region would otherwise throw off.
     *
     * @param region The element the menu belongs to.
     * @param defs.viewportContext The viewport the region sits in.
     * @param defs.getIsDisabled Read at each request; a disabled menu leaves the browser's own menu alone.
     * @param defs.onRequest Runs with the rect to open the menu against.
     * @returns The function that stops listening.
     */
    export const observeContextMenuRequests = (region: HTMLElement, defs: MenuContextRequestDefs) => {
        const requestAtFocus = () => {
            const element = region.contains(document.activeElement) ? document.activeElement! : region;
            const rect = ViewportUtils.getAdjustedBoundingClientRect(element, defs.viewportContext);

            defs.onRequest({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
        };

        const handleContextMenu = (e: MouseEvent) => {
            if (defs.getIsDisabled()) return;

            e.preventDefault();

            if (e.clientX === ORIGIN_COORDINATE && e.clientY === ORIGIN_COORDINATE) {
                requestAtFocus();

                return;
            }

            const point = ViewportUtils.getAdjustedClientPoint({ x: e.clientX, y: e.clientY }, defs.viewportContext);

            defs.onRequest({ x: point.x, y: point.y, width: 0, height: 0 });
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (defs.getIsDisabled()) return;
            if (!getIsContextMenuKey(e.key, e.shiftKey)) return;

            e.preventDefault();
            requestAtFocus();
        };

        region.addEventListener("contextmenu", handleContextMenu);
        region.addEventListener("keydown", handleKeyDown);

        return () => {
            region.removeEventListener("contextmenu", handleContextMenu);
            region.removeEventListener("keydown", handleKeyDown);
        };
    };
}
