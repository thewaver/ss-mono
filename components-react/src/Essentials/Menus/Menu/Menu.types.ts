import type { KeyboardEvent, PointerEvent, ReactNode } from "react";

import type {
    AnchorPlacement,
    InteractionFlags,
    MenuFlags,
    MenuHighlightPosition,
    MenuItemFlags,
    MenuItemKind,
    MenuSubmenuMode,
    MenuSubmenuTrigger,
    MenuTriggerRole,
    NavigatorDirection,
    PlacementLayoutFn,
    PlacementRect,
    ProximityEffectFn,
} from "@thewaver/ss-components";
import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type MenuItem<T> = {
    /** What the item stands for, handed to `onActivate` when it is picked. */
    value: T;
    /** Names the item for assistive technology, for an item whose painter draws a glyph rather than text. */
    ariaLabel?: string;
    /**
     * What kind of item this is — a plain command, a checkbox, a radio choice. Left out, it is a command. A run of
     * adjacent radio items is one group.
     */
    kind?: MenuItemKind;
    /** The items of this item's submenu. An item carrying them opens a submenu rather than being picked. */
    items?: MenuItem<T>[];
    /** Whether the item can be picked. A disabled item is left out of the arrow-key walk unless kept reachable. */
    isDisabled?: boolean;
    /**
     * Keeps this item in the arrow-key walk while it is disabled, so the highlight can land on it and a reader hears
     * its name and that it is unavailable. It still cannot be picked.
     */
    isReachableWhenDisabled?: boolean;
    /**
     * Whether the menu stays open after this item is picked. Left out, a checkbox item keeps the menu open and a radio
     * item or a command closes it. Set it on a command that is worth repeating, such as zooming in, and the menu stays
     * put for the next press. On the wheel and fan menus the default is the right one, since the pick animation there
     * is the menu leaving.
     */
    staysOpenOnPick?: boolean;
    /** A tooltip for the item, anchored to it and handed its flags. */
    tooltipDefs?: InteractionTooltipDefs<MenuItemFlags>;
};

export type MenuTriggerProps = InteractionControlProps<MenuFlags> & {
    /** Identifies the menu this trigger opens, so the trigger can point at it. */
    menuId: string;
    /** The role the trigger announces, written on the element that takes focus. */
    role: MenuTriggerRole;
    /** Whether holding the trigger down opens the menu, rather than needing a full click. */
    isHoldable: boolean;
    /** Runs when the trigger is activated and the menu should open or close. */
    onToggle: () => void;
    /** Runs as the press goes down on the trigger, which is what a hold-to-open menu starts from. */
    onPress: (e: PointerEvent<HTMLButtonElement>) => void;
    /**
     * Runs on a key pressed while the trigger has focus, so the arrow keys can open the menu into its first item.
     */
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
};

export type MenuItemViewProps = InteractionControlProps<MenuItemFlags> & {
    /**
     * What kind of item this is — a plain command, a checkbox, a radio — which decides what it announces and
     * whether it carries a mark.
     */
    kind: MenuItemKind;
    /** Identifies the submenu this item opens, where it opens one. */
    submenuId?: string;
    /** Whether this item is a heading for the group under it rather than something that can be picked. */
    isRegion: boolean;
    /** Runs when this item is picked. */
    onActivate: () => void;
    /** Runs when the pointer moves onto this item, which is what opens a submenu on hover. */
    onHover: (point: Point2d) => void;
};

export type MenuRenderItem<T> = (
    item: MenuItem<T>,
    flags: InteractionFlags<MenuItemFlags>,
    placement: PlacementRect | undefined,
) => ReactNode;

export type MenuRenderPopup = (
    renderItems: () => ReactNode,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
    flags: InteractionFlags<MenuFlags>,
) => ReactNode;

