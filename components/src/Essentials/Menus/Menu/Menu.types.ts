import type { Accessor, JSX } from "solid-js";

import { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
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
        menuId: string;
        ariaLabel?: string;
        isHoldable: boolean;
        onToggle: () => void;
        onPress: (e: PointerEvent) => void;
        onKeyDown: (e: KeyboardEvent) => void;
    }
>;

export type MenuItemViewProps = AccessorProps<
    InteractionControlProps<MenuItemFlags> & {
        kind: MenuItemKind;
        submenuId?: string;
        isRegion: boolean;
        onActivate: () => void;
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
    id: string;
    labelledBy?: string;
    ariaLabel?: string;
    isOpen: boolean;
    path: number[];
    parentExtent: number;
    rootExtent: number;
    layoutSize?: string;
    initialHighlightPosition?: MenuHighlightPosition;
    anchorRef: HTMLElement | undefined;
    triggerRef: HTMLElement | undefined;
    placement?: AnchorPlacement;
    offset?: Point2d;
    submenuPlacement: AnchorPlacement;
    submenuOffset?: Point2d;
    submenuMode: MenuSubmenuMode;
    submenuOpensOn: MenuSubmenuTrigger;
    reservedScreenSize?: Size2d;
    transitionDurationMs?: number;
    openerFlags: InteractionFlags<MenuFlags>;
    renderPopup: MenuRenderPopup;
    onClose: () => void;
    onDismiss: () => void;
}> & {
    anchorRect?: MaybeAccessor<Rect | undefined>;
    parentPlacement?: MaybeAccessor<PlacementRect | undefined>;
    openerItem?: MaybeAccessor<MenuItem<T> | undefined>;
    getPointerPoint: () => Point2d | undefined;
    items: MaybeAccessor<MenuItem<T>[]>;
    checkedValues: MaybeAccessor<T[]>;
    computeLayout?: PlacementLayoutFn;
    computeCustomText?: (item: MenuItem<T>) => string;
    flickOrigin?: MaybeAccessor<Point2d | undefined>;
    renderItem: MenuRenderItem<T>;
    onPick: (item: MenuItem<T>, radioGroupValues: T[]) => void;
    onFlickEnd?: () => void;
};

export type MenuProps<T> = Omit<InteractionWrapperProps<MenuFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
        layoutSize?: string;
        id?: string;
        ariaLabel?: string;
        placement?: AnchorPlacement;
        offset?: Point2d;
        submenuPlacement?: AnchorPlacement;
        submenuOffset?: Point2d;
        submenuMode?: MenuSubmenuMode;
        submenuOpensOn?: MenuSubmenuTrigger;
        opensOnHold?: boolean;
        reservedScreenSize?: Size2d;
        transitionDurationMs?: number;
        visibilitySignal?: SignalSource<boolean>;
        renderContent: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
        renderPopup: MenuRenderPopup;
    }> & {
        anchorRef?: MaybeAccessor<HTMLElement | undefined>;
        items: MaybeAccessor<MenuItem<T>[]>;
        checkedSignal?: SignalSource<T[]>;
        computeLayout?: PlacementLayoutFn;
        computeCustomText?: (item: MenuItem<T>) => string;
        renderItem: MenuRenderItem<T>;
        onActivate: (value: T) => void;
    };

export type ContextMenuProps<T> = AccessorProps<{
    ariaLabel: string;
    isDisabled?: boolean;
    placement?: AnchorPlacement;
    offset?: Point2d;
    submenuPlacement?: AnchorPlacement;
    submenuOffset?: Point2d;
    submenuMode?: MenuSubmenuMode;
    submenuOpensOn?: MenuSubmenuTrigger;
    reservedScreenSize?: Size2d;
    transitionDurationMs?: number;
    visibilitySignal?: SignalSource<boolean>;
    renderPopup: MenuRenderPopup;
}> & {
    regionRef: MaybeAccessor<HTMLElement | undefined>;
    items: MaybeAccessor<MenuItem<T>[]>;
    checkedSignal?: SignalSource<T[]>;
    computeLayout?: PlacementLayoutFn;
    computeCustomText?: (item: MenuItem<T>) => string;
    renderItem: MenuRenderItem<T>;
    onActivate: (value: T) => void;
};
