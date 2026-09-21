import type { Accessor, JSX } from "solid-js";

import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../../Abstracts/Proximity/Proximity.types";
import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

export type MenuFlags = {
    isOpen: boolean;
};

export type MenuHighlightPosition = "first" | "last";

export type MenuItemKind = "command" | "checkbox" | "radio";

export type MenuSubmenuMode = "cascade" | "replace";

export type MenuSubmenuTrigger = "hover" | "press";

export type MenuItemFlags = {
    isHighlighted: boolean;
    hasSubmenu: boolean;
    isOpen: boolean;
    isChecked: boolean;
    isBack: boolean;
};

export type MenuItem<T> = {
    value: T;
    ariaLabel?: string;
    kind?: MenuItemKind;
    items?: MenuItem<T>[];
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: InteractionTooltipDefs<MenuItemFlags>;
};

export type MenuTriggerProps = AccessorProps<
    InteractionControlProps<MenuFlags> & {
        /** Identifies the menu this trigger opens, so the trigger can point at it. */
        menuId: string;
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
        /** Runs when the pointer moves onto this item, which is what opens a submenu on hover. */
        onHover: (e: MouseEvent) => void;
    }
>;

export type MenuRun<T> = {
    from: number;
    items: MenuItem<T>[];
    isRadioGroup: boolean;
};

export type MenuRenderItem<T> = (
    getItem: Accessor<MenuItem<T>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
    getPlacement: () => PlacementRect | undefined,
) => JSX.Element;

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
    /** Points at the element whose text names this level, which for a submenu is the item that opened it. */
    labelledBy?: string;
    /** Names this level for assistive technology, where no element already does. */
    ariaLabel?: string;
    /** Whether this level is open. */
    isOpen: boolean;
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
    /** The element that opened this level, which is where focus goes back to when it closes. */
    triggerRef: HTMLElement | undefined;
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
    /** Draws the surface this level's items sit on. */
    renderPopup: MenuRenderPopup;
    /** Runs when this level closes in the ordinary way, with the menu carrying on above it. */
    onClose: () => void;
    /** Runs when this level is dismissed from outside — a press elsewhere, focus leaving, or Escape. */
    onDismiss: () => void;
}> & {
    /**
     * A rectangle to position against instead of the anchor's own, for a level that should sit against part of its
     * anchor.
     */
    anchorRect?: MaybeAccessor<Rect | undefined>;
    /** Where the item that opened this level was placed, which a nested layout needs in order to grow out of it. */
    parentPlacement?: MaybeAccessor<PlacementRect | undefined>;
    /** The item that opened this level, where one did. */
    openerItem?: MaybeAccessor<MenuItem<T> | undefined>;
    /** Where the pointer is, for a menu that answers to aim rather than to what the pointer is over. */
    getPointerPoint: () => Point2d | undefined;
    /** The items on this level, in the order they are shown. */
    items: MaybeAccessor<MenuItem<T>[]>;
    /** Which values are currently checked, for the checkbox and radio items among them. */
    checkedValues: MaybeAccessor<T[]>;
    /** Arranges this level's items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** The text an item is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (item: MenuItem<T>) => string;
    /** Where a flick gesture started, which is what a menu picks by direction rather than by position uses. */
    flickOrigin?: MaybeAccessor<Point2d | undefined>;
    /** Draws one item. */
    renderItem: MenuRenderItem<T>;
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
};

export type MenuProps<T> = Omit<InteractionWrapperProps<MenuFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
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
        /** Where a submenu sits against the item that opens it. */
        submenuPlacement?: AnchorPlacement;
        /** How far a submenu is held clear of the item that opens it. */
        submenuOffset?: Point2d;
        /** Whether a submenu replaces the level that opened it or stacks beside it. */
        submenuMode?: MenuSubmenuMode;
        /** What opens a submenu — hovering its item, or picking it. */
        submenuOpensOn?: MenuSubmenuTrigger;
        /** Whether holding the trigger down opens the menu, rather than needing a full click. */
        opensOnHold?: boolean;
        /** Screen room to stay out of, for a consumer with a fixed header or sidebar the menu must not slide under. */
        reservedScreenSize?: Size2d;
        /** How long the menu takes to fade in and out. */
        transitionDurationMs?: number;
        /** Whether the menu is open. It is the only thing that opens or closes it. */
        visibilitySignal?: SignalSource<boolean>;
        /** Draws the trigger. It is handed the interaction state, including whether the menu it opens is showing. */
        renderContent: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
        /** Draws the surface the items sit on. */
        renderPopup: MenuRenderPopup;
    }> & {
        /** The element the menu is positioned against, where that is not the trigger itself. */
        anchorRef?: MaybeAccessor<HTMLElement | undefined>;
        /** The items, in the order they are shown. Items carrying children are what make submenus. */
        items: MaybeAccessor<MenuItem<T>[]>;
        /** Which values are currently checked, for the checkbox and radio items among them. */
        checkedSignal?: SignalSource<T[]>;
        /** Arranges the items, for a menu that is something other than a vertical list. */
        computeLayout?: PlacementLayoutFn;
        /** What the items do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
        /** The text an item is found by when the reader types, where that is not its visible text. */
        computeCustomText?: (item: MenuItem<T>) => string;
        /** Draws one item. */
        renderItem: MenuRenderItem<T>;
        /** Runs when an item is picked. */
        onActivate: (value: T) => void;
    };

export type ContextMenuProps<T> = AccessorProps<{
    /** Names the menu for assistive technology. */
    ariaLabel: string;
    /** Turns the menu off, so right-clicking the region does nothing out of the ordinary. */
    isDisabled?: boolean;
    /** Where the menu sits against the point it was opened at. */
    placement?: AnchorPlacement;
    /** How far the menu is held clear of the point it was opened at. */
    offset?: Point2d;
    /** Where a submenu sits against the item that opens it. */
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
    /** Whether the menu is open. It is the only thing that opens or closes it. */
    visibilitySignal?: SignalSource<boolean>;
    /** Draws the surface the items sit on. */
    renderPopup: MenuRenderPopup;
}> & {
    /** The region a right-click opens the menu over. */
    regionRef: MaybeAccessor<HTMLElement | undefined>;
    /** The items, in the order they are shown. */
    items: MaybeAccessor<MenuItem<T>[]>;
    /** Which values are currently checked, for the checkbox and radio items among them. */
    checkedSignal?: SignalSource<T[]>;
    /** Arranges the items, for a menu that is something other than a vertical list. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** The text an item is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (item: MenuItem<T>) => string;
    /** Draws one item. */
    renderItem: MenuRenderItem<T>;
    /** Runs when an item is picked. */
    onActivate: (value: T) => void;
};