export type MenuLevelProps<T> = {
    /** Identifies this level of the menu, so its items and its parent can point at it. */
    id: string;
    /** Points at the element whose text names this level, which for a submenu is the item that opened it. */
    labelledBy?: string;
    /** Names this level for assistive technology, where no element already does. */
    ariaLabel?: string;
    /** Whether this level is open. */
    isOpen: boolean;
    /**
     * Which way text runs where the menu was opened, which decides which horizontal arrow opens a submenu and which
     * closes one.
     */
    direction: NavigatorDirection;
    /** Which item was opened at each level above, so a level knows where it sits in the chain. */
    path: number[];
    /** How wide the level above is, which a nested layout needs in order to grow outward from it. */
    parentExtent: number;
    /** How wide the first level is, which is what the whole chain is scaled against. */
    rootExtent: number;
    /** How much room the level is given to lay its items out in. */
    layoutSize?: string;
    /**
     * Which item is highlighted when the level opens — the first, the last, or none — so a menu opened with the up
     * arrow starts at the bottom.
     */
    initialHighlightPosition?: MenuHighlightPosition;
    /** The element this level is positioned against. */
    anchorRef: HTMLElement | undefined;
    /**
     * A rectangle to position against instead of the anchor's own, for a level that should sit against part of its
     * anchor.
     */
    anchorRect?: Rect;
    /** Where this level sits against its anchor. */
    placement?: AnchorPlacement;
    /** How far this level is held clear of its anchor. */
    offset?: Point2d;
    /** Where a submenu of this level sits against the item that opens it. */
    submenuPlacement: AnchorPlacement;
    /** How far a submenu of this level is held clear of the item that opens it. */
    submenuOffset?: Point2d;
    /** Whether a submenu replaces the level that opened it or stacks beside it. */
    submenuMode: MenuSubmenuMode;
    /** What opens a submenu — hovering its item, or picking it. */
    submenuOpensOn: MenuSubmenuTrigger;
    /** Screen room to stay out of, for a consumer with a fixed header or sidebar the menu must not slide under. */
    reservedScreenSize?: Size2d;
    /** How long this level takes to fade in and out. */
    transitionDurationMs?: number;
    /** The interaction state of the item that opened this level, so the level can answer to it. */
    openerFlags: InteractionFlags<MenuFlags>;
    /** Where the item that opened this level was placed, which a nested layout needs in order to grow out of it. */
    parentPlacement?: PlacementRect;
    /** The item that opened this level, where one did. */
    openerItem?: MenuItem<T>;
    /** The items on this level, in the order they are shown. */
    items: MenuItem<T>[];
    /** Which values are currently checked, for the checkbox and radio items among them. */
    checkedValues: T[];
    /** Arranges this level's items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** The text an item is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (item: MenuItem<T>) => string;
    /** Where a flick gesture started, which is what a menu picks by direction rather than by position uses. */
    flickOrigin?: Point2d;
    /** Draws one item. */
    renderItem: MenuRenderItem<T>;
    /** Draws the surface this level's items sit on. */
    renderPopup: MenuRenderPopup;
    /**
     * Runs when an item on this level is picked, and is told the radio group's values so a consumer can keep them in
     * step.
     */
    onPick: (item: MenuItem<T>, radioGroupValues: T[]) => void;
    /**
     * Runs when a flick gesture ends, whether it picked something or was aborted.
     *
     * Receives the node the pointer was released on, or nothing when the system canceled the gesture and
     * there was no release at all. That is also what says whether a `click` is still to come: the browser
     * fires one only where the press and the release share an element, so a caller holding state until the
     * click can tell an ordinary release on the trigger from one that will never be followed up.
     */
    onFlickEnd?: (releasedOn: Node | undefined) => void;
    /** Runs when this level closes in the ordinary way, with the menu carrying on above it. */
    onClose: () => void;
    /** Runs when this level is dismissed from outside — a press elsewhere, focus leaving, or Escape. */
    onDismiss: () => void;
};

