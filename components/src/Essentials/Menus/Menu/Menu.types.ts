import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type { PlacementLayout, PlacementLayoutFn } from "../../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../../Abstracts/Proximity/Proximity.types";
import type { ViewportContextType } from "../../../Abstracts/Viewport/Viewport.context.types";

export type MenuFlags = {
    isOpen: boolean;
};

export type MenuHighlightPosition = "first" | "last";

export type MenuItemKind = "command" | "checkbox" | "radio";

export type MenuSubmenuMode = "cascade" | "replace";

export type MenuTriggerRole = "button" | "menuitem";

export type MenuSubmenuTrigger = "hover" | "press";

export type MenuItemFlags = {
    isHighlighted: boolean;
    hasSubmenu: boolean;
    isOpen: boolean;
    isChecked: boolean;
    isBack: boolean;
};

export type MenuItemRecord<T> = {
    value: T;
    ariaLabel?: string;
    kind?: MenuItemKind;
    items?: (MenuItemRecord<T> | MenuGroupRecord<MenuItemRecord<T>>)[];
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    staysOpenOnPick?: boolean;
};

export type MenuItemRole = "menuitem" | "menuitemcheckbox" | "menuitemradio";

export type MenuLevelKeyStep =
    | { type: "dismiss" }
    | { type: "claim" }
    | { type: "activate"; index: number }
    | { type: "open"; index: number }
    | { type: "close"; isContained: boolean }
    | { type: "highlight"; index: number };

export type MenuActivation<T, TItem> =
    { type: "back" } | { type: "open" } | { type: "pick"; item: TItem; radioGroupValues: T[] };

export type MenuLevelKeyDefs<T> = {
    entries: MenuItemRecord<T>[];
    navigable: number[];
    highlightedIndex: number | undefined;
    hasBackEntry: boolean;
    isLaidOut: boolean;
    depth: number;
    direction: NavigatorDirection;
    submenuPlacement: AnchorPlacement;
};

export type MenuHighlightDefs<T> = {
    isOpen: boolean;
    entries: MenuItemRecord<T>[];
    navigable: number[];
    highlightedValue: T | undefined;
    initialHighlightPosition?: MenuHighlightPosition;
    hasBackEntry: boolean;
};

export type MenuFlickDefs = {
    layout: PlacementLayout | undefined;
    origin: Point2d | undefined;
    point: Point2d;
    box: Rect | undefined;
    navigable: number[];
};

export type MenuFlickHandlers = {
    onMove: (point: Point2d) => void;
    onRelease: (point: Point2d, releasedOn: Node | undefined) => void;
    onCancel: () => void;
};

export type MenuContextRequestDefs = {
    viewportContext: ViewportContextType;
    getIsDisabled: () => boolean;
    onRequest: (rect: Rect) => void;
};

export type MenuRun<TItem> = {
    from: number;
    items: TItem[];
    isRadioGroup: boolean;
};

export type MenuGroupRecord<TItem> = {
    label: string;
    items: TItem[];
};

export type MenuSection<TItem> = {
    from: number;
    group: MenuGroupRecord<TItem> | undefined;
    runs: MenuRun<TItem>[];
};

