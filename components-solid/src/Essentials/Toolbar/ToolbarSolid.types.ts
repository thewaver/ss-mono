import type { Accessor, JSX } from "solid-js";

import type {
    BaseToolbarButtonsValues,
    BaseToolbarMenusValues,
    BaseToolbarSharedCbs,
    BaseToolbarSharedValues,
    InteractionFlags,
    MenuFlags,
    ToolbarActionRecord,
} from "@thewaver/ss-components";

import type { InteractionTooltipDefs } from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";
import type { MenuItem, MenuRenderItem, MenuRenderPopup } from "../Menus/Menu/MenuSolid.types";

export type ToolbarAction<T> = ToolbarActionRecord<T, InteractionTooltipDefs>;

export type MenubarAction<T> = ToolbarActionRecord<T, never> & {
    /**
     * The menu this word opens. When the word is collapsed into the overflow menu it becomes an item there, and these
     * become its submenu.
     */
    items: MenuItem<T>[];
};

export type ToolbarSharedProps<T> = AccessorValues<BaseToolbarSharedValues> &
    BaseToolbarSharedCbs<T> & {
        /** Draws the control that opens the overflow menu. */
        renderOverflowTrigger: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
    };

export type ToolbarButtonsProps<T> = BaseToolbarButtonsValues &
    AccessorProps<{
        /** Draws the surface the overflow menu's items sit on. */
        renderOverflowPopup: MenuRenderPopup;
    }> & {
        /** The actions, in the order they are shown. Whatever does not fit moves into the overflow menu. */
        actions: MaybeAccessor<ToolbarAction<T>[]>;
        /**
         * Which actions are pressed. A toolbar holds actions that do something; with this, its actions hold states that
         * stay pressed, the way Bold and Italic do in an editor.
         *
         * Every action becomes a toggle button: one whose value is in the list is announced as pressed and the rest as
         * not pressed, and the painter is told which through `isPressed`. Pressing an action adds its value to the list
         * or takes it out, and `onActivate` still runs. An action collapsed into the overflow menu becomes a checkbox item
         * there, checked from the same list, so its state survives the collapse. Left out, the actions are ordinary
         * buttons and nothing is announced as pressed.
         */
        pressedValues?: SignalSource<T[]>;
        /** Draws one action. */
        renderAction: (getAction: Accessor<ToolbarAction<T>>, getFlags: () => InteractionFlags) => JSX.Element;
        /** Draws one item inside the overflow menu. */
        renderOverflowItem: MenuRenderItem<T>;
    };

export type ToolbarMenusProps<T> = Pick<BaseToolbarMenusValues, "role"> &
    AccessorValues<Omit<BaseToolbarMenusValues, "role">> &
    AccessorProps<{
        /** Draws the surface the items sit on, in every menu the bar opens, the overflow menu included. */
        renderPopup: MenuRenderPopup;
    }> & {
        /**
         * The words, in the order they are shown, each carrying the menu it opens. Whatever does not fit moves into the
         * overflow menu, where a word becomes an item whose submenu is its menu.
         */
        actions: MaybeAccessor<MenubarAction<T>[]>;
        /**
         * Which values are currently checked, for the checkbox and radio items in any of the menus. One list serves every
         * menu, so an item keeps its state when its word is collapsed into the overflow menu.
         */
        checked?: SignalSource<T[]>;
        /** Draws one word. It is told whether that word's menu is open. */
        renderAction: (
            getAction: Accessor<MenubarAction<T>>,
            getFlags: () => InteractionFlags<MenuFlags>,
        ) => JSX.Element;
        /** Draws one item, in every menu the bar opens, the overflow menu included. */
        renderItem: MenuRenderItem<T>;
    };

export type ToolbarCompositeProps<T> = ToolbarSharedProps<T> & (ToolbarButtonsProps<T> | ToolbarMenusProps<T>);

export type ToolbarProps<T> = ToolbarSharedProps<T> & Omit<ToolbarButtonsProps<T>, "role">;
