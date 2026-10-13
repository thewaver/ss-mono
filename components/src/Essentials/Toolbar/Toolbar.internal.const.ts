import type { MenuItemKind, MenuTriggerRole } from "../Menus/Menu/Menu.types";
import { ToolbarUtils } from "./Toolbar.utils";

export namespace ToolbarConst {
    export const OVERFLOW_STOP = ToolbarUtils.OVERFLOW_STOP;
    export const NO_RADIO_GROUP: never[] = [];
    export const PRESSED_ITEM_KIND: MenuItemKind = "checkbox";
    export const WORD_ROLE: MenuTriggerRole = "menuitem";
}
