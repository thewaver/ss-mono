import { ToolbarComposite } from "../Toolbar/Toolbar";
import type { MenubarProps } from "./MenubarSolid.types";

export const Menubar = <T,>(props: MenubarProps<T>) => <ToolbarComposite<T> {...props} role={"menubar"} />;
