import type { ToolbarMenusProps, ToolbarSharedProps } from "../Toolbar/Toolbar.types.js";
export type MenubarProps<T> = ToolbarSharedProps<T> & Omit<ToolbarMenusProps<T>, "role">;
