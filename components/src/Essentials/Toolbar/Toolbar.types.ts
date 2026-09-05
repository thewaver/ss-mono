import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";
import type { MenuFlags, MenuRenderItem, MenuRenderPopup } from "../Menu/Menu.types";

export type ToolbarCollapse = "auto" | "never" | "always";

export type ToolbarAction<T> = {
    value: T;
    collapse?: ToolbarCollapse;
    isDisabled?: boolean;
};

export type ToolbarCutDefs = {
    widths: number[];
    collapses: ToolbarCollapse[];
    available: number;
    overflowWidth: number;
    gap: number;
};

export type ToolbarCut = {
    shownIndexes: number[];
    collapsedIndexes: number[];
};

export type ToolbarProps<T> = AccessorProps<{
    gap?: number;
    ariaLabel: string;
    overflowAriaLabel?: string;
    renderOverflowPopup: MenuRenderPopup;
}> & {
    actions: MaybeAccessor<ToolbarAction<T>[]>;
    renderAction: (getAction: Accessor<ToolbarAction<T>>, getFlags: () => InteractionFlags) => JSX.Element;
    renderOverflowTrigger: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
    renderOverflowItem: MenuRenderItem<T>;
    onActivate: (value: T) => void;
};