export type MenuEntryProps<T> = {
    /** The level this entry belongs to, which its ids, its painter and its submenu's settings come from. */
    level: MenuLevelProps<T>;
    /** The entry itself. */
    item: MenuItem<T>;
    /** Where the entry sits among the level's entries. */
    index: number;
    /** Where the level's layout placed the entry, for a laid-out level. */
    placement: PlacementRect | undefined;
    /** Whether the entry is highlighted. */
    isHighlighted: boolean;
    /** Whether the entry is the way back out to the level above. */
    isBack: boolean;
    /** Whether the entry opens a submenu of its own. */
    hasSubmenu: boolean;
    /** Whether the entry's submenu is open. */
    isSubmenuOpen: boolean;
    /** Whether the level the entry belongs to is laid out. */
    isLaidOut: boolean;
    /** The extent of the level the entry belongs to, which its submenu grows out from. */
    levelExtent: number;
    /** The extent of the first level, which every level is scaled against. */
    rootExtent: number;
    /** Runs when the entry is picked. */
    onActivate: (index: number) => void;
    /** Runs when the pointer moves onto the entry, with where it arrived. */
    onHover: (index: number, point: Point2d) => void;
    /** Runs when the entry's submenu closes in the ordinary way. */
    onSubmenuClose: () => void;
};

export type MenuProps<T> = Omit<InteractionWrapperProps<MenuFlags>, "renderControl" | "extraFlags"> & {
    /** How much room the menu is given to lay its items out in. */
    layoutSize?: string;
    /** Identifies the menu, so the trigger can point at it. */
    id?: string;
    /** Names the menu for assistive technology. */
    ariaLabel?: string;
    /** Where the menu sits against its trigger. */
    placement?: AnchorPlacement;
    /** How far the menu is held clear of its trigger. */
    offset?: Point2d;
    /**
     * Where a submenu sits against the item that opens it. Left out, a submenu opens beside its item on
     * the side the opening arrow points to: the right, or the left where the menu's trigger sits in
     * right-to-left text. Given, it is used as it stands in either direction.
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
    /**
     * Whether the menu is open, with its setter. It is the only thing that opens or closes it; the menu writes
     * `false` through the setter when it is dismissed or an item is picked. Left out, the menu keeps its own.
     */
    visibility?: readonly [boolean, (isOpen: boolean) => void];
    /** The element the menu is positioned against, where that is not the trigger itself. */
    anchorRef?: HTMLElement;
    /** The items, in the order they are shown. Items carrying children are what make submenus. */
    items: MenuItem<T>[];
    /** Which values are currently checked, with its setter, for the checkbox and radio items among them. */
    checked?: readonly [T[], (checked: T[]) => void];
    /** Arranges the items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** The text an item is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (item: MenuItem<T>) => string;
    /** Draws the trigger. It is handed the interaction state, including whether the menu it opens is showing. */
    renderContent: (flags: InteractionFlags<MenuFlags>) => ReactNode;
    /** Draws the surface the items sit on. */
    renderPopup: MenuRenderPopup;
    /** Draws one item. */
    renderItem: MenuRenderItem<T>;
    /** Runs when an item is picked. */
    onActivate: (value: T) => void;
};

export type ContextMenuProps<T> = {
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
    /** Where the menu sits against the point it was opened at. */
    placement?: AnchorPlacement;
    /** How far the menu is held clear of the point it was opened at. */
    offset?: Point2d;
    /**
     * Where a submenu sits against the item that opens it. Left out, a submenu opens beside its item on the
     * side the opening arrow points to: the right, or the left where the region sits in right-to-left
     * text. Given, it is used as it stands in either direction.
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
    /**
     * Whether the menu is open, with its setter. It is the only thing that opens or closes it. Left out, the menu
     * keeps its own.
     */
    visibility?: readonly [boolean, (isOpen: boolean) => void];
    /**
     * Draws the region a right-click opens the menu over.
     *
     * The component renders the element itself rather than taking a ref to the consumer's, because it has to
     * put a `tabindex` and a role on it: a region with no focusable content can never receive the ContextMenu
     * key, so before this a plain box of text had no keyboard route to its own menu at all (2.1.1, Level A).
     * Everything drawn inside it is the consumer's.
     */
    renderRegion: () => ReactNode;
    /** The items, in the order they are shown. */
    items: MenuItem<T>[];
    /** Which values are currently checked, with its setter, for the checkbox and radio items among them. */
    checked?: readonly [T[], (checked: T[]) => void];
    /** Arranges the items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** The text an item is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (item: MenuItem<T>) => string;
    /** Draws the surface the items sit on. */
    renderPopup: MenuRenderPopup;
    /** Draws one item. */
    renderItem: MenuRenderItem<T>;
    /** Runs when an item is picked. */
    onActivate: (value: T) => void;
};