export type BaseMenuValues = {
    /** How much room the menu is given to lay its items out in. */
    layoutSize?: string;
    /** Identifies the menu, so the trigger can point at it. */
    id?: string;
    /** Names the menu for assistive technology. */
    ariaLabel?: string;
    /**
     * Where the menu sits against its trigger. Left out, it hangs below the trigger lined up with the edge the
     * text starts from: the left, or the right where the trigger sits in right-to-left text. Given, it is used as
     * it stands in either direction.
     */
    placement?: AnchorPlacement;
    /** How far the menu is held clear of its trigger. */
    offset?: Point2d;
    /**
     * Where a submenu sits against the item that opens it. Left out, a submenu opens beside its item on
     * the right, or on the left where the menu's trigger sits in right-to-left text. Given, it is used as it
     * stands in either direction. Either way, the arrow that opens a submenu is the one pointing at the side
     * it opens on, and the other arrow closes it; a placement that is not beside the item on either side
     * leaves the arrows to the text direction.
     */
    submenuPlacement?: AnchorPlacement;
    /** How far a submenu is held clear of the item that opens it. */
    submenuOffset?: Point2d;
    /** Whether a submenu replaces the level that opened it or stacks beside it. */
    submenuMode?: MenuSubmenuMode;
    /** What opens a submenu — hovering its item, or picking it. */
    submenuOpensOn?: MenuSubmenuTrigger;
    /** Whether holding the trigger down opens the menu, rather than needing a full click. */
    opensOnHold?: boolean;
    /**
     * The role the trigger announces, written on the button that takes focus rather than on the box around it.
     * Left out, the trigger is a button. A menubar passes `menuitem`, because every child of a menubar has to be
     * one, and the trigger still announces the menu it opens and whether that menu is open.
     */
    triggerRole?: MenuTriggerRole;
    /** Screen room to stay out of, for a consumer with a fixed header or sidebar the menu must not slide under. */
    reservedScreenSize?: Size2d;
    /** How long the menu takes to fade in and out. */
    transitionDurationMs?: number;
    /** How long the highlight's marker takes to slide from one item to the next, and to fade. */
    floaterTransitionDurationMs?: number;
};

export type BaseMenuCbs<T> = {
    /** Arranges the items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Runs when an item is picked. */
    onActivate: (value: T) => void;
};

export type BaseMenuProps<T> = BaseMenuValues & BaseMenuCbs<T>;

export type BaseContextMenuValues = {
    /** Names the menu for assistive technology. */
    ariaLabel: string;
    /**
     * Names the region for assistive technology.
     *
     * The region is a tab stop, so it has to say what it is — and its own name cannot be the menu's, which
     * describes what the menu offers rather than what the region holds.
     */
    regionAriaLabel: string;
    /** Turns the menu off, so right-clicking the region does nothing out of the ordinary. */
    isDisabled?: boolean;
    /**
     * Where the menu sits against the point it was opened at. Left out, it hangs below the point and spreads
     * away from it the way the text runs: to the right, or to the left where the region sits in right-to-left
     * text. Given, it is used as it stands in either direction.
     */
    placement?: AnchorPlacement;
    /** How far the menu is held clear of the point it was opened at. */
    offset?: Point2d;
    /**
     * Where a submenu sits against the item that opens it. Left out, a submenu opens beside its item on the
     * right, or on the left where the region sits in right-to-left text. Given, it is used as it stands in
     * either direction. Either way, the arrow that opens a submenu is the one pointing at the side it opens
     * on, and the other arrow closes it; a placement that is not beside the item on either side leaves the
     * arrows to the text direction.
     */
    submenuPlacement?: AnchorPlacement;
    /** How far a submenu is held clear of the item that opens it. */
    submenuOffset?: Point2d;
    /** Whether a submenu replaces the level that opened it or stacks beside it. */
    submenuMode?: MenuSubmenuMode;
    /** What opens a submenu — hovering its item, or picking it. */
    submenuOpensOn?: MenuSubmenuTrigger;
    /** Screen room to stay out of, for a consumer with a fixed header or sidebar the menu must not slide under. */
    reservedScreenSize?: Size2d;
    /** How long the menu takes to fade in and out. */
    transitionDurationMs?: number;
    /** How long the highlight's marker takes to slide from one item to the next, and to fade. */
    floaterTransitionDurationMs?: number;
};

export type BaseContextMenuCbs<T> = {
    /** Arranges the items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Runs when an item is picked. */
    onActivate: (value: T) => void;
};

export type BaseContextMenuProps<T> = BaseContextMenuValues & BaseContextMenuCbs<T>;

export type MenuGroupPaintExcludesLayout =
    { computeLayout?: undefined } | { renderGroupHeader?: undefined; renderGroupBox?: undefined };
