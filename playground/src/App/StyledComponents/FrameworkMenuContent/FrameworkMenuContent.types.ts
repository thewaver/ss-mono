import type { InteractionFlags, MenuFlags, MenuItemFlags } from "@thewaver/ss-components";

export type BaseFrameworkMenuItemValues = {
    flags: InteractionFlags<MenuItemFlags>;
};

export type BaseFrameworkMenuItemProps = BaseFrameworkMenuItemValues;

export type BaseFrameworkMenuTriggerValues = {
    flags: InteractionFlags<MenuFlags>;
};

export type BaseFrameworkMenuTriggerProps = BaseFrameworkMenuTriggerValues;
