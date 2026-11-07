import { type InjectionKey, inject, provide } from "vue";

import type { NavLinkGroupContextType } from "./NavLink.contextVue.types";

const NAV_LINK_GROUP_CONTEXT_KEY: InjectionKey<NavLinkGroupContextType> = Symbol("NavLinkGroupContext");

export const provideNavLinkGroupContext = (value: NavLinkGroupContextType) =>
    provide(NAV_LINK_GROUP_CONTEXT_KEY, value);

export const useNavLinkGroupContext = () => inject(NAV_LINK_GROUP_CONTEXT_KEY, undefined);
