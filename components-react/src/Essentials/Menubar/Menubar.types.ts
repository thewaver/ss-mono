import type { ToolbarMenusProps, ToolbarSharedProps } from "../Toolbar/Toolbar.types";

export type MenubarProps<T> = ToolbarSharedProps<T> & Omit<ToolbarMenusProps<T>, "role">;
