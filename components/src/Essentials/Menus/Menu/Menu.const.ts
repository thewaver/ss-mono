import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { MenuSubmenuMode, MenuSubmenuTrigger } from "./Menu.types";

export const MENU_DEFAULTS = {
    submenuPlacement: { x: "right-out", y: "top-in" } as AnchorPlacement,
    submenuMode: "cascade" as MenuSubmenuMode,
    submenuOpensOn: "hover" as MenuSubmenuTrigger,
};
