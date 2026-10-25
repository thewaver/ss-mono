import type { Accessor, JSX } from "solid-js";

import type {
    AnchorPlacement,
    BaseContextMenuCbs,
    BaseContextMenuValues,
    BaseMenuCbs,
    BaseMenuValues,
    InteractionFlags,
    MenuFlags,
    MenuGroupPaintExcludesLayout,
    MenuGroupRecord,
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
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

export type MenuItem<T> = {
    value: T;
    ariaLabel?: string;
    kind?: MenuItemKind;
    items?: MenuNode<T>[];
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
    tooltipDefs?: InteractionTooltipDefs<MenuItemFlags>;
};

export type MenuTriggerProps = AccessorProps<
    Omit<InteractionControlProps<MenuFlags>, "ariaLabel"> & {
        /** Identifies the menu this trigger opens, so the trigger can point at it. */
        menuId: string;
        /** The role the trigger announces, written on the element that takes focus. */
        role: MenuTriggerRole;
        /** Whether holding the trigger down opens the menu, rather than needing a full click. */
        isHoldable: boolean;
        /** Runs when the trigger is activated and the menu should open or close. */
        onToggle: () => void;
        /** Runs as the press goes down on the trigger, which is what a hold-to-open menu starts from. */
        onPress: (e: PointerEvent) => void;
        /**
         * Runs on a key pressed while the trigger has focus, so the arrow keys can open the menu into its first item.
         */
        onKeyDown: (e: KeyboardEvent) => void;
        /** Names the trigger for assistive technology, for a trigger whose painter draws a glyph rather than text. */
        ariaLabel?: string;
    }
>;

export type MenuItemViewProps = AccessorProps<
    InteractionControlProps<MenuItemFlags> & {
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
        /** Runs when the pointer moves over this item, which is what opens a submenu on hover. */
        onHover: () => void;
        /** Runs when the pointer enters this item. */
        onEnter: () => void;
    }
>;

export type MenuRenderItem<T> = (
    getItem: Accessor<MenuItem<T>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
    getPlacement: () => PlacementRect | undefined,
) => JSX.Element;

export type MenuGroup<T> = MenuGroupRecord<MenuItem<T>>;

export type MenuNode<T> = MenuItem<T> | MenuGroup<T>;

export type MenuRenderGroupHeader<T> = (getGroup: Accessor<MenuGroup<T>>) => JSX.Element;

export type MenuRenderGroupBox<T> = (renderContent: () => JSX.Element, getGroup: Accessor<MenuGroup<T>>) => JSX.Element;

export type MenuRenderPopup = (
    renderItems: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getPlacement: () => AnchorPlacement,
    getFlags: () => InteractionFlags<MenuFlags>,
) => JSX.Element;

export type MenuLevelProps<T> = AccessorProps<{
    /** Identifies this level of the menu, so its items and its parent can point at it. */
    id: string;
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
    /**
     * Which item is highlighted when the level opens — the first, the last, or none — so a menu opened with the up
     * arrow starts at the bottom.
     */
    initialHighlightPosition?: MenuHighlightPosition;
    /** The element this level is positioned against. */
    anchorRef: HTMLElement | undefined;
    /** The element that opened this level, which is where focus goes back to when it closes. */
    triggerRef: HTMLElement | undefined;
    /** Where a submenu of this level sits against the item that opens it. */
    submenuPlacement: AnchorPlacement;
    /** Whether a submenu replaces the level that opened it or stacks beside it. */
    submenuMode: MenuSubmenuMode;
    /** What opens a submenu — hovering its item, or picking it. */
    submenuOpensOn: MenuSubmenuTrigger;
    /** The interaction state of the item that opened this level, so the level can answer to it. */
    openerFlags: InteractionFlags<MenuFlags>;
    /** Draws the surface this level's items sit on. */
    renderPopup: MenuRenderPopup;
    /**
     * Draws the marker that slides to the highlighted item — the one the pointer or the arrow keys are on — behind it,
     * in this menu and in every submenu. The fade is handed in rather than applied: the marker fades out while nothing
     * is highlighted.
     */
    renderHighlightFloater?: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
    /** Runs when this level closes in the ordinary way, with the menu carrying on above it. */
    onClose: () => void;
    /**
     * Runs when Tab dismisses the whole menu from this level, told whether it was pressed without Shift — in which
     * case focus goes on past the opener rather than back to it.
     */
    onDismiss: (isLeavingForward: boolean) => void;
}> & {
    /** The item that opened this level, where one did. */
    openerItem?: MaybeAccessor<MenuItem<T> | undefined>;
    /** The items on this level, in the order they are shown, with any groups among them. */
    items: MaybeAccessor<MenuNode<T>[]>;
    /** Which values are currently checked, for the checkbox and radio items among them. */
    checkedValues: MaybeAccessor<T[]>;
    /** Arranges this level's items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** The text an item is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (item: MenuItem<T>) => string;
    /** Draws one item. */
    renderItem: MenuRenderItem<T>;
    /** Draws one group's heading, on this level and every submenu. */
    renderGroupHeader?: MenuRenderGroupHeader<T>;
    /** Draws the box a group sits in, around its heading and its items, on this level and every submenu. */
    renderGroupBox?: MenuRenderGroupBox<T>;
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
} & AccessorProps<{
        /**
         * A rectangle to position against instead of the anchor's own, for a level that should sit against part of its
         * anchor.
         */
        anchorRect?: Rect;
        /** Where the item that opened this level was placed, which a nested layout needs in order to grow out of it. */
        parentPlacement?: PlacementRect;
        /** Where a flick gesture started, which is what a menu picks by direction rather than by position uses. */
        flickOrigin?: Point2d;
        /** Points at the element whose text names this level, which for a submenu is the item that opened it. */
        labelledBy?: string;
        /** Names this level for assistive technology, where no element already does. */
        ariaLabel?: string;
        /** How much room the level is given to lay its items out in. */
        layoutSize?: string;
        /** Where this level sits against its anchor. */
        placement?: AnchorPlacement;
        /** How far this level is held clear of its anchor. */
        offset?: Point2d;
        /** How far a submenu of this level is held clear of the item that opens it. */
        submenuOffset?: Point2d;
        /** Screen room to stay out of, for a consumer with a fixed header or sidebar the menu must not slide under. */
        reservedScreenSize?: Size2d;
        /** How long this level takes to fade in and out. */
        transitionDurationMs?: number;
        /** How long the highlight's marker takes to slide from one item to the next, and to fade. */
        floaterTransitionDurationMs?: number;
    }>;

export type MenuProps<T> = Omit<InteractionWrapperProps<MenuFlags>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseMenuValues> &
    BaseMenuCbs<T> &
    AccessorProps<{
        /** Whether the menu is open. It is the only thing that opens or closes it. */
        visibility?: SignalSource<boolean>;
        /** Draws the trigger. It is handed the interaction state, including whether the menu it opens is showing. */
        renderContent: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
        /** Draws the surface the items sit on. */
        renderPopup: MenuRenderPopup;
        /**
         * Draws the marker that slides to the highlighted item — the one the pointer or the arrow keys are on — behind it,
         * in this menu and in every submenu. The fade is handed in rather than applied: the marker fades out while nothing
         * is highlighted.
         */
        renderHighlightFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
        /** The element the menu is positioned against, where that is not the trigger itself. */
        anchorRef?: HTMLElement;
    }> & {
        /**
         * The items, in the order they are shown. Items carrying children are what make submenus, and an entry carrying
         * a `label` and `items` but no value is a group of them.
         */
        items: MaybeAccessor<MenuNode<T>[]>;
        /** Which values are currently checked, for the checkbox and radio items among them. */
        checked?: SignalSource<T[]>;
        /** The text an item is found by when the reader types, where that is not its visible text. */
        computeCustomText?: (item: MenuItem<T>) => string;
        /** Draws one item. */
        renderItem: MenuRenderItem<T>;
        /**
         * Draws a group's heading, above its items. A group is an entry in `items` carrying a `label` and its own
         * `items` and no value; the heading is never reached by the arrow keys. Refused alongside `computeLayout`,
         * since a laid-out menu places each item on its own and has no heading row.
         */
        renderGroupHeader?: MenuRenderGroupHeader<T>;
        /**
         * Draws the box a group sits in, around its heading and its items, which are handed in to be placed inside
         * it — a background, a border, a line under the group, an indent. Refused alongside `computeLayout`, for the
         * same reason.
         */
        renderGroupBox?: MenuRenderGroupBox<T>;
    } & MenuGroupPaintExcludesLayout;

export type ContextMenuProps<T> = AccessorValues<BaseContextMenuValues> &
    BaseContextMenuCbs<T> &
    AccessorProps<{
        /** Whether the menu is open. It is the only thing that opens or closes it. */
        visibility?: SignalSource<boolean>;
        /** Draws the surface the items sit on. */
        renderPopup: MenuRenderPopup;
        /**
         * Draws the marker that slides to the highlighted item — the one the pointer or the arrow keys are on — behind it,
         * in this menu and in every submenu. The fade is handed in rather than applied: the marker fades out while nothing
         * is highlighted.
         */
        renderHighlightFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }> & {
        /**
         * Draws the region a right-click opens the menu over.
         *
         * The component renders the element itself rather than taking a ref to the consumer's, because it has to put a
         * `tabindex` and a role on it: a region with no focusable content can never receive the ContextMenu key, so
         * before this a plain box of text had no keyboard route to its own menu at all
         * ({@link https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html 2.1.1}, Level A). Everything drawn inside
         * it is the consumer's.
         */
        renderRegion: () => JSX.Element;
        /** The items, in the order they are shown, and an entry carrying a `label` and `items` but no value is a group. */
        items: MaybeAccessor<MenuNode<T>[]>;
        /** Which values are currently checked, for the checkbox and radio items among them. */
        checked?: SignalSource<T[]>;
        /** The text an item is found by when the reader types, where that is not its visible text. */
        computeCustomText?: (item: MenuItem<T>) => string;
        /** Draws one item. */
        renderItem: MenuRenderItem<T>;
        /**
         * Draws a group's heading, above its items. A group is an entry in `items` carrying a `label` and its own
         * `items` and no value; the heading is never reached by the arrow keys. Refused alongside `computeLayout`,
         * since a laid-out menu places each item on its own and has no heading row.
         */
        renderGroupHeader?: MenuRenderGroupHeader<T>;
        /**
         * Draws the box a group sits in, around its heading and its items, which are handed in to be placed inside
         * it — a background, a border, a line under the group, an indent. Refused alongside `computeLayout`, for the
         * same reason.
         */
        renderGroupBox?: MenuRenderGroupBox<T>;
    } & MenuGroupPaintExcludesLayout;
