import type { Point2d, Rect } from "@thewaver/ss-utils";

import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type { PlacementLayout } from "../../../Abstracts/Placement/Placement.types";
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
    items?: MenuItemRecord<T>[];
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
