import type {
    ToolbarMenusProps,
    ToolbarMenusSlots,
    ToolbarSharedProps,
    ToolbarSharedSlots,
} from "../Toolbar/Toolbar.types";

export type MenubarProps<T> = ToolbarSharedProps<T> & Omit<ToolbarMenusProps<T>, "role">;

export type MenubarSlots<T> = ToolbarSharedSlots & ToolbarMenusSlots<T>;
