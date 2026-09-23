import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type { MenuSubmenuMode, MenuSubmenuTrigger, MenuTriggerRole } from "./Menu.types";

export const MENU_DEFAULTS = {
    submenuPlacement: {
        ltr: { x: "right-out", y: "top-in" },
        rtl: { x: "left-out", y: "top-in" },
    } as Record<NavigatorDirection, AnchorPlacement>,
    submenuMode: "cascade" as MenuSubmenuMode,
    submenuOpensOn: "hover" as MenuSubmenuTrigger,
    triggerRole: "button" as MenuTriggerRole,
};
