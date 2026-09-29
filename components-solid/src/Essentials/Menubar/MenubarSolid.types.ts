import type { ToolbarMenusProps, ToolbarSharedProps } from "../Toolbar/ToolbarSolid.types";

export type MenubarProps<T> = ToolbarSharedProps<T> & Omit<ToolbarMenusProps<T>, "role">;
