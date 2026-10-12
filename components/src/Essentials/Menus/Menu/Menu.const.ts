import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type { MenuSubmenuMode, MenuSubmenuTrigger, MenuTriggerRole } from "./Menu.types";

export const MENU_DEFAULTS = {
    submenuPlacement: {
        ltr: { x: "right_out", y: "top_in" },
        rtl: { x: "left_out", y: "top_in" },
    } as Record<NavigatorDirection, AnchorPlacement>,
    submenuMode: "cascade" as MenuSubmenuMode,
    submenuOpensOn: "hover" as MenuSubmenuTrigger,
    triggerRole: "button" as MenuTriggerRole,
    floaterTransitionDurationMs: 100,
};
