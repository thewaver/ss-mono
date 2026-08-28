import type { Accessor, JSX, Signal } from "solid-js";

import { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../InteractionWrapper/InteractionWrapper.types";

export type MenuFlags = {
    isOpen: boolean;
};

export type MenuHighlightPosition = "first" | "last";

export type MenuItemKind = "command" | "checkbox" | "radio";

export type MenuItemFlags = {
    isHighlighted: boolean;
    hasSubmenu: boolean;
    isOpen: boolean;
    isChecked: boolean;
};

export type MenuItem<T> = {
    value: T;
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
        onToggle: () => void;
        onKeyDown: (e: KeyboardEvent) => void;
    }
>;

export type MenuItemViewProps = AccessorProps<
    InteractionControlProps<MenuItemFlags> & {
        kind: MenuItemKind;
        submenuId?: string;
        onActivate: () => void;
        onHover: () => void;
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
    isSubmenu: boolean;
    initialHighlightPosition?: MenuHighlightPosition;
    anchorRef: HTMLElement | undefined;
    triggerRef: HTMLElement | undefined;
    placement?: AnchorPlacement;
    offset?: Point2d;
    submenuPlacement: AnchorPlacement;
    submenuOffset?: Point2d;
    reservedScreenSize?: Size2d;
    transitionDurationMs?: number;
    openerFlags: InteractionFlags<MenuFlags>;
    renderPopup: MenuRenderPopup;
    onClose: () => void;
    onDismiss: () => void;
}> & {
    anchorRect?: MaybeAccessor<Rect | undefined>;
    items: MaybeAccessor<MenuItem<T>[]>;
    checkedValues: MaybeAccessor<T[]>;
    computeCustomText?: (item: MenuItem<T>) => string;
    renderItem: MenuRenderItem<T>;
    onPick: (item: MenuItem<T>, radioGroupValues: T[]) => void;
};

export type MenuProps<T> = Omit<InteractionWrapperProps<MenuFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
        id?: string;
        ariaLabel?: string;
        placement?: AnchorPlacement;
        offset?: Point2d;
        submenuPlacement?: AnchorPlacement;
        submenuOffset?: Point2d;
        reservedScreenSize?: Size2d;
        transitionDurationMs?: number;
        visibilitySignal?: Signal<boolean>;
        renderContent: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
        renderPopup: MenuRenderPopup;
    }> & {
        anchorRef?: MaybeAccessor<HTMLElement | undefined>;
        items: MaybeAccessor<MenuItem<T>[]>;
        checkedSignal?: Signal<T[]>;
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
    reservedScreenSize?: Size2d;
    transitionDurationMs?: number;
    visibilitySignal?: Signal<boolean>;
    renderPopup: MenuRenderPopup;
}> & {
    regionRef: MaybeAccessor<HTMLElement | undefined>;
    items: MaybeAccessor<MenuItem<T>[]>;
    checkedSignal?: Signal<T[]>;
    computeCustomText?: (item: MenuItem<T>) => string;
    renderItem: MenuRenderItem<T>;
    onActivate: (value: T) => void;
};
